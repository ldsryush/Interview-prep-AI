package com.example.aiinterviewprep.repository;

import com.example.aiinterviewprep.entity.Answer;
import com.example.aiinterviewprep.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {
    
    // Find all answers for a specific question
    List<Answer> findByQuestion(Question question);
}