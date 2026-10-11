package com.looptrace.controller;

import com.looptrace.dto.AiAnalysisResponse;
import com.looptrace.service.AiAnalysisService;
import com.looptrace.service.S3PhotoService;
import com.looptrace.security.AuthenticatedUser;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class AnalyzeController {

    private final AiAnalysisService aiAnalysisService;
    private final S3PhotoService photoService;

    public AnalyzeController(AiAnalysisService aiAnalysisService) {
        this(aiAnalysisService, null);
    }

    @Autowired
    public AnalyzeController(AiAnalysisService aiAnalysisService, S3PhotoService photoService) {
        this.aiAnalysisService = aiAnalysisService;
        this.photoService = photoService;
    }

    @PostMapping(value = "/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public AiAnalysisResponse analyze(@RequestPart("image") MultipartFile image,
                                      Authentication authentication) throws IOException {
        if (image.isEmpty()) {
            throw new IllegalArgumentException("Image is required");
        }
        if (image.getSize() > 4_000_000) {
            throw new IllegalArgumentException("Image must be under 4 MB");
        }
        AiAnalysisResponse response = aiAnalysisService.analyze(image.getBytes(), image.getContentType());
        if (photoService != null && photoService.configured() && authentication != null) {
            String ownerId = ((AuthenticatedUser) authentication.getPrincipal()).getId();
            response.setPhotoKey(photoService.store(image, ownerId).getKey());
        }
        return response;
    }
}