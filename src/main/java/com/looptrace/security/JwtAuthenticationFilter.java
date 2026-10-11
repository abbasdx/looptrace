package com.looptrace.security;

import com.looptrace.model.AppUser;
import com.looptrace.repository.AppUserRepository;
import com.looptrace.repository.CollectorRepository;
import com.looptrace.repository.RecyclerRepository;
import com.looptrace.model.ParticipantRole;
import com.looptrace.model.ParticipantStatus;
import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final AppUserRepository users;
    private final CollectorRepository collectors;
    private final RecyclerRepository recyclers;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI().substring(request.getContextPath().length());
        return path.equals("/api/impact") || path.startsWith("/api/impact/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                Claims claims = jwtService.parse(header.substring(7)).getPayload();
                AppUser user = users.findById(claims.getSubject()).filter(AppUser::isEnabled).orElse(null);
                if (user != null && participantStillApproved(user)) {
                    var authentication = new UsernamePasswordAuthenticationToken(
                            new AuthenticatedUser(user), null,
                            java.util.List.of(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                    "ROLE_" + user.getRole().name())));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (RuntimeException ignored) {
                // Invalid tokens remain unauthenticated and are rejected by route authorization.
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean participantStillApproved(AppUser user) {
        if (user.getRole() == ParticipantRole.COLLECTOR) {
            return user.getParticipantId() != null && collectors.findById(user.getParticipantId())
                    .map(c -> c.getStatus() == ParticipantStatus.APPROVED).orElse(false);
        }
        if (user.getRole() == ParticipantRole.RECYCLER) {
            return user.getParticipantId() != null && recyclers.findById(user.getParticipantId())
                    .map(r -> r.getStatus() == ParticipantStatus.APPROVED).orElse(false);
        }
        return true;
    }
}
