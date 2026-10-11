package com.looptrace.model;

import lombok.*;
import java.time.Instant;
import java.util.Set;
import jakarta.persistence.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Entity
public class Participant {
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
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "participant_categories", joinColumns = @JoinColumn(name = "participant_id"))
    private Set<String> acceptedCategories;
    @Enumerated(EnumType.STRING)
    private ParticipantStatus status;
    private boolean verified;
    private boolean demo;
    private Instant createdAt;
}
