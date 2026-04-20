package com.example.Disaster_Relief.model;

import com.example.Disaster_Relief.enums.UnitType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResourceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String resourceName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UnitType unitType;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
