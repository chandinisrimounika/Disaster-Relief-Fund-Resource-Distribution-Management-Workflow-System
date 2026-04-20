package com.example.Disaster_Relief.service;

import com.example.Disaster_Relief.dto.DonationRequest;
import com.example.Disaster_Relief.enums.EventStatus;
import com.example.Disaster_Relief.enums.PaymentStatus;
import com.example.Disaster_Relief.model.DisasterEvent;
import com.example.Disaster_Relief.model.Donation;
import com.example.Disaster_Relief.model.User;
import com.example.Disaster_Relief.repository.DonationRepository;
import com.example.Disaster_Relief.repository.DisasterEventRepository;
import com.example.Disaster_Relief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;

@Service
public class DonationService {
    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private DisasterEventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    public Donation processDonation(DonationRequest request) {
        DisasterEvent event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getEventStatus() == EventStatus.COMPLETED || event.getEventStatus() == EventStatus.CLOSED) {
            throw new RuntimeException("Cannot donate to a completed or closed event");
        }

        User donor = userRepository.findById(request.getDonorId())
                .orElseThrow(() -> new RuntimeException("Donor not found"));

        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setDisasterEvent(event);
        donation.setDonationAmount(request.getDonationAmount());
        donation.setPaymentStatus(PaymentStatus.SUCCESS); // Simulating successful payment
        donation.setReferenceId(UUID.randomUUID().toString());

        return donationRepository.save(donation);
    }

    public List<Donation> getDonationHistory(Long donorId) {
        return donationRepository.findByDonorId(donorId);
    }

    public Double getTotalDonationsForEvent(Long eventId) {
        Double total = donationRepository.sumDonationsByEventId(eventId);
        return total != null ? total : 0.0;
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }
}
