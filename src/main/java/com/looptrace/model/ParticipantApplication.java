package com.looptrace.model;

import lombok.*;
import java.time.Instant;
import java.util.Set;
import jakarta.persistence.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
public class ParticipantApplication {
    @Id
    private String id;
    @Enumerated(EnumType.STRING)
    private ParticipantRole role;
    private String name;
    private String email;
    private String phone;
    private String registrationReference;
    private double latitude;
    private double longitude;
    @ElementCollection
    @CollectionTable(name = "application_categories", joinColumns = @JoinColumn(name = "application_id"))
    private Set<String> acceptedCategories;
    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;
    private boolean demo;
    private Instant createdAt;
}
