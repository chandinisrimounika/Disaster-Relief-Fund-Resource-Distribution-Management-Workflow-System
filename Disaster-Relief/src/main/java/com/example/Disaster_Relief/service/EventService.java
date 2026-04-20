package com.example.Disaster_Relief.service;

import com.example.Disaster_Relief.dto.DisasterEventRequest;
import com.example.Disaster_Relief.enums.EventStatus;
import com.example.Disaster_Relief.model.DisasterEvent;
import com.example.Disaster_Relief.repository.DisasterEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EventService {
    @Autowired
    private DisasterEventRepository eventRepository;

    public DisasterEvent createEvent(DisasterEventRequest request) {
        DisasterEvent event = new DisasterEvent();
        event.setEventName(request.getEventName());
        event.setEventType(request.getEventType());
        event.setAffectedLocation(request.getAffectedLocation());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setEventStatus(EventStatus.CREATED);
        return eventRepository.save(event);
    }

    public DisasterEvent updateStatus(Long id, EventStatus status) {
        DisasterEvent event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
        event.setEventStatus(status);
        return eventRepository.save(event);
    }

    public List<DisasterEvent> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<DisasterEvent> getActiveEvents() {
        return eventRepository.findByEventStatus(EventStatus.ACTIVE);
    }

    public DisasterEvent getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }
}
