package com.example.Disaster_Relief.dto;

import com.example.Disaster_Relief.enums.EventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DisasterEventRequest {
    @NotBlank(message = "Event name is required")
    private String eventName;

    @NotNull(message = "Event type is required")
    private EventType eventType;

    @NotBlank(message = "Location is required")
    private String affectedLocation;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    private LocalDate endDate;
}
