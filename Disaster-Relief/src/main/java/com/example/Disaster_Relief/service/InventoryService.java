package com.example.Disaster_Relief.service;

import com.example.Disaster_Relief.model.ResourceInventory;
import com.example.Disaster_Relief.model.ResourceItem;
import com.example.Disaster_Relief.model.User;
import com.example.Disaster_Relief.repository.ResourceInventoryRepository;
import com.example.Disaster_Relief.repository.ResourceItemRepository;
import com.example.Disaster_Relief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InventoryService {
    @Autowired
    private ResourceInventoryRepository inventoryRepository;

    @Autowired
    private ResourceItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    public ResourceItem addResourceItem(ResourceItem item) {
        return itemRepository.save(item);
    }

    public ResourceInventory updateInventory(Long itemId, Integer quantity, Long coordinatorId) {
        ResourceItem item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Resource item not found"));

        User coordinator = userRepository.findById(coordinatorId)
                .orElseThrow(() -> new RuntimeException("Coordinator not found"));

        ResourceInventory inventory = inventoryRepository.findByResourceItemId(itemId)
                .orElse(new ResourceInventory());

        inventory.setResourceItem(item);
        inventory.setAvailableQuantity(quantity);
        inventory.setManagedBy(coordinator);

        return inventoryRepository.save(inventory);
    }

    public List<ResourceInventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public List<ResourceItem> getAllResourceItems() {
        return itemRepository.findAll();
    }
}
