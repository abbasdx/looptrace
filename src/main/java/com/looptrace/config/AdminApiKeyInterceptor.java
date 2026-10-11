package com.looptrace.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.looptrace.security.AuthenticatedUser;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Component
public class AdminApiKeyInterceptor implements HandlerInterceptor {

    private final String configuredKey;

    public AdminApiKeyInterceptor(
            @Value("${looptrace.admin.api-key:}") String configuredKey) {
        this.configuredKey = configuredKey;
    }

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request,
                             @NonNull HttpServletResponse response,
                             @NonNull Object handler) {
        if (configuredKey.isBlank()) {
            return true;
        }
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof AuthenticatedUser user
                && "SUPER_ADMIN".equals(user.getRole())) {
            return true;
        }

        String suppliedKey = request.getHeader("X-LoopTrace-Admin-Key");
        if (suppliedKey == null || !MessageDigest.isEqual(
                configuredKey.getBytes(StandardCharsets.UTF_8),
                suppliedKey.getBytes(StandardCharsets.UTF_8))) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        return true;
    }
}
