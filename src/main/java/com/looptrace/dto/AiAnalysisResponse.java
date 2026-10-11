package com.looptrace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiAnalysisResponse {
    private String category;              // MOBILE, LAPTOP, TABLET, BATTERY, CABLES, OTHER
    private String itemDescription;
    private List<String> hazards;
    private String safeHandling;
    private List<String> recoverableMaterials;
    private Double confidence;            // 0 to 1
    private String source;                // BEDROCK or FALLBACK
    private String photoKey;
}