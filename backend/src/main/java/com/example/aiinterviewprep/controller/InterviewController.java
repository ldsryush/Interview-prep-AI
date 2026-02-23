package com.example.aiinterviewprep.controller;

import com.example.aiinterviewprep.entity.Answer;
import com.example.aiinterviewprep.entity.DifficultyLevel;
import com.example.aiinterviewprep.entity.Feedback;
import com.example.aiinterviewprep.entity.Message;
import com.example.aiinterviewprep.entity.Question;
import com.example.aiinterviewprep.repository.AnswerRepository;
import com.example.aiinterviewprep.repository.FeedbackRepository;
import com.example.aiinterviewprep.repository.QuestionRepository;
import com.example.aiinterviewprep.service.InterviewConversationService;
import com.example.aiinterviewprep.service.InterviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final InterviewService interviewService;
    private final InterviewConversationService interviewConversationService;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final FeedbackRepository feedbackRepository;

    // Constructor injection - Spring automatically passes the dependencies
    public InterviewController(InterviewService interviewService,
                               InterviewConversationService interviewConversationService,
                               QuestionRepository questionRepository,
                               AnswerRepository answerRepository,
                               FeedbackRepository feedbackRepository) {
        this.interviewService = interviewService;
        this.interviewConversationService = interviewConversationService;
        this.questionRepository = questionRepository;
        this.answerRepository = answerRepository;
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping("/session/start")
    public ResponseEntity<InterviewConversationService.StartSessionResponse> startSession(
            @RequestBody StartSessionRequest request
    ) {
        InterviewConversationService.StartSessionResponse response =
                interviewConversationService.startSession(request.getRole(), request.getDifficulty());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/session/{sessionId}/message")
    public ResponseEntity<InterviewConversationService.MessageResponse> submitMessage(
            @PathVariable Long sessionId,
            @RequestBody SessionMessageRequest request
    ) {
        InterviewConversationService.MessageResponse response =
                interviewConversationService.processCandidateMessage(sessionId, request.getContent());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/session/{sessionId}/messages")
    public ResponseEntity<List<Message>> getSessionMessages(@PathVariable Long sessionId) {
        return ResponseEntity.ok(interviewConversationService.getSessionMessages(sessionId));
    }

    @PostMapping("/session/{sessionId}/end")
    public ResponseEntity<InterviewConversationService.EndSessionResponse> endSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(interviewConversationService.endSession(sessionId));
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

    public static class StartSessionRequest {
        private String role;
        private DifficultyLevel difficulty;

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public DifficultyLevel getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(DifficultyLevel difficulty) {
            this.difficulty = difficulty;
        }
    }

    public static class SessionMessageRequest {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}