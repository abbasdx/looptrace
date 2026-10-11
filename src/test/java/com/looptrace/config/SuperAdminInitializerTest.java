package com.looptrace.config;

import com.looptrace.model.AppUser;
import com.looptrace.model.ParticipantRole;
import com.looptrace.repository.AppUserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SuperAdminInitializerTest {
    private final AppUserRepository users = mock(AppUserRepository.class);
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Test
    void createsHashedSuperAdminOnce() {
        when(users.findByEmailIgnoreCase("admin@example.com")).thenReturn(java.util.Optional.empty());
        SuperAdminInitializer initializer = new SuperAdminInitializer(
                users, encoder, " admin@example.com ", "a-strong-password", true);

        initializer.run();

        var captor = org.mockito.ArgumentCaptor.forClass(AppUser.class);
        verify(users).save(captor.capture());
        AppUser saved = captor.getValue();
        assertEquals("admin@example.com", saved.getEmail());
        assertEquals(ParticipantRole.SUPER_ADMIN, saved.getRole());
        assertTrue(saved.isEnabled());
        assertTrue(encoder.matches("a-strong-password", saved.getPasswordHash()));
        assertNotEquals("a-strong-password", saved.getPasswordHash());
    }

    @Test
    void doesNotOverwriteExistingAccount() {
        when(users.findByEmailIgnoreCase("admin@example.com"))
                .thenReturn(java.util.Optional.of(AppUser.builder().email("admin@example.com").build()));
        SuperAdminInitializer initializer = new SuperAdminInitializer(
                users, encoder, "admin@example.com", "a-strong-password", true);

        initializer.run();

        verify(users, never()).save(any());
    }

    @Test
    void rejectsPartiallyConfiguredCredentials() {
        SuperAdminInitializer initializer = new SuperAdminInitializer(
                users, encoder, "admin@example.com", "", true);

        assertThrows(IllegalStateException.class, initializer::run);
        verifyNoInteractions(users);
    }
}
