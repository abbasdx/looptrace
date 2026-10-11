package com.looptrace.service;

import com.looptrace.dto.*;
import com.looptrace.model.*;
import com.looptrace.repository.AppUserRepository;
import com.looptrace.repository.CollectorRepository;
import com.looptrace.repository.RecyclerRepository;
import com.looptrace.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final CollectorRepository collectors;
    private final RecyclerRepository recyclers;

    public AuthResponse register(RegisterRequest request) {
        if (request.getRole() == ParticipantRole.SUPER_ADMIN) {
            throw new IllegalArgumentException("SUPER_ADMIN accounts cannot be self-registered");
        }
        if (users.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }
        if (request.getRole() == ParticipantRole.COLLECTOR
                && (request.getParticipantId() == null
                || collectors.findById(request.getParticipantId())
                .filter(c -> c.getStatus() == ParticipantStatus.APPROVED).isEmpty())) {
            throw new IllegalArgumentException("Collector must reference an approved participant");
        }
        if (request.getRole() == ParticipantRole.RECYCLER
                && (request.getParticipantId() == null
                || recyclers.findById(request.getParticipantId())
                .filter(r -> r.getStatus() == ParticipantStatus.APPROVED).isEmpty())) {
            throw new IllegalArgumentException("Recycler must reference an approved participant");
        }
        AppUser user = AppUser.builder()
                .id(UUID.randomUUID().toString())
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .participantId(request.getParticipantId())
                .enabled(true)
                .build();
        return response(users.save(user));
    }

    public AuthResponse login(LoginRequest request) {
        AppUser user = users.findByEmailIgnoreCase(request.getEmail())
                .filter(AppUser::isEnabled)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return response(user);
    }

    private AuthResponse response(AppUser user) {
        return AuthResponse.builder().accessToken(jwtService.issue(user))
                .userId(user.getId()).email(user.getEmail()).role(user.getRole().name())
                .participantId(user.getParticipantId()).build();
    }
}
