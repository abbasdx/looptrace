package com.looptrace.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_user", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class AppUser {
    @Id
    private String id;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String passwordHash;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantRole role;
    private String participantId;
    private boolean enabled;
}
