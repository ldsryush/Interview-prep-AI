package com.example.aiinterviewprep.controller;

import com.example.aiinterviewprep.entity.Answer;
import com.example.aiinterviewprep.entity.Feedback;
import com.example.aiinterviewprep.entity.Question;
import com.example.aiinterviewprep.repository.AnswerRepository;
import com.example.aiinterviewprep.repository.FeedbackRepository;
import com.example.aiinterviewprep.repository.QuestionRepository;
import com.example.aiinterviewprep.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final InterviewService interviewService;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final FeedbackRepository feedbackRepository;

    // Constructor injection - Spring automatically passes the dependencies
    public InterviewController(InterviewService interviewService,
                               QuestionRepository questionRepository,
                               AnswerRepository answerRepository,
                               FeedbackRepository feedbackRepository) {
        this.interviewService = interviewService;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.feedbackRepository = feedbackRepository;
    }

    // GET endpoint: Fetch a random question by role
    // URL: GET http://localhost:8080/api/interview/question?role=Backend Developer
    @GetMapping("/question")
    public ResponseEntity<Question> getQuestion(@RequestParam String role) {
        Question question = interviewService.generateQuestion(role);
        return ResponseEntity.ok(question);
    }

    // POST endpoint: Submit an answer and get feedback
    // URL: POST http://localhost:8080/api/interview/answer
    // Body: { "question": { "id": 1 }, "answerText": "REST is..." }
    @PostMapping("/answer")
    public ResponseEntity<Feedback> submitAnswer(@RequestBody Answer answer) {
        // Save the answer to the database
        Answer savedAnswer = answerRepository.save(answer);
        
        // Generate feedback using the service
        Feedback feedback = interviewService.evaluateAnswer(savedAnswer);
        
        // Save the feedback to the database
        Feedback savedFeedback = feedbackRepository.save(feedback);
        
        return ResponseEntity.ok(savedFeedback);
    }
}