package com.example.aiinterviewprep.service;

import com.example.aiinterviewprep.entity.DifficultyLevel;
import com.example.aiinterviewprep.entity.Message;
import com.example.aiinterviewprep.entity.MessageRole;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class OpenAiClientService {

    private final String apiKey;
    private final String model;
    private final String baseUrl;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public OpenAiClientService(
            @Value("${openai.api.key}") String apiKey,
            @Value("${openai.model}") String model,
            @Value("${openai.base-url}") String baseUrl,
            ObjectMapper objectMapper
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = baseUrl;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(20))
                .build();
    }

    public String generateOpeningQuestion(String role, DifficultyLevel difficulty) {
        String systemPrompt = "You are a realistic technical interviewer. Ask one interview question at a time. " +
                "Keep responses concise and professional. Difficulty level is " + difficulty + ".";
        String userPrompt = "Start a mock interview for a " + role + " candidate. Ask the first question only.";
        return chatCompletion(systemPrompt, userPrompt, List.of());
    }

    public String generateInterviewerReply(String role, DifficultyLevel difficulty, List<Message> history) {
        String systemPrompt = "You are a realistic technical interviewer for a " + role + " role. " +
                "Difficulty level is " + difficulty + ". " +
                "For each candidate response: briefly acknowledge it, give concise feedback, then ask the next question. " +
                "Keep the total response under 140 words.";
        return chatCompletion(systemPrompt, null, history);
    }

    public SessionFeedback generateSessionFeedback(String role, DifficultyLevel difficulty, List<Message> history) {
        String systemPrompt = "You are an interview evaluator for role " + role + " at " + difficulty + " difficulty. " +
                "Return STRICT JSON with fields: strengths, areasForImprovement, overallComments, score. " +
                "score must be an integer from 1 to 10.";

        String userPrompt = "Based on the full transcript, provide final feedback JSON only.";
        String raw = chatCompletion(systemPrompt, userPrompt, history);

        try {
            JsonNode jsonNode = objectMapper.readTree(raw);
            SessionFeedback feedback = new SessionFeedback();
            feedback.setStrengths(readTextOrDefault(jsonNode, "strengths", "Good effort and communication."));
            feedback.setAreasForImprovement(readTextOrDefault(jsonNode, "areasForImprovement", "Add more concrete examples and deeper trade-off analysis."));
            feedback.setOverallComments(readTextOrDefault(jsonNode, "overallComments", "Solid attempt. Continue practicing with structured examples."));
            feedback.setScore(readScore(jsonNode));
            return feedback;
        } catch (Exception parseException) {
            SessionFeedback fallback = new SessionFeedback();
            fallback.setStrengths("Good communication and effort across the session.");
            fallback.setAreasForImprovement("Provide more specific examples and clearer technical trade-offs.");
            fallback.setOverallComments(raw);
            fallback.setScore(7);
            return fallback;
        }
    }

    private int readScore(JsonNode jsonNode) {
        if (jsonNode.has("score") && jsonNode.get("score").isInt()) {
            int score = jsonNode.get("score").asInt();
            return Math.max(1, Math.min(10, score));
        }
        return 7;
    }

    private String readTextOrDefault(JsonNode jsonNode, String field, String fallback) {
        if (jsonNode.has(field) && jsonNode.get(field).isTextual()) {
            String value = jsonNode.get(field).asText().trim();
            if (!value.isEmpty()) {
                return value;
            }
        }
        return fallback;
    }

    private String chatCompletion(String systemPrompt, String userPrompt, List<Message> history) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OpenAI API key is missing. Set OPENAI_API_KEY environment variable.");
        }

        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));

        for (Message message : history) {
            messages.add(Map.of(
                    "role", message.getRole() == MessageRole.CANDIDATE ? "user" : "assistant",
                    "content", message.getContent()
            ));
        }

        if (userPrompt != null && !userPrompt.isBlank()) {
            messages.add(Map.of("role", "user", "content", userPrompt));
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", model);
        payload.put("temperature", 0.7);
        payload.put("messages", messages);

        try {
            String requestBody = objectMapper.writeValueAsString(payload);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(baseUrl + "/chat/completions"))
                    .header("Authorization", "Bearer " + apiKey)
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(60))
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new RuntimeException("OpenAI request failed with status " + response.statusCode() + ": " + response.body());
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                throw new RuntimeException("OpenAI response did not include choices.");
            }

            String content = choices.get(0).path("message").path("content").asText();
            if (content == null || content.isBlank()) {
                throw new RuntimeException("OpenAI response content was empty.");
            }
            return content.trim();

        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to call OpenAI API.", exception);
        } catch (IOException exception) {
            throw new RuntimeException("Failed to call OpenAI API.", exception);
        }
    }

    public static class SessionFeedback {
        private String strengths;
        private String areasForImprovement;
        private String overallComments;
        private Integer score;

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
