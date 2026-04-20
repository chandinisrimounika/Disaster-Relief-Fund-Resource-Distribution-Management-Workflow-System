package com.example.Disaster_Relief.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceDistributionRequest {
    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "Resource Item ID is required")
    private Long resourceItemId;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer distributedQuantity;

    @NotNull(message = "Field Officer ID is required")
    private Long distributedById;
}
