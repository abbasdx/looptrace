package com.looptrace.repository;

import com.looptrace.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Compatibility facade for the original store API. The maps remain available
 * to the services and tests, while every service mutation is flushed to JPA.
 */
@Component
public class LoopTraceStore {
    private static final Set<String> ALL_CATEGORIES =
            Set.of("MOBILE", "LAPTOP", "TABLET", "BATTERY", "CABLES");

    public final Map<String, PickupRequest> requests = new ConcurrentHashMap<>();
    public final Map<String, Collector> collectors = new ConcurrentHashMap<>();
    public final Map<String, Recycler> recyclers = new ConcurrentHashMap<>();
    public final Map<String, Participant> participants = new ConcurrentHashMap<>();
    public final Map<String, ParticipantApplication> applications = new ConcurrentHashMap<>();
    public final Map<String, List<CustodyEvent>> custodyEvents = new ConcurrentHashMap<>();

    private final PickupRequestRepository requestRepository;
    private final CollectorRepository collectorRepository;
    private final RecyclerRepository recyclerRepository;
    private final ParticipantRepository participantRepository;
    private final ParticipantApplicationRepository applicationRepository;
    private final CustodyEventRepository custodyRepository;

    /** Constructor retained for unit tests that exercise the in-memory facade. */
    public LoopTraceStore() {
        this(null, null, null, null, null, null);
    }

    @Autowired
    public LoopTraceStore(PickupRequestRepository requests,
                          CollectorRepository collectors,
                          RecyclerRepository recyclers,
                          ParticipantRepository participants,
                          ParticipantApplicationRepository applications,
                          CustodyEventRepository custodyEvents) {
        this.requestRepository = requests;
        this.collectorRepository = collectors;
        this.recyclerRepository = recyclers;
        this.participantRepository = participants;
        this.applicationRepository = applications;
        this.custodyRepository = custodyEvents;
        addListed("REC-002", "Muskan Technologies (Okhla Phase-1)", 28.53, 77.27);
        addListed("REC-003", "Shivnath Computers (Okhla Phase-2)", 28.53, 77.27);
        addListed("REC-004", "Techchef E-Waste Solutions (Okhla)", 28.53, 77.27);
        addListed("REC-005", "Greenscape Eco Management (Patparganj Industrial Area)", 28.62, 77.30);
        addListed("REC-006", "Fozia Traders (Saboli Mandoli Industrial Area)", 28.71, 77.31);
    }

    private void addListed(String id, String name, double lat, double lon) {
        add(Recycler.builder().id(id).name(name).latitude(lat).longitude(lon)
                .acceptedCategories(ALL_CATEGORIES).verified(false).demo(false)
                .status(ParticipantStatus.APPROVED).build());
    }

    @PostConstruct
    void load() {
        if (requestRepository == null) return;
        requestRepository.findAll().forEach(r -> requests.put(r.getId(), r));
        collectorRepository.findAll().forEach(c -> collectors.put(c.getId(), c));
        recyclerRepository.findAll().forEach(r -> recyclers.put(r.getId(), r));
        participantRepository.findAll().forEach(p -> participants.put(p.getId(), p));
        applicationRepository.findAll().forEach(a -> applications.put(a.getId(), a));
        custodyRepository.findAll().forEach(e ->
                custodyEvents.computeIfAbsent(e.getRequestId(), ignored -> new ArrayList<>()).add(e));
        // Persist the built-in approved reference facilities on first startup.
        recyclers.values().forEach(this::save);
    }

    public void add(Collector c) { collectors.put(c.getId(), c); save(c); }
    public void add(Recycler r) { recyclers.put(r.getId(), r); save(r); }
    public void save(PickupRequest value) {
        PickupRequest persisted = requestRepository == null ? value : requestRepository.save(value);
        if (persisted != value) value.setVersion(persisted.getVersion());
        requests.put(persisted.getId(), persisted);
    }
    public void save(Collector value) {
        Collector persisted = collectorRepository == null ? value : collectorRepository.save(value);
        if (persisted != value) value.setVersion(persisted.getVersion());
        collectors.put(persisted.getId(), persisted);
    }
    public void save(Recycler value) { recyclers.put(value.getId(), value); if (recyclerRepository != null) recyclerRepository.save(value); }
    public void save(Participant value) { participants.put(value.getId(), value); if (participantRepository != null) participantRepository.save(value); }
    public void save(ParticipantApplication value) { applications.put(value.getId(), value); if (applicationRepository != null) applicationRepository.save(value); }
    public void save(CustodyEvent value) {
        custodyEvents.computeIfAbsent(value.getRequestId(), ignored -> new ArrayList<>()).add(value);
        if (custodyRepository != null) custodyRepository.save(value);
    }
    public List<CustodyEvent> persistedEvents(String requestId) {
        return custodyRepository == null ? custodyEvents.getOrDefault(requestId, List.of())
                : custodyRepository.findByRequestIdOrderBySequenceAsc(requestId);
    }
}
