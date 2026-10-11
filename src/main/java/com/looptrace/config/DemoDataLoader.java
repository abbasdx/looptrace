package com.looptrace.config;

import com.looptrace.model.PickupRequest;
import com.looptrace.repository.LoopTraceStore;
import com.looptrace.service.PickupService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Set;
import com.looptrace.model.*;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "looptrace.seed-demo", havingValue = "true")
public class DemoDataLoader implements CommandLineRunner {

    private final LoopTraceStore store;
    private final PickupService pickupService;

    @Override
    public void run(String... args) {
        seedParticipants();
        seedHandedOff("Demo Household Mobile", "MOBILE", "Karol Bagh",
                28.6519, 77.1909, 0.32, 24);
        seedPickedUp("Demo Household Laptop", "LAPTOP", "Connaught Place",
                28.6315, 77.2167, 2.40, 17);
        seedAccepted("Demo Household Battery", "BATTERY", "Sector 18, Noida",
                28.5700, 77.3219, 1.10, 11);
        seedMatched("Demo Household Tablet", "TABLET", "Saket",
                28.5245, 77.2066, 0.78, 6);
        seedNew("Demo Household Cables", "CABLES", "Lajpat Nagar",
                28.5677, 77.2433, 1.65, 2);
    }

    private void seedParticipants() {
        putCollector(Collector.builder().id("COL-001").name("Demo Collector Delhi")
                .latitude(28.6139).longitude(77.2090)
                .acceptedCategories(Set.of("MOBILE", "LAPTOP", "TABLET"))
                .status(ParticipantStatus.APPROVED).demo(true).build());
        putCollector(Collector.builder().id("COL-002").name("Demo Collector Noida")
                .latitude(28.5355).longitude(77.3910)
                .acceptedCategories(Set.of("MOBILE", "BATTERY", "CABLES"))
                .status(ParticipantStatus.APPROVED).demo(true).build());
        putCollector(Collector.builder().id("COL-003").name("Demo Collector Gurgaon")
                .latitude(28.4595).longitude(77.0266).acceptedCategories(Set.of("MOBILE","LAPTOP","CABLES"))
                .status(ParticipantStatus.APPROVED).demo(true).build());
        putCollector(Collector.builder().id("COL-004").name("Demo Collector Ghaziabad")
                .latitude(28.6692).longitude(77.4538).acceptedCategories(Set.of("TABLET","BATTERY","CABLES"))
                .status(ParticipantStatus.APPROVED).demo(true).build());
        putCollector(Collector.builder().id("COL-005").name("Demo Collector Faridabad")
                .latitude(28.4089).longitude(77.3178).acceptedCategories(Set.of("MOBILE","LAPTOP","BATTERY"))
                .status(ParticipantStatus.APPROVED).demo(true).build());
        putRecycler(Recycler.builder().id("REC-001").name("Demo E-Waste Recycling Facility")
                .latitude(28.4595).longitude(77.0266)
                .acceptedCategories(Set.of("MOBILE", "LAPTOP", "TABLET", "BATTERY", "CABLES"))
                .verified(false).status(ParticipantStatus.APPROVED).demo(true).build());
        putRecycler(Recycler.builder().id("REC-007").name("Demo Circular Materials Plant")
                .latitude(28.62).longitude(77.30).acceptedCategories(Set.of("MOBILE","LAPTOP","TABLET","BATTERY","CABLES"))
                .verified(false).status(ParticipantStatus.APPROVED).demo(true).build());
        if (!store.applications.containsKey("APP-001")) store.save(ParticipantApplication.builder()
                .id("APP-001").role(ParticipantRole.COLLECTOR).name("Demo Pending Collector")
                .email("demo.collector@looptrace.test").status(ApplicationStatus.PENDING)
                .demo(true).createdAt(Instant.now()).build());
    }
    private void putCollector(Collector seed) {
        Collector existing = store.collectors.get(seed.getId());
        if (existing == null) {
            store.save(seed);
        } else if (existing.isDemo()
                && (existing.getAcceptedCategories() == null
                || existing.getAcceptedCategories().isEmpty())) {
            existing.setAcceptedCategories(seed.getAcceptedCategories());
            store.save(existing);
        }
    }

    private void putRecycler(Recycler seed) {
        Recycler existing = store.recyclers.get(seed.getId());
        if (existing == null) {
            store.save(seed);
        } else if (existing.isDemo()
                && (existing.getAcceptedCategories() == null
                || existing.getAcceptedCategories().isEmpty())) {
            existing.setAcceptedCategories(seed.getAcceptedCategories());
            store.save(existing);
        }
    }

    private void seedHandedOff(String name, String category, String area,
                                double lat, double lon, double weightKg, int daysAgo) {
        PickupRequest request = createIfMissing(
                name, category, area, lat, lon, weightKg, daysAgo);
        if (request == null || request.getStatus() == com.looptrace.model.PickupStatus.HANDED_OFF) {
            return;
        }
        String collectorId = request.getCollectorId();
        if (collectorId != null) {
            pickupService.accept(request.getId(), collectorId);
            pickupService.markPickedUp(request.getId(), collectorId, weightKg);
            pickupService.handoff(request.getId(), collectorId, "REC-001", weightKg);
        }
    }

    private void seedPickedUp(String name, String category, String area,
                               double lat, double lon, double weightKg, int daysAgo) {
        PickupRequest request = createIfMissing(
                name, category, area, lat, lon, weightKg, daysAgo);
        if (request == null || request.getStatus() == com.looptrace.model.PickupStatus.PICKED_UP) {
            return;
        }
        String collectorId = request.getCollectorId();
        if (collectorId != null) {
            pickupService.accept(request.getId(), collectorId);
            pickupService.markPickedUp(request.getId(), collectorId, weightKg);
        }
    }

    private void seedAccepted(String name, String category, String area,
                              double lat, double lon, double weightKg, int daysAgo) {
        PickupRequest request = createIfMissing(
                name, category, area, lat, lon, weightKg, daysAgo);
        if (request == null || request.getStatus() == com.looptrace.model.PickupStatus.ACCEPTED) {
            return;
        }
        String collectorId = request.getCollectorId();
        if (collectorId != null) {
            pickupService.accept(request.getId(), collectorId);
        }
    }

    private void seedMatched(String name, String category, String area,
                             double lat, double lon, double weightKg, int daysAgo) {
        createIfMissing(name, category, area, lat, lon, weightKg, daysAgo);
    }

    private void seedNew(String name, String category, String area,
                         double lat, double lon, double weightKg, int daysAgo) {
        PickupRequest request = createIfMissing(
                name, category, area, lat, lon, weightKg, daysAgo);
        if (request != null && request.getCollectorId() != null) {
            request.setCollectorId(null);
            request.setDistanceKm(null);
            request.setStatus(com.looptrace.model.PickupStatus.NEW);
            store.save(request);
        }
    }

    private PickupRequest createIfMissing(String name, String category, String area,
                                          double lat, double lon, double weightKg,
                                          int daysAgo) {
        PickupRequest existing = store.requests.values().stream()
                .filter(PickupRequest::isDemo)
                .filter(request -> name.equals(request.getHouseholdName()))
                .findFirst()
                .orElse(null);
        if (existing != null) {
            return existing;
        }

        PickupRequest request = pickupService.create(PickupRequest.builder()
                .householdName(name)
                .demo(true)
                .materialCategory(category)
                .estimatedWeightKg(weightKg)
                .pickupArea(area)
                .latitude(lat)
                .longitude(lon)
                .build());
        request.setCreatedAt(Instant.now().minus(daysAgo, ChronoUnit.DAYS));
        store.save(request);
        return request;
    }
}
