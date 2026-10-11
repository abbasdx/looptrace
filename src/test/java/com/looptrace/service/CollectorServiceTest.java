package com.looptrace.service;

import com.looptrace.model.Collector;
import com.looptrace.model.ParticipantStatus;
import com.looptrace.model.PickupRequest;
import com.looptrace.repository.LoopTraceStore;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;

class CollectorServiceTest {

    @Test
    void matchesEligibleCategoryByNearestDistanceAndSkipsBusyCollector() {
        LoopTraceStore store = new LoopTraceStore();
        store.add(Collector.builder().id("near").name("Near").latitude(28.46).longitude(77.02)
                .acceptedCategories(Set.of("MOBILE")).status(ParticipantStatus.APPROVED).build());
        store.add(Collector.builder().id("far").name("Far").latitude(28.70).longitude(77.30)
                .acceptedCategories(Set.of("MOBILE")).status(ParticipantStatus.APPROVED).build());
        store.save(PickupRequest.builder().id("active").collectorId("near")
                .status(com.looptrace.model.PickupStatus.ACCEPTED).build());

        List<Collector> matches = new CollectorService(store).findMatching(
                PickupRequest.builder().materialCategory("MOBILE")
                        .latitude(28.4595).longitude(77.0266).build());

        assertEquals(List.of("far"), matches.stream().map(Collector::getId).toList());
    }
}
