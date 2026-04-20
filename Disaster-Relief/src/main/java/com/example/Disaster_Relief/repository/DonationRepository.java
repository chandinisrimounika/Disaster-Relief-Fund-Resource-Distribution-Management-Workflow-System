package com.example.Disaster_Relief.repository;

import com.example.Disaster_Relief.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByDonorId(Long donorId);
    
    @Query("SELECT SUM(d.donationAmount) FROM Donation d WHERE d.disasterEvent.id = :eventId AND d.paymentStatus = 'SUCCESS'")
    Double sumDonationsByEventId(@Param("eventId") Long eventId);
}
