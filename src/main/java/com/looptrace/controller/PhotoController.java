package com.looptrace.controller;

import com.looptrace.repository.PhotoObjectRepository;
import com.looptrace.security.AuthenticatedUser;
import com.looptrace.service.S3PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {
    private final PhotoObjectRepository objects;
    private final S3PhotoService photos;

    @GetMapping("/presigned")
    public Map<String, String> presigned(@RequestParam String key, Authentication authentication) {
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        var object = objects.findById(key).orElseThrow(() -> new IllegalArgumentException("Photo not found"));
        if (!object.getOwnerUserId().equals(user.getId()) && !"SUPER_ADMIN".equals(user.getRole())) {
            throw new org.springframework.security.access.AccessDeniedException("Photo access denied");
        }
        return Map.of("url", photos.presignedUrl(object));
    }
}
