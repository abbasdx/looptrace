package com.looptrace.service;

import com.looptrace.model.CustodyEvent;
import com.looptrace.repository.LoopTraceStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

/** Tamper-evident custody log: each event's hash includes the previous hash. */
@Service
@RequiredArgsConstructor
public class CustodyService {

    private static final String GENESIS = "GENESIS";

    private final LoopTraceStore store;

    @Transactional
    public synchronized CustodyEvent recordEvent(String requestId, String step, String actor,
                                    Double weightKg, String photoKey) {

        List<CustodyEvent> events = store.custodyEvents
                .computeIfAbsent(requestId, id -> new ArrayList<>());

        synchronized (events) {
            String previousHash = events.isEmpty()
                    ? GENESIS
                    : events.get(events.size() - 1).getHash();

            String id = UUID.randomUUID().toString();
            Instant timestamp = Instant.now().truncatedTo(java.time.temporal.ChronoUnit.MILLIS);

            CustodyEvent event = CustodyEvent.builder()
                    .id(id)
                    .requestId(requestId)
                    .sequence(events.size())
                    .step(step)
                    .actor(actor)
                    .weightKg(weightKg)
                    .photoKey(photoKey)
                    .timestamp(timestamp)
                    .previousHash(previousHash)
                    .build();

            event.setHash(sha256(payload(event)));
            store.save(event);
            return event;
        }
    }

    public List<CustodyEvent> getEvents(String requestId) {
        List<CustodyEvent> events = store.persistedEvents(requestId);
        if (events == null) {
            return List.of();
        }
        synchronized (events) {
            return List.copyOf(events);
        }
    }

    /** Re-computes every hash and link; false if any stored event was altered. */
    public boolean verifyChain(String requestId) {
        String expectedPrevious = GENESIS;
        List<CustodyEvent> events = getEvents(requestId);
        if (events.isEmpty() || !"REQUEST_CREATED".equals(events.get(0).getStep())) {
            return false;
        }

        for (CustodyEvent event : events) {
            if (!expectedPrevious.equals(event.getPreviousHash())) {
                return false;
            }
            if (!sha256(payload(event)).equals(event.getHash())) {
                return false;
            }
            expectedPrevious = event.getHash();
        }
        return true;
    }

    private String payload(CustodyEvent e) {
        return String.join("|",
                e.getId(),
                e.getRequestId(),
                e.getStep(),
                e.getActor(),
                e.getWeightKg() == null ? "" : e.getWeightKg().toString(),
                e.getPhotoKey() == null ? "" : e.getPhotoKey(),
                e.getTimestamp().toString(),
                e.getPreviousHash());
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(
                    digest.digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}