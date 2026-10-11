package com.looptrace.repository;
import com.looptrace.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ParticipantRepository extends JpaRepository<Participant, String> {}
