package com.interviewprep.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    
    @NotNull(message = "Question ID is required")
    private Long questionId;
    
    @NotBlank(message = "Answer text is required")
    private String answerText;
}
