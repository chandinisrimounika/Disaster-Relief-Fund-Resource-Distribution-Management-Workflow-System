package com.example.Disaster_Relief.controller;

import com.example.Disaster_Relief.dto.DisasterEventRequest;
import com.example.Disaster_Relief.enums.EventStatus;
import com.example.Disaster_Relief.model.DisasterEvent;
import com.example.Disaster_Relief.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController {
    @Autowired
    private EventService eventService;

    @PostMapping
    public DisasterEvent createEvent(@Valid @RequestBody DisasterEventRequest request) {
        return eventService.createEvent(request);
    }

    @PutMapping("/{id}/status")
    public DisasterEvent updateStatus(@PathVariable Long id, @RequestParam EventStatus status) {
        return eventService.updateStatus(id, status);
    }

    @GetMapping
    public List<DisasterEvent> getAllEvents(@RequestParam(defaultValue = "false") boolean activeOnly) {
        if (activeOnly) {
            return eventService.getActiveEvents();
        }
        return eventService.getAllEvents();
    }

    @GetMapping("/{id}")
    public DisasterEvent getEventById(@PathVariable Long id) {
        return eventService.getEventById(id);
    }
}
