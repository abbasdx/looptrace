package com.looptrace.service;

import com.looptrace.dto.*;
import com.looptrace.model.*;
import com.looptrace.repository.AppUserRepository;
import com.looptrace.repository.CollectorRepository;
import com.looptrace.repository.RecyclerRepository;
import com.looptrace.security.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {
    private final AppUserRepository users = mock(AppUserRepository.class);
    private final CollectorRepository collectors = mock(CollectorRepository.class);
    private final RecyclerRepository recyclers = mock(RecyclerRepository.class);
    private final AuthService service = new AuthService(users, new BCryptPasswordEncoder(),
            new JwtService("test-only-secret-that-is-at-least-32-characters", 30, false), collectors, recyclers);

    @Test
    void registrationHashesPasswordAndRejectsSelfAssignedAdmin() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("user@example.test");
        request.setPassword("long-enough-password");
        request.setRole(ParticipantRole.HOUSEHOLD);
        when(users.existsByEmailIgnoreCase(request.getEmail())).thenReturn(false);
        when(users.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        AuthResponse response = service.register(request);
        ArgumentCaptor<AppUser> captor = ArgumentCaptor.forClass(AppUser.class);
        verify(users).save(captor.capture());
        assertNotEquals(request.getPassword(), captor.getValue().getPasswordHash());
        assertTrue(new BCryptPasswordEncoder().matches(request.getPassword(), captor.getValue().getPasswordHash()));
        assertNotNull(response.getAccessToken());

        request.setRole(ParticipantRole.SUPER_ADMIN);
        assertThrows(IllegalArgumentException.class, () -> service.register(request));
    }
}
