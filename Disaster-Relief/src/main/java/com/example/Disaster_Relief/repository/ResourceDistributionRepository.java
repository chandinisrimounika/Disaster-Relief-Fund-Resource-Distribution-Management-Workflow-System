package com.example.Disaster_Relief.repository;

import com.example.Disaster_Relief.model.ResourceDistribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ResourceDistributionRepository extends JpaRepository<ResourceDistribution, Long> {
    List<ResourceDistribution> findByDisasterEventId(Long eventId);

    @Query("SELECT SUM(rd.distributedQuantity) FROM ResourceDistribution rd WHERE rd.disasterEvent.id = :eventId AND rd.resourceItem.id = :resourceItemId")
    Integer sumDistributedQuantityByEventAndResource(@Param("eventId") Long eventId, @Param("resourceItemId") Long resourceItemId);

    // JOIN query example as requested
    @Query("SELECT rd FROM ResourceDistribution rd JOIN rd.disasterEvent de WHERE de.id = :eventId")
    List<ResourceDistribution> findDistributionsWithEventDetails(@Param("eventId") Long eventId);
}
