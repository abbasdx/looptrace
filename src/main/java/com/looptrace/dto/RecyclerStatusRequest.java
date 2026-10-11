package com.looptrace.dto;

import com.looptrace.model.PickupStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecyclerStatusRequest {
    @NotBlank
    private String recyclerId;
    @NotNull
    private PickupStatus status;
}
