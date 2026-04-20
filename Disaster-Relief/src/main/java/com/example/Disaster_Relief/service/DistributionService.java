package com.example.Disaster_Relief.service;

import com.example.Disaster_Relief.dto.ResourceDistributionRequest;
import com.example.Disaster_Relief.enums.DistributionStatus;
import com.example.Disaster_Relief.model.*;
import com.example.Disaster_Relief.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class DistributionService {
    @Autowired
    private ResourceDistributionRepository distributionRepository;

    @Autowired
    private ResourceInventoryRepository inventoryRepository;

    @Autowired
    private ResourceItemRepository itemRepository;

    @Autowired
    private DisasterEventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ResourceDistribution distributeResource(ResourceDistributionRequest request) {
        DisasterEvent event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        ResourceItem item = itemRepository.findById(request.getResourceItemId())
                .orElseThrow(() -> new RuntimeException("Resource item not found"));

        ResourceInventory inventory = inventoryRepository.findByResourceItemId(request.getResourceItemId())
                .orElseThrow(() -> new RuntimeException("Inventory not found for this item"));

        if (inventory.getAvailableQuantity() < request.getDistributedQuantity()) {
            throw new RuntimeException("Insufficient inventory. Available: " + inventory.getAvailableQuantity());
        }

        User fieldOfficer = userRepository.findById(request.getDistributedById())
                .orElseThrow(() -> new RuntimeException("Field officer not found"));

        // Update inventory
        inventory.setAvailableQuantity(inventory.getAvailableQuantity() - request.getDistributedQuantity());
        inventoryRepository.save(inventory);

        ResourceDistribution distribution = new ResourceDistribution();
        distribution.setDisasterEvent(event);
        distribution.setResourceItem(item);
        distribution.setDistributedQuantity(request.getDistributedQuantity());
        distribution.setDistributedBy(fieldOfficer);
        distribution.setDistributionStatus(DistributionStatus.DISTRIBUTED);

        return distributionRepository.save(distribution);
    }

    public List<ResourceDistribution> getAllDistributions() {
        return distributionRepository.findAll();
    }

    public List<ResourceDistribution> getDistributionsByEvent(Long eventId) {
        return distributionRepository.findDistributionsWithEventDetails(eventId);
    }
}
