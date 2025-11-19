package com.example.aiinterviewprep.repository;

import com.example.aiinterviewprep.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    
    // Find all questions for a specific role
    List<Question> findByRole(String role);
    
    // Find questions by difficulty level
    List<Question> findByDifficulty(String difficulty);
}