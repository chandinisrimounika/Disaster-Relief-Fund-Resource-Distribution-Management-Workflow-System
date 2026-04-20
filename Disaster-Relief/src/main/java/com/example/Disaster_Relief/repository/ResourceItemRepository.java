package com.example.Disaster_Relief.repository;

import com.example.Disaster_Relief.model.ResourceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ResourceItemRepository extends JpaRepository<ResourceItem, Long> {
    Optional<ResourceItem> findByResourceName(String resourceName);
}
