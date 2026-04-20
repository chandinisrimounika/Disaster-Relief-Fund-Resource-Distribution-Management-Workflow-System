package com.example.Disaster_Relief.repository;

import com.example.Disaster_Relief.enums.EventStatus;
import com.example.Disaster_Relief.model.DisasterEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DisasterEventRepository extends JpaRepository<DisasterEvent, Long> {
    List<DisasterEvent> findByEventStatus(EventStatus status);
}
