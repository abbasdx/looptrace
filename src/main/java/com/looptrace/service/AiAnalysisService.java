package com.looptrace.service;

import com.google.genai.Client;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.Part;
import com.looptrace.dto.AiAnalysisResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.databind.json.JsonMapper;

import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Service
public class AiAnalysisService {
    private static final int MAX_ATTEMPTS = 3;

    private static final Set<String> CATEGORIES = Set.of(
            "MOBILE", "LAPTOP", "TABLET", "BATTERY", "CABLES", "OTHER"
    );

    private static final String SYSTEM_PROMPT = """
            You help households in India hand over electronic waste safely.
            Inspect the supplied image and return ONLY a valid JSON object with:
            category: one of MOBILE, LAPTOP, TABLET, BATTERY, CABLES, OTHER
            itemDescription: short description of the visible item
            hazards: array of short strings; empty if none are visibly or
                     reasonably associated with the item
            safeHandling: one or two practical sentences
            recoverableMaterials: array of materials generally recoverable
            confidence: number between 0 and 1
            If the image does not show electronic waste, use category OTHER,
            confidence below 0.3, and explain why in itemDescription.
            Do not give prices. Do not claim certainty about hazards that
            cannot be determined from the image.
            """;

    private final Client client;
    private final JsonMapper json = JsonMapper.builder().build();
    private final String modelId;

    public AiAnalysisService(
            @Value("${looptrace.ai.model-id:gemini-3.5-flash-lite}")
            String modelId,
            @Value("${looptrace.ai.api-key:}") String apiKey) {

        this.modelId = modelId;
        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public AiAnalysisResponse analyze(byte[] imageBytes, String contentType) {
        if (imageBytes == null || imageBytes.length == 0) {
            throw new IllegalArgumentException("Image is empty");
        }

        if (contentType == null ||
                !Set.of("image/jpeg", "image/jpg", "image/png", "image/webp")
                        .contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException(
                    "Only JPEG, PNG or WEBP images are supported");
        }

        try {
            String prompt = SYSTEM_PROMPT
                    + "\nIdentify the electronic-waste item in this image.";

            Content content = Content.fromParts(
                    Part.fromText(prompt),
                    Part.fromBytes(imageBytes, contentType)
            );

            var config = GenerateContentConfig.builder()
                    .temperature(0.0f)
                    .maxOutputTokens(500)
                    .responseMimeType("application/json")
                    .build();
            var response = generateWithRetry(modelId, content, config);

            String text = response.text();

            if (text == null || text.isBlank()) {
                throw new IllegalStateException(
                        "Gemini returned an empty response");
            }

            return normalize(json.readValue(
                    stripFences(text), AiAnalysisResponse.class));

        } catch (Exception e) {
            log.warn("Gemini analysis failed: {}", e.toString());
            throw providerFailure(e);
        }
    }

    private com.google.genai.types.GenerateContentResponse generateWithRetry(
            String model, Content content, GenerateContentConfig config) {
        Exception last = null;
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                return client.models.generateContent(model, content, config);
            } catch (Exception exception) {
                last = exception;
                if (attempt == MAX_ATTEMPTS || !isRetryable(exception)) {
                    throw exception;
                }
                long delay = (long) Math.pow(2, attempt - 1) * 500L
                        + ThreadLocalRandom.current().nextLong(250L);
                log.warn("Retryable Gemini failure on attempt {}/{}; retrying in {} ms",
                        attempt, MAX_ATTEMPTS, delay);
                try {
                    Thread.sleep(delay);
                } catch (InterruptedException interrupted) {
                    Thread.currentThread().interrupt();
                    throw new IllegalStateException("Gemini retry interrupted", interrupted);
                }
            }
        }
        throw new IllegalStateException("Gemini request failed", last);
    }

    private boolean isRetryable(Exception exception) {
        String message = exception.getMessage();
        if (message == null) return false;
        String lower = message.toLowerCase(Locale.ROOT);
        return lower.contains("429") || lower.contains("500") || lower.contains("502")
                || lower.contains("503") || lower.contains("504")
                || lower.contains("timeout") || lower.contains("temporarily unavailable");
    }

    AiProviderException providerFailure(Exception cause) {
        return new AiProviderException("Automatic image analysis is unavailable", cause);
    }

    AiAnalysisResponse normalize(AiAnalysisResponse r) {
        if (r == null
                || r.getCategory() == null
                || r.getCategory().isBlank()
                || r.getItemDescription() == null
                || r.getItemDescription().isBlank()
                || r.getSafeHandling() == null
                || r.getSafeHandling().isBlank()
                || r.getHazards() == null
                || r.getRecoverableMaterials() == null) {
            throw new IllegalArgumentException(
                    "Gemini response is missing required fields");
        }

        if (r.getConfidence() == null
                || !Double.isFinite(r.getConfidence())
                || r.getConfidence() < 0.0
                || r.getConfidence() > 1.0) {
            throw new IllegalArgumentException(
                    "Gemini confidence must be between 0 and 1");
        }

        String category = r.getCategory().trim().toUpperCase(Locale.ROOT);

        if (!CATEGORIES.contains(category)) {
            category = "OTHER";
        }

        r.setCategory(category);

        if (r.getHazards() == null) {
            r.setHazards(List.of());
        }

        if (r.getRecoverableMaterials() == null) {
            r.setRecoverableMaterials(List.of());
        }

        if (r.getConfidence() == null) {
            r.setConfidence(0.0);
        }

        r.setSource("GEMINI");
        return r;
    }

    private String stripFences(String text) {
        String t = text.trim();

        if (t.startsWith("```")) {
            t = t.replaceFirst("^```(?:json)?\\s*", "")
                    .replaceFirst("\\s*```$", "")
                    .trim();
        }

        return t;
    }
}