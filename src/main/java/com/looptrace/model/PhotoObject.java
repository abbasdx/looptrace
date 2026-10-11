package com.looptrace.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class PhotoObject {
    @Id
    @Column(name = "object_key")
    private String key;
    @Column(nullable = false)
    private String ownerUserId;
    @Column(nullable = false)
    private String contentType;
    private long size;
    private String checksum;
    private Instant createdAt;
}
