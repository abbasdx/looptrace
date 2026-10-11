
package com.looptrace.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class PickupRequest {

    @Id
    private String id;
    @Version
    private Long version;

    // Household or shop details
    private String householdName;
    private String ownerUserId;
    private boolean demo;
    private String materialCategory;
    private double estimatedWeightKg;
    private String weightNote;
    private String pickupArea;

    // Location used for nearby collector matching
    private double latitude;
    private double longitude;

    // Optional S3 object key for the uploaded photo
    private String photoKey;

    // AI-assisted result and safety guidance
    private String aiResult;
    private String safetyGuidance;

    // Assigned collector and distance from pickup location
    private String collectorId;
    private Double distanceKm;

    // Current pickup lifecycle state
    @Enumerated(EnumType.STRING)
    private PickupStatus status;

    private Instant createdAt;

    // Populated after actual collection or handoff
    private Double actualWeightKg;
    private String recyclerId;
    private Instant handedOffAt;
    private Instant recyclerReceivedAt;
    @Enumerated(EnumType.STRING)
    private PickupStatus recyclingStatus;
}
