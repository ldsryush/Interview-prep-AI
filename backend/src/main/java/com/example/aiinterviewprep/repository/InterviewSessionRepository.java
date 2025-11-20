package com.example.aiinterviewprep.repository;

import com.example.aiinterviewprep.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {

    // Find active sessions for a specific role
    List<InterviewSession> findByRoleAndActiveTrue(String role);

    // Find a session by ID
    Optional<InterviewSession> findById(Long id);

    // Find all active sessions
    List<InterviewSession> findByActiveTrue();
}