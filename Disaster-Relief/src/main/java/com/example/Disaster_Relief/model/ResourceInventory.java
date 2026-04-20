package com.example.Disaster_Relief.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_inventory")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "resource_item_id", nullable = false)
    private ResourceItem resourceItem;

    @Column(nullable = false)
    private Integer availableQuantity;

    private LocalDateTime lastUpdated;

    @ManyToOne
    @JoinColumn(name = "managed_by_id", nullable = false)
    private User managedBy;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        lastUpdated = LocalDateTime.now();
    }
}
