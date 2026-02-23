package com.example.aiinterviewprep.controller;

import com.example.aiinterviewprep.entity.DifficultyLevel;
import com.example.aiinterviewprep.entity.Message;
import com.example.aiinterviewprep.service.InterviewConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
public class InterviewController {

    private final InterviewConversationService interviewConversationService;

    // Constructor injection - Spring automatically passes the dependencies
    public InterviewController(InterviewConversationService interviewConversationService) {
        this.interviewConversationService = interviewConversationService;
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