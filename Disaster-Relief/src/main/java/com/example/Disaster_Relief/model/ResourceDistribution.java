package com.example.Disaster_Relief.model;

import com.example.Disaster_Relief.enums.DistributionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_distributions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceDistribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private DisasterEvent disasterEvent;

    @ManyToOne
    @JoinColumn(name = "resource_item_id", nullable = false)
    private ResourceItem resourceItem;

    @Column(nullable = false)
    private Integer distributedQuantity;

    @ManyToOne
    @JoinColumn(name = "distributed_by_id", nullable = false)
    private User distributedBy;

    private LocalDateTime distributionDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DistributionStatus distributionStatus;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (distributionDate == null) {
            distributionDate = LocalDateTime.now();
        }
    }
}
