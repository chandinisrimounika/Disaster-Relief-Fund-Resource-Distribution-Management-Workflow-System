package com.example.Disaster_Relief.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FundAllocationRequest {
    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Amount is required")
    @Min(value = 1, message = "Amount must be at least 1")
    private Double allocatedAmount;

    @NotNull(message = "Admin ID is required")
    private Long allocatedById;
}
