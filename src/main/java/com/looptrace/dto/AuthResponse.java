package com.looptrace.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String accessToken;
    String userId;
    String email;
    String role;
    String participantId;
}
