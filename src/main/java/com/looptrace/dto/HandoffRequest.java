
package com.looptrace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class HandoffRequest {

    @NotBlank
    private String collectorId;

    @NotBlank
    private String recyclerId;

    @NotNull
    @Positive
    private Double actualWeightKg;
}
