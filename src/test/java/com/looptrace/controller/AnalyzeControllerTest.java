package com.looptrace.controller;

import com.looptrace.dto.AiAnalysisResponse;
import com.looptrace.service.AiAnalysisService;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AnalyzeControllerTest {

    @Test
    void acceptsImageMultipartPart() throws Exception {
        AiAnalysisService service = mock(AiAnalysisService.class);
        when(service.analyze(eq("image".getBytes()), eq("image/png")))
                .thenReturn(AiAnalysisResponse.builder().category("OTHER").build());

        MockMvc mockMvc = org.springframework.test.web.servlet.setup.MockMvcBuilders
                .standaloneSetup(new AnalyzeController(service))
                .build();

        mockMvc.perform(multipart("/api/analyze")
                        .file(new MockMultipartFile(
                                "image", "item.png", "image/png", "image".getBytes())))
                .andExpect(status().isOk());

        verify(service).analyze(eq("image".getBytes()), eq("image/png"));
    }
}
