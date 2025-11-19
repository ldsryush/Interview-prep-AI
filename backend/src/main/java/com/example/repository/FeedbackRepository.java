package com.example.aiinterviewprep.repository;

import com.example.aiinterviewprep.entity.Answer;
import com.example.aiinterviewprep.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    
    // Find feedback for a specific answer (one-to-one relationship)
    Optional<Feedback> findByAnswer(Answer answer);
}