
package com.looptrace.dto;

import com.looptrace.model.PickupStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class PickupResponse {

    private String id;
    private String householdName;
    private boolean demo;
    private String materialCategory;
    private double estimatedWeightKg;
    private String pickupArea;
    private double latitude;
    private double longitude;
    private String weightNote;

    private String photoKey;
    private String aiResult;
    private String safetyGuidance;

    private String collectorId;
    private Double distanceKm;

    private PickupStatus status;
    private Instant createdAt;

    private Double actualWeightKg;
    private String recyclerId;
    private Instant handedOffAt;
    private Instant recyclerReceivedAt;
    private PickupStatus recyclingStatus;
}
