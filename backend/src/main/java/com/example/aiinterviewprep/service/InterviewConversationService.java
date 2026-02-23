package com.example.aiinterviewprep.service;

import com.example.aiinterviewprep.entity.DifficultyLevel;
import com.example.aiinterviewprep.entity.InterviewSession;
import com.example.aiinterviewprep.entity.Message;
import com.example.aiinterviewprep.entity.MessageRole;
import com.example.aiinterviewprep.repository.InterviewSessionRepository;
import com.example.aiinterviewprep.repository.MessageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InterviewConversationService {

    private final InterviewSessionRepository interviewSessionRepository;
    private final MessageRepository messageRepository;
    private final OpenAiClientService openAiClientService;

    public InterviewConversationService(
            InterviewSessionRepository interviewSessionRepository,
            MessageRepository messageRepository,
            OpenAiClientService openAiClientService
    ) {
        this.interviewSessionRepository = interviewSessionRepository;
        this.messageRepository = messageRepository;
        this.openAiClientService = openAiClientService;
    }

    @Transactional
    public StartSessionResponse startSession(String role, DifficultyLevel difficulty) {
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role is required to start a session.");
        }

        DifficultyLevel resolvedDifficulty = difficulty == null ? DifficultyLevel.MEDIUM : difficulty;

        InterviewSession session = new InterviewSession(role.trim(), resolvedDifficulty);
        session.setActive(true);
        InterviewSession savedSession = interviewSessionRepository.save(session);

        String openingQuestion = openAiClientService.generateOpeningQuestion(role, resolvedDifficulty);

        Message interviewerMessage = new Message(savedSession, MessageRole.INTERVIEWER, openingQuestion);
        messageRepository.save(interviewerMessage);

        StartSessionResponse response = new StartSessionResponse();
        response.setSessionId(savedSession.getId());
        response.setRole(savedSession.getRole());
        response.setDifficulty(savedSession.getDifficulty());
        response.setInterviewerMessage(openingQuestion);
        return response;
    }

    @Transactional
    public MessageResponse processCandidateMessage(Long sessionId, String candidateMessageText) {
        if (candidateMessageText == null || candidateMessageText.isBlank()) {
            throw new IllegalArgumentException("Candidate message content is required.");
        }

        InterviewSession session = getActiveSession(sessionId);

        Message candidateMessage = new Message(session, MessageRole.CANDIDATE, candidateMessageText.trim());
        messageRepository.save(candidateMessage);

        List<Message> history = messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        String aiReply = openAiClientService.generateInterviewerReply(session.getRole(), session.getDifficulty(), history);

        Message interviewerMessage = new Message(session, MessageRole.INTERVIEWER, aiReply);
        messageRepository.save(interviewerMessage);

        MessageResponse response = new MessageResponse();
        response.setSessionId(sessionId);
        response.setInterviewerMessage(aiReply);
        return response;
    }

    @Transactional(readOnly = true)
    public List<Message> getSessionMessages(Long sessionId) {
        interviewSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
        return messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    @Transactional
    public EndSessionResponse endSession(Long sessionId) {
        InterviewSession session = interviewSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        List<Message> history = messageRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
        OpenAiClientService.SessionFeedback feedback =
                openAiClientService.generateSessionFeedback(session.getRole(), session.getDifficulty(), history);

        session.setActive(false);
        session.setEndedAt(LocalDateTime.now());
        interviewSessionRepository.save(session);

        EndSessionResponse response = new EndSessionResponse();
        response.setSessionId(sessionId);
        response.setStrengths(feedback.getStrengths());
        response.setAreasForImprovement(feedback.getAreasForImprovement());
        response.setOverallComments(feedback.getOverallComments());
        response.setScore(feedback.getScore());
        return response;
    }

    private InterviewSession getActiveSession(Long sessionId) {
        InterviewSession session = interviewSessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));

        if (!Boolean.TRUE.equals(session.getActive())) {
            throw new IllegalStateException("Session is not active: " + sessionId);
        }

        return session;
    }

    public static class StartSessionResponse {
        private Long sessionId;
        private String role;
        private DifficultyLevel difficulty;
        private String interviewerMessage;

        public Long getSessionId() {
            return sessionId;
        }

        public void setSessionId(Long sessionId) {
            this.sessionId = sessionId;
        }

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

        public String getInterviewerMessage() {
            return interviewerMessage;
        }

        public void setInterviewerMessage(String interviewerMessage) {
            this.interviewerMessage = interviewerMessage;
        }
    }

    public static class MessageResponse {
        private Long sessionId;
        private String interviewerMessage;

        public Long getSessionId() {
            return sessionId;
        }

        public void setSessionId(Long sessionId) {
            this.sessionId = sessionId;
        }

        public String getInterviewerMessage() {
            return interviewerMessage;
        }

        public void setInterviewerMessage(String interviewerMessage) {
            this.interviewerMessage = interviewerMessage;
        }
    }

    public static class EndSessionResponse {
        private Long sessionId;
        private String strengths;
        private String areasForImprovement;
        private String overallComments;
        private Integer score;

        public Long getSessionId() {
            return sessionId;
        }

        public void setSessionId(Long sessionId) {
            this.sessionId = sessionId;
        }

        public String getStrengths() {
            return strengths;
        }

        public void setStrengths(String strengths) {
            this.strengths = strengths;
        }

        public String getAreasForImprovement() {
            return areasForImprovement;
        }

        public void setAreasForImprovement(String areasForImprovement) {
            this.areasForImprovement = areasForImprovement;
        }

        public String getOverallComments() {
            return overallComments;
        }

        public void setOverallComments(String overallComments) {
            this.overallComments = overallComments;
        }

        public Integer getScore() {
            return score;
        }

        public void setScore(Integer score) {
            this.score = score;
        }
    }
}
