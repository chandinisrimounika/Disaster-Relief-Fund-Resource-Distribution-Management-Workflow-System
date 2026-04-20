package com.example.Disaster_Relief.model;

import com.example.Disaster_Relief.enums.AllocationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "fund_allocations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReliefFundAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private DisasterEvent disasterEvent;

    @Column(nullable = false)
    private Double allocatedAmount;

    @ManyToOne
    @JoinColumn(name = "allocated_by_id", nullable = false)
    private User allocatedBy;

    private LocalDateTime allocationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AllocationStatus allocationStatus;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (allocationDate == null) {
            allocationDate = LocalDateTime.now();
        }
    }
}
