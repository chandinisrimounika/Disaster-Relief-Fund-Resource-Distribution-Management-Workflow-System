package com.example.Disaster_Relief.controller;

import com.example.Disaster_Relief.model.ResourceInventory;
import com.example.Disaster_Relief.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "*")
public class InventoryController {
    @Autowired
    private InventoryService inventoryService;

    @PutMapping("/{itemId}")
    public ResourceInventory updateInventory(
            @PathVariable Long itemId,
            @RequestParam Integer quantity,
            @RequestParam Long coordinatorId) {
        return inventoryService.updateInventory(itemId, quantity, coordinatorId);
    }

    @GetMapping
    public List<ResourceInventory> getAllInventory() {
        return inventoryService.getAllInventory();
    }
}
