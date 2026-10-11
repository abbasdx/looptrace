package com.looptrace.repository;
import com.looptrace.model.PickupRequest;
import org.springframework.data.jpa.repository.JpaRepository;
public interface PickupRequestRepository extends JpaRepository<PickupRequest, String> {}
