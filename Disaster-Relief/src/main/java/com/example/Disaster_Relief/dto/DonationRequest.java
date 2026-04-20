package com.example.Disaster_Relief.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DonationRequest {
    @NotNull(message = "Donor ID is required")
    private Long donorId;

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be at least 1")
    private Double donationAmount;
}
