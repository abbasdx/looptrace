package com.looptrace.security;

import com.looptrace.model.AppUser;
import lombok.Getter;

@Getter
public class AuthenticatedUser {
    private final String id;
    private final String email;
    private final String role;
    private final String participantId;

    public AuthenticatedUser(AppUser user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.participantId = user.getParticipantId();
    }
}
