
package com.looptrace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatePickupRequest {

    @NotBlank
    @Size(max = 120)
    private String householdName;

    @NotBlank
    @Size(max = 40)
    private String materialCategory;

    @NotNull
    @Positive
    private Double estimatedWeightKg;

    @Size(max = 500)
    private String weightNote;

    @Size(max = 2000)
    private String aiResult;
    @Size(max = 2000)
    private String safetyGuidance;

    @NotBlank
    @Size(max = 200)
    private String pickupArea;

    @NotNull
    @DecimalMin("-90.0")
    @DecimalMax("90.0")
    private Double latitude;

    @NotNull
    @DecimalMin("-180.0")
    @DecimalMax("180.0")
    private Double longitude;

    @Size(max = 512)
    private String photoKey;
}
