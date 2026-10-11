
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
public class Recycler {

    @Id
    private String id;
    private String name;

    // Use only a verified reference; do not invent registration details
    private String registrationReference;

    private double latitude;
    private double longitude;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recycler_categories", joinColumns = @JoinColumn(name = "recycler_id"))
    private Set<String> acceptedCategories;

    // True only after verification
    private boolean verified;
    @Enumerated(EnumType.STRING)
    private ParticipantStatus status;

    // True when the facility is illustrative demo data
    private boolean demo;
}
