package com.looptrace.config;

import com.looptrace.model.AppUser;
import com.looptrace.model.ParticipantRole;
import com.looptrace.repository.AppUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Component
public class SuperAdminInitializer implements CommandLineRunner {
    private static final int MIN_PASSWORD_LENGTH = 12;

    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String password;
    private final boolean authEnabled;

    public SuperAdminInitializer(
            AppUserRepository users,
            PasswordEncoder passwordEncoder,
            @Value("${SUPER_ADMIN_EMAIL:}") String email,
            @Value("${SUPER_ADMIN_PASSWORD:}") String password,
            @Value("${looptrace.auth.enabled:true}") boolean authEnabled) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.password = password;
        this.authEnabled = authEnabled;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!authEnabled) {
            return;
        }

        boolean hasEmail = email != null && !email.isBlank();
        boolean hasPassword = password != null && !password.isBlank();
        if (!hasEmail && !hasPassword) {
            log.info("Super Admin bootstrap is not configured; no account was created");
            return;
        }
        if (!hasEmail || !hasPassword) {
            throw new IllegalStateException(
                    "SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be configured together");
        }

        String normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail.contains("@")) {
            throw new IllegalStateException("SUPER_ADMIN_EMAIL must be a valid email address");
        }
        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalStateException(
                    "SUPER_ADMIN_PASSWORD must be at least " + MIN_PASSWORD_LENGTH + " characters");
        }

        if (users.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            log.info("Super Admin account already exists for configured email");
            return;
        }

        users.save(AppUser.builder()
                .id(UUID.randomUUID().toString())
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(password))
                .role(ParticipantRole.SUPER_ADMIN)
                .enabled(true)
                .build());
        log.info("Created configured Super Admin account");
    }
}
