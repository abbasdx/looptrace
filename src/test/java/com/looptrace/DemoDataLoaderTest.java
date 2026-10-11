package com.looptrace;

import com.looptrace.config.DemoDataLoader;
import com.looptrace.model.PickupRequest;
import com.looptrace.repository.LoopTraceStore;
import com.looptrace.service.ImpactService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Set;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(properties = {
        "looptrace.seed-demo=true",
        "GEMINI_API_KEY=test-key"
})
class DemoDataLoaderTest {

    @Autowired
    private LoopTraceStore store;

    @Autowired
    private DemoDataLoader loader;

    @Autowired
    private ImpactService impactService;

    @Test
    void seedsFiveDistinctDemoCategoriesAndCompletedImpactData() {
        Set<String> categories = store.requests.values().stream()
                .filter(PickupRequest::isDemo)
                .map(PickupRequest::getMaterialCategory)
                .collect(Collectors.toSet());

        assertEquals(Set.of("MOBILE", "LAPTOP", "BATTERY", "TABLET", "CABLES"),
                categories);
        assertTrue(store.requests.values().stream()
                .filter(PickupRequest::isDemo)
                .anyMatch(request -> request.getStatus().name().equals("HANDED_OFF")));
        assertEquals(5, impactService.getImpact().getTotalRequests());
        assertEquals(1, impactService.getImpact().getCompletedHandoffs());
    }

    @Test
    void doesNotDuplicateDemoDataWhenRunnerIsInvokedAgain() {
        long before = store.requests.values().stream()
                .filter(PickupRequest::isDemo)
                .count();

        loader.run();
        assertEquals(5, before);
        assertEquals(before, store.requests.values().stream()
                .filter(PickupRequest::isDemo)
                .count());
    }
}
