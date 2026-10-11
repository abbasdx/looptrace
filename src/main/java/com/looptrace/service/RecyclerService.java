package com.looptrace.service;

import com.looptrace.model.Recycler;
import com.looptrace.model.ParticipantStatus;
import com.looptrace.repository.LoopTraceStore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class RecyclerService {

    private final LoopTraceStore store;

    public List<Recycler> getAllRecyclers() {
        return store.recyclers.values().stream()
                .filter(r -> r.getStatus() == ParticipantStatus.APPROVED)
                .toList();
    }

    public Recycler getById(String id) {
        Recycler recycler = id == null ? null : store.recyclers.get(id);
        if (recycler == null) {
            throw new IllegalArgumentException("Recycler not found: " + id);
        }
        if (recycler.getStatus() != ParticipantStatus.APPROVED
                || (!recycler.isDemo() && !recycler.isVerified())) {
            throw new IllegalStateException("Recycler is not approved");
        }
        return recycler;
    }

    public void validateAcceptance(String recyclerId, String category) {
        Recycler recycler = getById(recyclerId);

        boolean accepted = recycler.getAcceptedCategories() != null
                && recycler.getAcceptedCategories().stream()
                .anyMatch(c -> normalize(c).equals(normalize(category)));

        if (!accepted) {
            throw new IllegalStateException(
                    "Recycler does not accept category: " + category);
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toUpperCase(Locale.ROOT);
    }
}