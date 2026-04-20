package com.example.Disaster_Relief.controller;

import com.example.Disaster_Relief.dto.ResourceDistributionRequest;
import com.example.Disaster_Relief.model.ResourceDistribution;
import com.example.Disaster_Relief.service.DistributionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/distributions")
@CrossOrigin(origins = "*")
public class DistributionController {
    @Autowired
    private DistributionService distributionService;

    @PostMapping
    public ResourceDistribution distributeResource(@Valid @RequestBody ResourceDistributionRequest request) {
        return distributionService.distributeResource(request);
    }

    @GetMapping
    public List<ResourceDistribution> getAllDistributions() {
        return distributionService.getAllDistributions();
    }

    @GetMapping("/event/{eventId}")
    public List<ResourceDistribution> getDistributionsByEvent(@PathVariable Long eventId) {
        return distributionService.getDistributionsByEvent(eventId);
    }
}
