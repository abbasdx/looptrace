
package com.looptrace.dto;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class ImpactResponse {

    private long totalRequests;
    private long activeRequests;
    private long completedHandoffs;
    private double totalCollectedWeightKg;
    private Map<String, Double> weightByCategoryKg;
}
