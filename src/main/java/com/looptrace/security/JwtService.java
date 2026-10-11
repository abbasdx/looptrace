package com.looptrace.security;

import com.looptrace.model.AppUser;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.security.SecureRandom;

@Service
public class JwtService {
    private final SecretKey key;
    private final long lifetimeMinutes;

    public JwtService(@Value("${looptrace.auth.jwt-secret:}") String secret,
                      @Value("${looptrace.auth.access-token-minutes:30}") long lifetimeMinutes,
                      @Value("${looptrace.auth.enabled:true}") boolean enabled) {
        if (secret.isBlank() || secret.length() < 32) {
            if (enabled) {
                throw new IllegalStateException("LOOPTRACE_JWT_SECRET must be configured with at least 32 characters");
            }
            byte[] demoKey = new byte[32];
            new SecureRandom().nextBytes(demoKey);
            this.key = Keys.hmacShaKeyFor(demoKey);
        } else {
            this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }
        this.lifetimeMinutes = lifetimeMinutes;
    }

    public String issue(AppUser user) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject(user.getId())
                .claim("email", user.getEmail())
                .claim("role", user.getRole().name())
                .claim("participantId", user.getParticipantId())
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusSeconds(lifetimeMinutes * 60)))
                .signWith(key)
                .compact();
    }

    public Jws<Claims> parse(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
    }
}
