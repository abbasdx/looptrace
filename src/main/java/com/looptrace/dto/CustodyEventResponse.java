
package com.looptrace.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class CustodyEventResponse {

    private String id;
    private String requestId;
    private String step;
    private String actor;
    private Double weightKg;
    private String photoKey;
    private Instant timestamp;
    private String previousHash;
    private String hash;
}
