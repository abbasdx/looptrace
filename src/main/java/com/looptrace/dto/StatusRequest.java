package com.looptrace.dto;
import com.looptrace.model.ParticipantStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data public class StatusRequest { @NotNull private ParticipantStatus status; }
