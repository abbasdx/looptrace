
package com.looptrace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AcceptPickupRequest {

    @NotBlank
    private String collectorId;
}
