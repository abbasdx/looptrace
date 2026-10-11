package com.looptrace.dto;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data public class AssignmentRequest { @NotBlank private String collectorId; }
