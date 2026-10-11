package com.looptrace.service;

import com.looptrace.model.Collector;
import com.looptrace.model.PickupRequest;
import com.looptrace.model.PickupStatus;
import com.looptrace.repository.LoopTraceStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PickupService {

    private static final double WEIGHT_TOLERANCE_PERCENT = 10.0;

    private final LoopTraceStore store;
    private final CollectorService collectorService;
    private final RecyclerService recyclerService;
    private final CustodyService custodyService;

    @Transactional
    public synchronized PickupRequest create(PickupRequest request) {
        request.setId(UUID.randomUUID().toString());
        request.setCreatedAt(Instant.now());
        request.setStatus(PickupStatus.NEW);

        List<Collector> matches = collectorService.findMatching(request);
        if (!matches.isEmpty()) {
            assign(request, matches.get(0));
        }

        store.save(request);

        custodyService.recordEvent(request.getId(), "REQUEST_CREATED",
                "HOUSEHOLD", request.getEstimatedWeightKg(), request.getPhotoKey());

        return request;
    }

    /** Retry matching for a request that had no compatible collector. */
    @Transactional
    public synchronized PickupRequest rematch(String requestId) {
        PickupRequest request = getById(requestId);

        if (request.getStatus() != PickupStatus.NEW) {
            throw new IllegalStateException("Only unmatched requests can be re-matched");
        }

        List<Collector> matches = collectorService.findMatching(request);
        if (matches.isEmpty()) {
            throw new IllegalStateException(
                    "No collector currently accepts " + request.getMaterialCategory());
        }

        assign(request, matches.get(0));
        store.save(request);
        return request;
    }

    @Transactional
    public synchronized PickupRequest confirmRecyclerReceipt(String requestId, String recyclerId) {
        PickupRequest request = getById(requestId);
        validateRecycler(request, recyclerId);
        if (request.getStatus() != PickupStatus.HANDED_OFF) {
            throw new IllegalStateException("Request is not awaiting recycler receipt");
        }
        request.setStatus(PickupStatus.RECYCLER_RECEIVED);
        request.setRecyclingStatus(PickupStatus.RECYCLER_RECEIVED);
        request.setRecyclerReceivedAt(Instant.now());
        custodyService.recordEvent(requestId, "RECYCLER_RECEIVED",
                recyclerId, request.getActualWeightKg(), null);
        store.save(request);
        return request;
    }

    @Transactional
    public synchronized PickupRequest updateRecyclingStatus(String requestId, String recyclerId,
                                                             PickupStatus status) {
        PickupRequest request = getById(requestId);
        validateRecycler(request, recyclerId);
        if (status != PickupStatus.RECYCLING_PROCESSING
                && status != PickupStatus.RECYCLING_COMPLETED) {
            throw new IllegalArgumentException("Invalid recycling status");
        }
        if (request.getStatus() != PickupStatus.RECYCLER_RECEIVED
                && request.getStatus() != PickupStatus.RECYCLING_PROCESSING) {
            throw new IllegalStateException("Recycler must confirm receipt first");
        }
        request.setStatus(status);
        request.setRecyclingStatus(status);
        custodyService.recordEvent(requestId, status.name(), recyclerId,
                request.getActualWeightKg(), null);
        store.save(request);
        return request;
    }

    private void assign(PickupRequest request, Collector collector) {
        request.setCollectorId(collector.getId());
        request.setDistanceKm(collectorService.roundDistance(
                collectorService.distanceKm(
                        request.getLatitude(), request.getLongitude(),
                        collector.getLatitude(), collector.getLongitude())));
        request.setStatus(PickupStatus.MATCHED);
    }

    @Transactional
    public synchronized PickupRequest assignCollector(String requestId, String collectorId) {
        PickupRequest request = getById(requestId);
        if (request.getStatus() != PickupStatus.NEW && request.getStatus() != PickupStatus.MATCHED) {
            throw new IllegalStateException("Only new or matched requests can be assigned");
        }
        if (request.getCollectorId() != null) {
            throw new IllegalStateException("Request is already assigned to a collector");
        }
        Collector collector = collectorService.findMatching(request).stream()
                .filter(candidate -> candidate.getId().equals(collectorId))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException(
                        "Collector is not eligible for this request"));
        assign(request, collector);
        store.save(request);
        return request;
    }

    public List<PickupRequest> getAll() {
        return store.requests.values().stream()
                .sorted(Comparator.comparing(PickupRequest::getCreatedAt).reversed())
                .toList();
    }

    public PickupRequest getById(String id) {
        PickupRequest request = id == null ? null : store.requests.get(id);
        if (request == null) {
            throw new IllegalArgumentException("Pickup request not found: " + id);
        }
        return request;
    }

    @Transactional
    public synchronized PickupRequest accept(String requestId, String collectorId) {
        PickupRequest request = getById(requestId);
        collectorService.getById(collectorId);

        if (request.getStatus() != PickupStatus.MATCHED) {
            throw new IllegalStateException("Request is not available for acceptance");
        }
        validateCollector(request, collectorId);

        request.setStatus(PickupStatus.ACCEPTED);
        custodyService.recordEvent(requestId, "REQUEST_ACCEPTED",
                collectorId, null, null);
        store.save(request);
        return request;
    }

    @Transactional
    public synchronized PickupRequest markPickedUp(String requestId,
                                                   String collectorId,
                                                   double actualWeightKg) {
        PickupRequest request = getById(requestId);
        validateCollector(request, collectorId);
        validateWeight(actualWeightKg);

        if (request.getStatus() != PickupStatus.ACCEPTED) {
            throw new IllegalStateException("Accept the request before pickup");
        }

        request.setActualWeightKg(actualWeightKg);
        request.setStatus(PickupStatus.PICKED_UP);
        custodyService.recordEvent(requestId, "PICKED_UP",
                collectorId, actualWeightKg, null);
        store.save(request);
        return request;
    }

    @Transactional
    public synchronized PickupRequest handoff(String requestId,
                                              String collectorId,
                                              String recyclerId,
                                              double actualWeightKg) {
        PickupRequest request = getById(requestId);
        validateCollector(request, collectorId);
        validateWeight(actualWeightKg);

        if (request.getStatus() != PickupStatus.PICKED_UP) {
            throw new IllegalStateException("Record the pickup before handoff");
        }

        recyclerService.validateAcceptance(recyclerId, request.getMaterialCategory());

        request.setWeightNote(describeVariance(request.getActualWeightKg(), actualWeightKg));
        request.setActualWeightKg(actualWeightKg);
        request.setRecyclerId(recyclerId);
        request.setHandedOffAt(Instant.now());
        request.setStatus(PickupStatus.HANDED_OFF);

        custodyService.recordEvent(requestId, "HANDED_OFF",
                recyclerId, actualWeightKg, null);
        store.save(request);
        return request;
    }

    private String describeVariance(Double pickedUpKg, double handedOffKg) {
        if (pickedUpKg == null || pickedUpKg <= 0) {
            return "No pickup weight to compare";
        }
        double percent = Math.abs(handedOffKg - pickedUpKg) / pickedUpKg * 100.0;
        double rounded = Math.round(percent * 10.0) / 10.0;

        return percent > WEIGHT_TOLERANCE_PERCENT
                ? "FLAG: handoff weight differs by " + rounded + "% from pickup weight"
                : "Weights consistent (within " + (int) WEIGHT_TOLERANCE_PERCENT + "%)";
    }

    private void validateCollector(PickupRequest request, String collectorId) {
        if (collectorId == null || !collectorId.equals(request.getCollectorId())) {
            throw new IllegalStateException("Collector is not assigned to this request");
        }
    }

    private void validateRecycler(PickupRequest request, String recyclerId) {
        if (recyclerId == null || !recyclerId.equals(request.getRecyclerId())) {
            throw new IllegalStateException("Recycler is not assigned to this request");
        }
        recyclerService.getById(recyclerId);
    }

    private void validateWeight(double weight) {
        if (!Double.isFinite(weight) || weight <= 0) {
            throw new IllegalArgumentException("Weight must be greater than zero");
        }
    }
}