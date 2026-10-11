package com.looptrace.service;

import com.looptrace.dto.ImpactResponse;
import com.looptrace.model.PickupRequest;
import com.looptrace.model.PickupStatus;
import com.looptrace.repository.LoopTraceStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class ImpactService {

    private final LoopTraceStore store;

    public ImpactResponse getImpact() {
        List<PickupRequest> all = List.copyOf(store.requests.values());

        List<PickupRequest> done = all.stream()
                .filter(r -> r.getStatus() == PickupStatus.HANDED_OFF)
                .toList();

        double totalWeight = 0.0;
        Map<String, Double> byCategory = new TreeMap<>();

        for (PickupRequest r : done) {
            double w = r.getActualWeightKg() == null ? 0.0 : r.getActualWeightKg();
            totalWeight += w;
            byCategory.merge(r.getMaterialCategory(), w, Double::sum);
        }
        byCategory.replaceAll((k, v) -> round(v));

        return ImpactResponse.builder()
                .totalRequests(all.size())
                .activeRequests(all.size() - done.size())
                .completedHandoffs(done.size())
                .totalCollectedWeightKg(round(totalWeight))
                .weightByCategoryKg(byCategory)
                .build();
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}