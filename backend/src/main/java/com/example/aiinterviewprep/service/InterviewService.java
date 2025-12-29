package com.example.aiinterviewprep.service;

import com.example.aiinterviewprep.entity.Answer;
import com.example.aiinterviewprep.entity.DifficultyLevel;
import com.example.aiinterviewprep.entity.Feedback;
import com.example.aiinterviewprep.entity.Question;
import com.example.aiinterviewprep.repository.QuestionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class InterviewService {

    private final QuestionRepository questionRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String openAiModel;

    public InterviewService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Question generateQuestion(String role) {
        List<Question> questions = questionRepository.findByRole(role);
        if (!questions.isEmpty()) {
            return questions.get(0);
        }

        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            Question q = new Question();
            q.setRole(role);
            q.setQuestionText("Explain the key differences between REST and GraphQL APIs.");
            q.setHints("Think about query flexibility, over-fetching, and use cases.");
            q.setDifficulty(DifficultyLevel.MEDIUM);
            return questionRepository.save(q);
        }

        try {
            RestClient client = RestClient.builder()
                    .baseUrl("https://api.openai.com/v1/chat/completions")
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();

            Map<String, Object> body = new HashMap<>();
            body.put("model", openAiModel);
            body.put("response_format", Map.of("type", "json_object"));
            body.put("messages", List.of(
                    Map.of("role", "system", "content", "You are an expert technical interviewer. Generate a single concise interview question for the given role, plus a short hint and difficulty level (EASY, MEDIUM, HARD). Respond strictly as JSON with fields: questionText, hints, difficulty."),
                    Map.of("role", "user", "content", "Role: " + role)
            ));

            String response = client.post()
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            JsonNode json = objectMapper.readTree(content);

            Question q = new Question();
            q.setRole(role);
            q.setQuestionText(json.path("questionText").asText("Explain the key differences between REST and GraphQL APIs."));
            q.setHints(json.path("hints").asText("Think about query flexibility, over-fetching, and use cases."));
            String diff = json.path("difficulty").asText("MEDIUM");
            q.setDifficulty(parseDifficulty(diff));
            return questionRepository.save(q);
        } catch (Exception e) {
            Question q = new Question();
            q.setRole(role);
            q.setQuestionText("Explain the key differences between REST and GraphQL APIs.");
            q.setHints("Think about query flexibility, over-fetching, and use cases.");
            q.setDifficulty(DifficultyLevel.MEDIUM);
            return questionRepository.save(q);
        }
    }

    public Feedback evaluateAnswer(Answer answer) {
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            Feedback f = new Feedback();
            f.setAnswer(answer);
            f.setStrengths("Good structure and clear explanation. You mentioned key concepts.");
            f.setAreasForImprovement("Could provide more real-world examples and discuss caching strategies.");
            f.setOverallComments("Overall, a solid answer. To improve, focus on the specific use cases where each approach excels.");
            f.setScore(7);
            return f;
        }

        try {
            String questionText = answer.getQuestion() != null ? answer.getQuestion().getQuestionText() : "";
            RestClient client = RestClient.builder()
                    .baseUrl("https://api.openai.com/v1/chat/completions")
                    .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
                    .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .build();

            Map<String, Object> body = new HashMap<>();
            body.put("model", openAiModel);
            body.put("response_format", Map.of("type", "json_object"));
            body.put("messages", List.of(
                    Map.of("role", "system", "content", "You are an expert interview coach. Given a question and a candidate's answer, produce strengths, areasForImprovement, overallComments, and a numeric score from 1-10. Respond strictly as JSON."),
                    Map.of("role", "user", "content", "Question: " + questionText + "\nAnswer: " + answer.getAnswerText())
            ));

            String response = client.post()
                    .body(body)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            String content = root.path("choices").get(0).path("message").path("content").asText();
            JsonNode json = objectMapper.readTree(content);

            Feedback f = new Feedback();
            f.setAnswer(answer);
            f.setStrengths(json.path("strengths").asText("Good structure and clear explanation."));
            f.setAreasForImprovement(json.path("areasForImprovement").asText("Add real-world examples and discuss trade-offs."));
            f.setOverallComments(json.path("overallComments").asText("Solid answer; improve specificity and depth."));
            f.setScore(json.path("score").asInt(7));
            return f;
        } catch (Exception e) {
            Feedback f = new Feedback();
            f.setAnswer(answer);
            f.setStrengths("Good structure and clear explanation. You mentioned key concepts.");
            f.setAreasForImprovement("Could provide more real-world examples and discuss caching strategies.");
            f.setOverallComments("Overall, a solid answer. To improve, focus on the specific use cases where each approach excels.");
            f.setScore(7);
            return f;
        }
    }

    private DifficultyLevel parseDifficulty(String diff) {
        try {
            return DifficultyLevel.valueOf(diff.toUpperCase());
        } catch (Exception e) {
            return DifficultyLevel.MEDIUM;
        }
    }
}