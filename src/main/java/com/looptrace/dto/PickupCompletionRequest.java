
package com.looptrace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PickupCompletionRequest {

    @NotBlank
    private String collectorId;

    @NotNull
    @Positive
    private Double actualWeightKg;
}
