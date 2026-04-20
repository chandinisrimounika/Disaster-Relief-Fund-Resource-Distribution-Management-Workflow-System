package com.example.Disaster_Relief.controller;

import com.example.Disaster_Relief.dto.DonationRequest;
import com.example.Disaster_Relief.model.Donation;
import com.example.Disaster_Relief.service.DonationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "*")
public class DonationController {
    @Autowired
    private DonationService donationService;

    @PostMapping
    public Donation processDonation(@Valid @RequestBody DonationRequest request) {
        return donationService.processDonation(request);
    }

    @GetMapping
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }

    @GetMapping("/donor/{donorId}")
    public List<Donation> getDonationHistory(@PathVariable Long donorId) {
        return donationService.getDonationHistory(donorId);
    }

    @GetMapping("/event/{eventId}/total")
    public Double getTotalDonations(@PathVariable Long eventId) {
        return donationService.getTotalDonationsForEvent(eventId);
    }
}
