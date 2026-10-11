package com.looptrace.dto;

import com.looptrace.model.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.Set;

@Data
public class ParticipantRequest {
    @NotBlank private String name;
    private ParticipantRole role;
    private String email;
    private String phone;
    private String registrationReference;
    private double latitude;
    private double longitude;
    private Set<String> acceptedCategories;
}
