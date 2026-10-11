package com.looptrace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecyclerReceiptRequest {
    @NotBlank
    private String recyclerId;
}
