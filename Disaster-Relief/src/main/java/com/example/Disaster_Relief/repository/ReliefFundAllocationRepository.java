package com.example.Disaster_Relief.repository;

import com.example.Disaster_Relief.model.ReliefFundAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReliefFundAllocationRepository extends JpaRepository<ReliefFundAllocation, Long> {
    List<ReliefFundAllocation> findByDisasterEventId(Long eventId);

    @Query("SELECT SUM(a.allocatedAmount) FROM ReliefFundAllocation a WHERE a.disasterEvent.id = :eventId")
    Double sumAllocationsByEventId(@Param("eventId") Long eventId);
}
