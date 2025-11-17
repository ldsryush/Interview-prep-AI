package com.interviewprep.service;

import com.interviewprep.entity.Answer;
import com.interviewprep.entity.Feedback;
import com.interviewprep.entity.Question;
import com.interviewprep.repository.AnswerRepository;
import com.interviewprep.repository.FeedbackRepository;
import com.interviewprep.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class AnswerService {
    
    private final AnswerRepository answerRepository;
    private final QuestionRepository questionRepository;
    private final FeedbackRepository feedbackRepository;
    
    public AnswerService(AnswerRepository answerRepository, 
                        QuestionRepository questionRepository,
                        FeedbackRepository feedbackRepository) {
        this.answerRepository = answerRepository;
        this.questionRepository = questionRepository;
        this.feedbackRepository = feedbackRepository;
    }
    
    public Feedback evaluateAnswer(Long questionId, String answerText) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new RuntimeException("Question not found"));
        
        // Save the answer
        Answer answer = new Answer();
        answer.setQuestion(question);
        answer.setAnswerText(answerText);
        answer = answerRepository.save(answer);
        
        // AI simulation: Generate feedback based on answer length and keywords
        Feedback feedback = generateFeedback(answer, answerText);
        feedback.setAnswer(answer);
        
        return feedbackRepository.save(feedback);
    }
    
    private Feedback generateFeedback(Answer answer, String answerText) {
        Feedback feedback = new Feedback();
        
        // Simple AI simulation based on answer characteristics
        int wordCount = answerText.trim().split("\\s+").length;
        int score;
        String feedbackText;
        String strengths;
        String improvements;
        
        if (wordCount < 20) {
            score = 5;
            feedbackText = "Your answer is quite brief. While conciseness is valuable, providing more details would demonstrate deeper understanding.";
            strengths = "Concise communication";
            improvements = "Add more specific examples and elaborate on key points to showcase your knowledge better.";
        } else if (wordCount < 50) {
            score = 7;
            feedbackText = "Good answer with reasonable detail. You covered the main points effectively.";
            strengths = "Clear structure and good coverage of key concepts";
            improvements = "Consider adding real-world examples or discussing potential trade-offs to strengthen your response.";
        } else if (wordCount < 100) {
            score = 8;
            feedbackText = "Excellent answer! You provided comprehensive details and showed strong understanding of the topic.";
            strengths = "Thorough explanation with good depth, demonstrates strong knowledge of the subject matter";
            improvements = "Your answer is already strong. Consider practicing delivery speed to ensure you can communicate this effectively within time constraints.";
        } else {
            score = 9;
            feedbackText = "Outstanding answer! You demonstrated exceptional depth of knowledge and provided extensive details.";
            strengths = "Comprehensive coverage, excellent depth of knowledge, well-structured response with specific details";
            improvements = "Excellent response overall. In a real interview, ensure you can gauge the interviewer's interest to avoid over-explaining if they want to move on.";
        }
        
        // Bonus points for technical keywords
        String lowerAnswer = answerText.toLowerCase();
        if (lowerAnswer.contains("example") || lowerAnswer.contains("experience")) {
            score = Math.min(10, score + 1);
            strengths += " Includes relevant examples from experience.";
        }
        
        feedback.setScore(score);
        feedback.setFeedbackText(feedbackText);
        feedback.setStrengths(strengths);
        feedback.setImprovements(improvements);
        
        return feedback;
    }
}
