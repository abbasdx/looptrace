package com.looptrace.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import jakarta.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Collector {

    @Id
    private String id;
    @Version
    private Long version;
    private String name;
    private double latitude;
    private double longitude;

    // Categories this collector accepts, e.g. MOBILE, LAPTOP
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "collector_categories", joinColumns = @JoinColumn(name = "collector_id"))
    private Set<String> acceptedCategories;
    @Enumerated(EnumType.STRING)
    private ParticipantStatus status;

    // True when this is illustrative demo data
    private boolean demo;
}
