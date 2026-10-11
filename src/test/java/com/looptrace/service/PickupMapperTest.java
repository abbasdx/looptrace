package com.looptrace.service;

import com.looptrace.dto.CreatePickupRequest;
import com.looptrace.dto.PickupResponse;
import com.looptrace.model.PickupRequest;
import com.looptrace.model.PickupStatus;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PickupMapperTest {

    private final PickupMapper mapper = new PickupMapper();

    @Test
    void mapsWeightNoteToPickupResponse() {
        PickupRequest request = PickupRequest.builder()
                .weightNote("FLAG: handoff weight differs by 20.0% from pickup weight")
                .build();

        PickupResponse response = mapper.toResponse(request);

        assertEquals(request.getWeightNote(), response.getWeightNote());
    }

    @Test
    void rejectsUnsupportedMaterialCategory() {
        CreatePickupRequest request = new CreatePickupRequest();
        request.setMaterialCategory("plastic");

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> mapper.toModel(request));

        assertEquals("Unsupported material category: plastic", exception.getMessage());
    }

    @Test
    void mapsRecyclerProgressToPickupResponse() {
        PickupRequest request = PickupRequest.builder()
                .recyclingStatus(PickupStatus.RECYCLING_PROCESSING)
                .status(PickupStatus.RECYCLING_PROCESSING)
                .build();

        PickupResponse response = mapper.toResponse(request);

        assertEquals(PickupStatus.RECYCLING_PROCESSING, response.getRecyclingStatus());
        assertEquals(PickupStatus.RECYCLING_PROCESSING, response.getStatus());
    }
}
