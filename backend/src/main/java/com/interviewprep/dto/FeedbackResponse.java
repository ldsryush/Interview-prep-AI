package com.interviewprep.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackResponse {
    private Long id;
    private Long answerId;
    private String feedbackText;
    private Integer score;
    private String strengths;
    private String improvements;
}
