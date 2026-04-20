package com.example.Disaster_Relief.controller;

import com.example.Disaster_Relief.dto.FundAllocationRequest;
import com.example.Disaster_Relief.model.ReliefFundAllocation;
import com.example.Disaster_Relief.service.AllocationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/allocations")
@CrossOrigin(origins = "*")
public class FundAllocationController {
    @Autowired
    private AllocationService allocationService;

    @PostMapping
    public ReliefFundAllocation allocateFunds(@Valid @RequestBody FundAllocationRequest request) {
        return allocationService.allocateFunds(request);
    }

    @GetMapping
    public List<ReliefFundAllocation> getAllAllocations() {
        return allocationService.getAllAllocations();
    }

    @GetMapping("/event/{eventId}")
    public List<ReliefFundAllocation> getAllocationsByEvent(@PathVariable Long eventId) {
        return allocationService.getAllocationsByEvent(eventId);
    }

    @GetMapping("/event/{eventId}/remaining")
    public Double getRemainingFunds(@PathVariable Long eventId) {
        return allocationService.getRemainingFunds(eventId);
    }
}
