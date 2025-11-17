package com.interviewprep.controller;

import com.interviewprep.dto.AnswerRequest;
import com.interviewprep.dto.FeedbackResponse;
import com.interviewprep.dto.QuestionResponse;
import com.interviewprep.entity.Feedback;
import com.interviewprep.entity.Question;
import com.interviewprep.service.AnswerService;
import com.interviewprep.service.QuestionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"${cors.allowed-origins}"})
public class InterviewController {
    
    private final QuestionService questionService;
    private final AnswerService answerService;
    
    public InterviewController(QuestionService questionService, AnswerService answerService) {
        this.questionService = questionService;
        this.answerService = answerService;
    }
    
    @GetMapping("/question")
    public ResponseEntity<QuestionResponse> getQuestion(@RequestParam String role) {
        Question question = questionService.generateQuestion(role);
        
        QuestionResponse response = new QuestionResponse(
            question.getId(),
            question.getRole(),
            question.getQuestionText()
        );
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/answer")
    public ResponseEntity<FeedbackResponse> submitAnswer(@Valid @RequestBody AnswerRequest request) {
        Feedback feedback = answerService.evaluateAnswer(
            request.getQuestionId(),
            request.getAnswerText()
        );
        
        FeedbackResponse response = new FeedbackResponse(
            feedback.getId(),
            feedback.getAnswer().getId(),
            feedback.getFeedbackText(),
            feedback.getScore(),
            feedback.getStrengths(),
            feedback.getImprovements()
        );
        
        return ResponseEntity.ok(response);
    }
}
