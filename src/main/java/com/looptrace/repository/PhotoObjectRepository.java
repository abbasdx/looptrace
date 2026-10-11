package com.looptrace.repository;

import com.looptrace.model.PhotoObject;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PhotoObjectRepository extends JpaRepository<PhotoObject, String> {}
