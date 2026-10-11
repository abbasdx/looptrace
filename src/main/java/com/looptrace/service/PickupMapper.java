package com.looptrace.service;

import com.looptrace.dto.CreatePickupRequest;
import com.looptrace.dto.CustodyEventResponse;
import com.looptrace.dto.PickupResponse;
import com.looptrace.model.CustodyEvent;
import com.looptrace.model.PickupRequest;
import com.looptrace.model.PickupStatus;
import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Set;

@Component
public class PickupMapper {

    private static final Set<String> SUPPORTED_CATEGORIES = Set.of(
            "MOBILE", "LAPTOP", "TABLET", "BATTERY", "CABLES", "OTHER"
    );

    public PickupRequest toModel(CreatePickupRequest dto) {
        String category = dto.getMaterialCategory().trim().toUpperCase(Locale.ROOT);
        if (!SUPPORTED_CATEGORIES.contains(category)) {
            throw new IllegalArgumentException(
                    "Unsupported material category: " + dto.getMaterialCategory());
        }

        return PickupRequest.builder()
                .householdName(dto.getHouseholdName().trim())
                .materialCategory(category)
                .estimatedWeightKg(dto.getEstimatedWeightKg())
                .weightNote(dto.getWeightNote())
                .pickupArea(dto.getPickupArea().trim())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .photoKey(dto.getPhotoKey())
                .status(PickupStatus.NEW)
                .aiResult(dto.getAiResult())
                .safetyGuidance(dto.getSafetyGuidance())
                .build();
    }

    public PickupResponse toResponse(PickupRequest m) {
        return PickupResponse.builder()
                .id(m.getId())
                .householdName(m.getHouseholdName())
                .demo(m.isDemo())
                .materialCategory(m.getMaterialCategory())
                .estimatedWeightKg(m.getEstimatedWeightKg())
                .pickupArea(m.getPickupArea())
                .latitude(m.getLatitude())
                .longitude(m.getLongitude())
                .weightNote(m.getWeightNote())
                .photoKey(m.getPhotoKey())
                .aiResult(m.getAiResult())
                .safetyGuidance(m.getSafetyGuidance())
                .collectorId(m.getCollectorId())
                .distanceKm(m.getDistanceKm())
                .status(m.getStatus())
                .createdAt(m.getCreatedAt())
                .actualWeightKg(m.getActualWeightKg())
                .recyclerId(m.getRecyclerId())
                .handedOffAt(m.getHandedOffAt())
                .recyclerReceivedAt(m.getRecyclerReceivedAt())
                .recyclingStatus(m.getRecyclingStatus())
                .build();
    }

    public CustodyEventResponse toCustodyResponse(CustodyEvent e) {
        return CustodyEventResponse.builder()
                .id(e.getId())
                .requestId(e.getRequestId())
                .step(e.getStep())
                .actor(e.getActor())
                .weightKg(e.getWeightKg())
                .photoKey(e.getPhotoKey())
                .timestamp(e.getTimestamp())
                .previousHash(e.getPreviousHash())
                .hash(e.getHash())
                .build();
    }
}