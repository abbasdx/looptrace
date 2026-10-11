package com.looptrace.controller;

import com.looptrace.dto.*;
import com.looptrace.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import org.springframework.security.core.Authentication;
import com.looptrace.security.AuthenticatedUser;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class PickupController {

    private final PickupService pickupService;
    private final CustodyService custodyService;
    private final PickupMapper mapper;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PickupResponse create(@Valid @RequestBody CreatePickupRequest dto, Authentication authentication) {
        assertRole(authentication, "HOUSEHOLD");
        if (authentication != null) {
            dto.setHouseholdName(((AuthenticatedUser) authentication.getPrincipal()).getEmail());
        }
        var request = mapper.toModel(dto);
        if (authentication != null) {
            request.setOwnerUserId(((AuthenticatedUser) authentication.getPrincipal()).getId());
        }
        return mapper.toResponse(pickupService.create(request));
    }

    @GetMapping
    public List<PickupResponse> list(@RequestParam(required = false) String collectorId,
                                     Authentication authentication) {
        AuthenticatedUser user = authentication == null ? null : (AuthenticatedUser) authentication.getPrincipal();
        if (user != null && "COLLECTOR".equals(user.getRole())) {
            if (collectorId != null && !collectorId.equals(user.getParticipantId())) {
                throw new org.springframework.security.access.AccessDeniedException("Collector access denied");
            }
            collectorId = user.getParticipantId();
        }
        String requestedCollectorId = collectorId;
        return pickupService.getAll().stream()
                .filter(r -> requestedCollectorId == null || requestedCollectorId.equals(r.getCollectorId()))
                .filter(r -> canView(r, user))
                .map(mapper::toResponse)
                .toList();
    }

    @PostMapping("/{id}/rematch")
    public PickupResponse rematch(@PathVariable String id, Authentication authentication) {
        assertOwnerOrOperational(pickupService.getById(id), authentication);
        return mapper.toResponse(pickupService.rematch(id));
    }

    @GetMapping("/{id}")
    public PickupResponse get(@PathVariable String id, Authentication authentication) {
        var request = pickupService.getById(id);
        assertOwnerOrOperational(request, authentication);
        return mapper.toResponse(request);
    }

    @PostMapping("/{id}/accept")
    public PickupResponse accept(@PathVariable String id,
                                 @Valid @RequestBody AcceptPickupRequest dto,
                                 Authentication authentication) {
        assertCollector(authentication, dto.getCollectorId());
        return mapper.toResponse(pickupService.accept(id, dto.getCollectorId()));
    }

    @PostMapping("/{id}/pickup")
    public PickupResponse pickup(@PathVariable String id,
                                 @Valid @RequestBody PickupCompletionRequest dto,
                                 Authentication authentication) {
        assertCollector(authentication, dto.getCollectorId());
        return mapper.toResponse(pickupService.markPickedUp(
                id, dto.getCollectorId(), dto.getActualWeightKg()));
    }

    @PostMapping("/{id}/handoff")
    public PickupResponse handoff(@PathVariable String id,
                                  @Valid @RequestBody HandoffRequest dto,
                                  Authentication authentication) {
        assertCollector(authentication, dto.getCollectorId());
        return mapper.toResponse(pickupService.handoff(
                id, dto.getCollectorId(), dto.getRecyclerId(),
                dto.getActualWeightKg()));
    }

    @PostMapping("/{id}/recycler/receive")
    public PickupResponse recyclerReceive(@PathVariable String id,
                                          @Valid @RequestBody RecyclerReceiptRequest dto,
                                          Authentication authentication) {
        assertRecycler(authentication, dto.getRecyclerId());
        return mapper.toResponse(pickupService.confirmRecyclerReceipt(id, dto.getRecyclerId()));
    }

    @PatchMapping("/{id}/recycler/status")
    public PickupResponse recyclerStatus(@PathVariable String id,
                                         @Valid @RequestBody RecyclerStatusRequest dto,
                                         Authentication authentication) {
        assertRecycler(authentication, dto.getRecyclerId());
        return mapper.toResponse(pickupService.updateRecyclingStatus(
                id, dto.getRecyclerId(), dto.getStatus()));
    }

    @GetMapping("/{id}/custody")
    public List<CustodyEventResponse> custody(@PathVariable String id, Authentication authentication) {
        var request = pickupService.getById(id);
        assertOwnerOrOperational(request, authentication);
        return custodyService.getEvents(id).stream()
                .map(mapper::toCustodyResponse).toList();
    }

    @GetMapping("/{id}/custody/verify")
    public Map<String, Boolean> verify(@PathVariable String id, Authentication authentication) {
        assertOwnerOrOperational(pickupService.getById(id), authentication);
        return Map.of("valid", custodyService.verifyChain(id));
    }

    private void assertOwnerOrOperational(com.looptrace.model.PickupRequest request,
                                          Authentication authentication) {
        if (authentication == null) return;
        AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
        if ("HOUSEHOLD".equals(user.getRole()) && !user.getId().equals(request.getOwnerUserId())) {
            throw new org.springframework.security.access.AccessDeniedException("Pickup access denied");
        }
        if ("COLLECTOR".equals(user.getRole()) && (user.getParticipantId() == null
                || !user.getParticipantId().equals(request.getCollectorId()))) {
            throw new org.springframework.security.access.AccessDeniedException("Pickup access denied");
        }
        if ("RECYCLER".equals(user.getRole()) && (user.getParticipantId() == null
                || !user.getParticipantId().equals(request.getRecyclerId()))) {
            throw new org.springframework.security.access.AccessDeniedException("Pickup access denied");
        }
    }

    private boolean canView(com.looptrace.model.PickupRequest request, AuthenticatedUser user) {
        if (user == null || "SUPER_ADMIN".equals(user.getRole())) return true;
        if ("HOUSEHOLD".equals(user.getRole())) return user.getId().equals(request.getOwnerUserId());
        if ("COLLECTOR".equals(user.getRole())) return user.getParticipantId() != null
                && user.getParticipantId().equals(request.getCollectorId());
        return "RECYCLER".equals(user.getRole()) && user.getParticipantId() != null
                && user.getParticipantId().equals(request.getRecyclerId());
    }

    private void assertCollector(Authentication authentication, String collectorId) {
            if (authentication == null) return;
            AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
            if (!"COLLECTOR".equals(user.getRole()) || user.getParticipantId() == null
                    || !user.getParticipantId().equals(collectorId)) {
                throw new org.springframework.security.access.AccessDeniedException("Collector access denied");
            }
        }

        private void assertRecycler(Authentication authentication, String recyclerId) {
            if (authentication == null) return;
            AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
            if (!"RECYCLER".equals(user.getRole()) || user.getParticipantId() == null
                    || !user.getParticipantId().equals(recyclerId)) {
                throw new org.springframework.security.access.AccessDeniedException("Recycler access denied");
            }
        }

    private void assertRole(Authentication authentication, String role) {
            if (authentication == null) return;
            AuthenticatedUser user = (AuthenticatedUser) authentication.getPrincipal();
            if (!role.equals(user.getRole())) {
                throw new org.springframework.security.access.AccessDeniedException("Role is not permitted");
        }
    }
}