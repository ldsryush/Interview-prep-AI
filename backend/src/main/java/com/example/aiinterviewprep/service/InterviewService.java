package com.example.aiinterviewprep.service;

import com.example.aiinterviewprep.entity.Answer;
import com.example.aiinterviewprep.entity.DifficultyLevel;
import com.example.aiinterviewprep.entity.Feedback;
import com.example.aiinterviewprep.entity.Question;
import com.example.aiinterviewprep.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    private final QuestionRepository questionRepository;

    // Constructor injection
    public InterviewService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    /**
     * Generate a question for the given role.
     * Currently returns a stub (hardcoded) question.
     * Later, this will integrate with OpenAI to generate dynamic questions.
     */
    public Question generateQuestion(String role) {
        // Try to find an existing question for this role in the database
        List<Question> questions = questionRepository.findByRole(role);
        
        if (!questions.isEmpty()) {
            // If questions exist, return the first one
            return questions.get(0);
        }
        
        // STUB: If no questions in DB, create and return a hardcoded question
        Question stubQuestion = new Question();
        stubQuestion.setRole(role);
        stubQuestion.setQuestionText("Explain the key differences between REST and GraphQL APIs.");
        stubQuestion.setHints("Think about query flexibility, over-fetching, and use cases.");
        stubQuestion.setDifficulty(DifficultyLevel.MEDIUM);
        
        // Save this question to the database so it can be reused
        return questionRepository.save(stubQuestion);
    }

    /**
     * Evaluate an answer and generate feedback.
     * Currently returns stub (hardcoded) feedback.
     * Later, this will integrate with OpenAI to generate intelligent feedback.
     */
    public Feedback evaluateAnswer(Answer answer) {
        // STUB: Create hardcoded feedback
        Feedback stubFeedback = new Feedback();
        stubFeedback.setAnswer(answer);
        
        // Hardcoded feedback content
        stubFeedback.setStrengths("Good structure and clear explanation. You mentioned key concepts.");
        stubFeedback.setAreasForImprovement("Could provide more real-world examples and discuss caching strategies.");
        stubFeedback.setOverallComments("Overall, a solid answer. To improve, focus on the specific use cases where each approach excels.");
        
        // Hardcoded score (1-10 scale, or you could use 1-100)
        stubFeedback.setScore(7);
        
        return stubFeedback;
    }
}