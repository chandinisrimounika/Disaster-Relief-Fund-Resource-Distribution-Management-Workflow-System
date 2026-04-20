package com.example.Disaster_Relief.controller;

import com.example.Disaster_Relief.model.ResourceItem;
import com.example.Disaster_Relief.service.InventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {
    @Autowired
    private InventoryService inventoryService;

    @PostMapping
    public ResourceItem addResourceItem(@Valid @RequestBody ResourceItem item) {
        return inventoryService.addResourceItem(item);
    }

    @GetMapping
    public List<ResourceItem> getAllResourceItems() {
        return inventoryService.getAllResourceItems();
    }
}
