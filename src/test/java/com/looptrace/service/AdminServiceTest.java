package com.looptrace.service;

import com.looptrace.dto.ParticipantRequest;
import com.looptrace.model.*;
import com.looptrace.repository.LoopTraceStore;
import org.junit.jupiter.api.Test;
import java.util.Set;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;

class AdminServiceTest {
    @Test
    void createsAndRemovesParticipant() {
        LoopTraceStore store = new LoopTraceStore();
        AdminService service = new AdminService(store, mock(PickupService.class));
        ParticipantRequest request = new ParticipantRequest();
        request.setName("Test collector");
        request.setRole(ParticipantRole.COLLECTOR);
        request.setAcceptedCategories(Set.of("MOBILE"));
        Participant participant = service.create(request);
        assertEquals(ParticipantStatus.PENDING, participant.getStatus());
        service.remove(participant.getId());
        assertEquals(ParticipantStatus.REJECTED,
                ((Collector) service.participant(participant.getId())).getStatus());
    }

    @Test
    void approvesApplicationAndCreatesParticipant() {
        LoopTraceStore store = new LoopTraceStore();
        store.applications.put("APP-TEST", ParticipantApplication.builder().id("APP-TEST")
                .role(ParticipantRole.RECYCLER).name("Recycler").status(ApplicationStatus.PENDING).build());
        AdminService service = new AdminService(store, mock(PickupService.class));
        assertEquals(ApplicationStatus.APPROVED, service.decide("APP-TEST", true).getStatus());
        assertTrue(store.participants.containsKey("APP-TEST"));
    }
}
