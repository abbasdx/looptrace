package com.looptrace.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import jakarta.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CustodyEvent {

    @Id
    private String id;
    private String requestId;
    private int sequence;

    // Examples: REQUEST_CREATED, PICKED_UP, HANDED_OFF
    private String step;

    // Who performed the action
    private String actor;

    private Double weightKg;
    private String photoKey;
    private Instant timestamp;

    // Hash of the preceding event and hash of this event
    private String previousHash;
    private String hash;
}
