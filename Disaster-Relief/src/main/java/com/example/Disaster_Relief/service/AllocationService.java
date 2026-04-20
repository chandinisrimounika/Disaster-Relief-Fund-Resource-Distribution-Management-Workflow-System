package com.example.Disaster_Relief.service;

import com.example.Disaster_Relief.dto.FundAllocationRequest;
import com.example.Disaster_Relief.enums.AllocationStatus;
import com.example.Disaster_Relief.model.DisasterEvent;
import com.example.Disaster_Relief.model.ReliefFundAllocation;
import com.example.Disaster_Relief.model.User;
import com.example.Disaster_Relief.repository.DonationRepository;
import com.example.Disaster_Relief.repository.ReliefFundAllocationRepository;
import com.example.Disaster_Relief.repository.DisasterEventRepository;
import com.example.Disaster_Relief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AllocationService {
    @Autowired
    private ReliefFundAllocationRepository allocationRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private DisasterEventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public ReliefFundAllocation allocateFunds(FundAllocationRequest request) {
        DisasterEvent event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Double totalDonations = donationRepository.sumDonationsByEventId(request.getEventId());
        if (totalDonations == null) totalDonations = 0.0;

        Double totalAllocated = allocationRepository.sumAllocationsByEventId(request.getEventId());
        if (totalAllocated == null) totalAllocated = 0.0;

        if (totalAllocated + request.getAllocatedAmount() > totalDonations) {
            throw new RuntimeException("Allocation amount exceeds collected donations. Available: " + (totalDonations - totalAllocated));
        }

        User admin = userRepository.findById(request.getAllocatedById())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        ReliefFundAllocation allocation = new ReliefFundAllocation();
        allocation.setDisasterEvent(event);
        allocation.setAllocatedAmount(request.getAllocatedAmount());
        allocation.setAllocatedBy(admin);
        allocation.setAllocationStatus(AllocationStatus.ALLOCATED);

        return allocationRepository.save(allocation);
    }

    public Double getRemainingFunds(Long eventId) {
        Double totalDonations = donationRepository.sumDonationsByEventId(eventId);
        if (totalDonations == null) totalDonations = 0.0;

        Double totalAllocated = allocationRepository.sumAllocationsByEventId(eventId);
        if (totalAllocated == null) totalAllocated = 0.0;

        return totalDonations - totalAllocated;
    }

    public List<ReliefFundAllocation> getAllAllocations() {
        return allocationRepository.findAll();
    }

    public List<ReliefFundAllocation> getAllocationsByEvent(Long eventId) {
        return allocationRepository.findByDisasterEventId(eventId);
    }
}
