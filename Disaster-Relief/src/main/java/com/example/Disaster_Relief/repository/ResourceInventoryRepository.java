package com.example.Disaster_Relief.repository;

import com.example.Disaster_Relief.model.ResourceInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResourceInventoryRepository extends JpaRepository<ResourceInventory, Long> {
    Optional<ResourceInventory> findByResourceItemId(Long resourceItemId);
}
