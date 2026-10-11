package com.looptrace.repository;
import com.looptrace.model.CustodyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CustodyEventRepository extends JpaRepository<CustodyEvent, String> {
    List<CustodyEvent> findByRequestIdOrderBySequenceAsc(String requestId);
}
