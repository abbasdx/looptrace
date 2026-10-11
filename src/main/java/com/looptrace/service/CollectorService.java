package com.looptrace.service;

import com.looptrace.model.Collector;
import com.looptrace.model.PickupRequest;
import com.looptrace.model.ParticipantStatus;
import com.looptrace.model.PickupStatus;
import com.looptrace.repository.LoopTraceStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CollectorService {

    private final LoopTraceStore store;

    public List<Collector> getAllCollectors() {
        return store.collectors.values().stream()
                .filter(c -> c.getStatus() == ParticipantStatus.APPROVED)
                .toList();
    }

    public Collector getById(String id) {
        Collector collector = id == null ? null : store.collectors.get(id);
        if (collector == null) {
            throw new IllegalArgumentException("Collector not found: " + id);
        }
        if (collector.getStatus() != ParticipantStatus.APPROVED) {
            throw new IllegalStateException("Collector is not approved");
        }
        return collector;
    }

    /** Collectors that accept the request's category, nearest first. */
    public List<Collector> findMatching(PickupRequest request) {
        String category = normalize(request.getMaterialCategory());

        return store.collectors.values().stream()
                .filter(c -> c.getAcceptedCategories() != null)
                .filter(c -> c.getStatus() == ParticipantStatus.APPROVED)
                .filter(this::isAvailable)
                .filter(c -> c.getAcceptedCategories().stream()
                        .anyMatch(x -> normalize(x).equals(category)))
                .sorted(Comparator.comparingDouble(c -> distanceKm(
                        request.getLatitude(), request.getLongitude(),
                        c.getLatitude(), c.getLongitude())))
                .toList();
    }

    public boolean isAvailable(Collector collector) {
        return store.requests.values().stream()
                .noneMatch(request -> collector.getId().equals(request.getCollectorId())
                        && request.getStatus() != null
                        && request.getStatus() != PickupStatus.HANDED_OFF);
    }

    /** Haversine distance in kilometres. */
    public double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        return 6371.0 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    public double roundDistance(double distance) {
        return Math.round(distance * 100.0) / 100.0;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }
}