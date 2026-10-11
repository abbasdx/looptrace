package com.looptrace.dto;

import com.looptrace.model.ParticipantRole;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @Email @NotBlank private String email;
    @Size(min = 6, max = 128) private String password;
    @NotNull private ParticipantRole role;
    @Size(max = 255) private String participantId;
}
