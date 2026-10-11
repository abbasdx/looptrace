package com.looptrace.service;

import com.looptrace.dto.ParticipantRequest;
import com.looptrace.model.*;
import com.looptrace.repository.LoopTraceStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final LoopTraceStore store;
    private final PickupService pickupService;

    public Map<String, Object> dashboard() {
        long active = store.collectors.values().stream().filter(this::active).count()
                + store.recyclers.values().stream().filter(this::active).count();
        long assignedPickups = store.requests.values().stream()
                .filter(r -> r.getCollectorId() != null)
                .count();
        long completedPickups = store.requests.values().stream()
                .filter(r -> r.getStatus() == PickupStatus.HANDED_OFF)
                .count();
        return Map.of("participants", store.participants.size() + store.collectors.size() + store.recyclers.size(),
                "activeParticipants", active, "pendingApplications", store.applications.values().stream()
                        .filter(a -> a.getStatus() == ApplicationStatus.PENDING).count(),
                "openPickups", store.requests.values().stream().filter(r -> r.getStatus() != PickupStatus.HANDED_OFF).count(),
                "assignedPickups", assignedPickups,
                "completedPickups", completedPickups);
    }
    public List<Object> participants() {
        List<Object> all = new ArrayList<>(store.participants.values());
        all.addAll(store.collectors.values()); all.addAll(store.recyclers.values()); return all;
    }
    public Object participant(String id) {
        Participant p = store.participants.get(id); if (p != null) return p;
        Collector c = store.collectors.get(id); if (c != null) return c;
        Recycler r = store.recyclers.get(id); if (r != null) return r;
        throw new IllegalArgumentException("Participant not found: " + id);
    }
    @Transactional
    public Participant create(ParticipantRequest dto) {
        String id = (dto.getRole() == ParticipantRole.RECYCLER ? "REC-" : "COL-") + UUID.randomUUID();
        if (dto.getRole() == ParticipantRole.RECYCLER) {
            Recycler recycler = Recycler.builder().id(id).name(dto.getName())
                    .registrationReference(dto.getRegistrationReference())
                    .latitude(dto.getLatitude()).longitude(dto.getLongitude())
                    .acceptedCategories(dto.getAcceptedCategories())
                    .status(ParticipantStatus.PENDING).verified(false).build();
            store.save(recycler);
        } else {
            Collector collector = Collector.builder().id(id).name(dto.getName())
                    .latitude(dto.getLatitude()).longitude(dto.getLongitude())
                    .acceptedCategories(dto.getAcceptedCategories())
                    .status(ParticipantStatus.PENDING).build();
            store.save(collector);
        }
        return Participant.builder().id(id).role(dto.getRole()).name(dto.getName())
                .email(dto.getEmail()).phone(dto.getPhone())
                .registrationReference(dto.getRegistrationReference())
                .latitude(dto.getLatitude()).longitude(dto.getLongitude())
                .acceptedCategories(dto.getAcceptedCategories())
                .status(ParticipantStatus.PENDING).verified(false).createdAt(Instant.now()).build();
    }
    @Transactional
    public Object status(String id, ParticipantStatus status) {
        Participant p = store.participants.get(id); if (p != null) { p.setStatus(status); store.save(p); return p; }
        Collector c = store.collectors.get(id); if (c != null) { c.setStatus(status); store.save(c); return c; }
        Recycler r = store.recyclers.get(id); if (r != null) { r.setStatus(status); store.save(r); return r; }
        throw new IllegalArgumentException("Participant not found: " + id);
    }
    public void remove(String id) { status(id, ParticipantStatus.REJECTED); }
    public List<ParticipantApplication> applications() { return List.copyOf(store.applications.values()); }
    @Transactional
    public ParticipantApplication decide(String id, boolean approve) {
        ParticipantApplication a = Optional.ofNullable(store.applications.get(id))
                .orElseThrow(() -> new IllegalArgumentException("Application not found: " + id));
        a.setStatus(approve ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED);
        store.save(a);
        if (approve) createFromApplication(a);
        return a;
    }
    private void createFromApplication(ParticipantApplication a) {
        if (store.participants.values().stream().anyMatch(p -> p.getEmail() != null && p.getEmail().equals(a.getEmail()))) return;
        store.save(Participant.builder().id(a.getId()).role(a.getRole()).name(a.getName())
                .email(a.getEmail()).phone(a.getPhone()).latitude(a.getLatitude()).longitude(a.getLongitude())
                .acceptedCategories(a.getAcceptedCategories()).status(ParticipantStatus.APPROVED).verified(true)
                .demo(a.isDemo()).createdAt(Instant.now()).build());
    }
    public List<Collector> eligibleCollectors() {
        return store.collectors.values().stream()
                .filter(c -> c.getStatus() == ParticipantStatus.APPROVED)
                .filter(this::isAvailable)
                .toList();
    }
    public List<Recycler> eligibleRecyclers() {
        return store.recyclers.values().stream()
                .filter(r -> r.getStatus() == ParticipantStatus.APPROVED)
                .toList();
    }
    public PickupRequest assign(String pickupId, String collectorId) { return pickupService.assignCollector(pickupId, collectorId); }
    private boolean active(Collector c) { return c.getStatus() == ParticipantStatus.APPROVED; }
    private boolean active(Recycler r) { return r.getStatus() == ParticipantStatus.APPROVED; }
    private boolean isAvailable(Collector collector) {
        return store.requests.values().stream()
                .noneMatch(request -> collector.getId().equals(request.getCollectorId())
                        && request.getStatus() != null
                        && request.getStatus() != PickupStatus.HANDED_OFF);
    }

}
