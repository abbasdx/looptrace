package com.looptrace.service;

import com.looptrace.dto.AiAnalysisResponse;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class AiAnalysisServiceTest {

    private final AiAnalysisService service =
            new AiAnalysisService("test-model", "test-key");

    @Test
    void acceptsValidGeminiResponse() {
        AiAnalysisResponse response = service.normalize(AiAnalysisResponse.builder()
                .category("mobile")
                .itemDescription("Mobile phone")
                .hazards(List.of())
                .safeHandling("Keep dry.")
                .recoverableMaterials(List.of("Aluminium"))
                .confidence(0.8)
                .build());

        assertEquals("MOBILE", response.getCategory());
        assertEquals("GEMINI", response.getSource());
    }

    @Test
    void rejectsConfidenceOutsideDocumentedRange() {
        AiAnalysisResponse response = validResponse();
        response.setConfidence(1.1);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.normalize(response));

        assertEquals("Gemini confidence must be between 0 and 1",
                exception.getMessage());
    }

    @Test
    void rejectsMissingRequiredResponseFields() {
        AiAnalysisResponse response = validResponse();
        response.setSafeHandling(null);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.normalize(response));

        assertEquals("Gemini response is missing required fields",
                exception.getMessage());
    }

    @Test
    void exposesProviderFailureInsteadOfFabricatingAnalysis() {
        AiProviderException exception = service.providerFailure(
                new IllegalStateException("provider unavailable"));

        assertEquals("Automatic image analysis is unavailable",
                exception.getMessage());
    }

    private AiAnalysisResponse validResponse() {
        return AiAnalysisResponse.builder()
                .category("OTHER")
                .itemDescription("Electronic item")
                .hazards(List.of())
                .safeHandling("Keep dry.")
                .recoverableMaterials(List.of())
                .confidence(0.5)
                .build();
    }
}
