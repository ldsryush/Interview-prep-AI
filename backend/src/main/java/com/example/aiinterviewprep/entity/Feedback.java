package com.example.aiinterviewprep.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "answer_id", nullable = false, unique = true)
    private Answer answer;

    @Column(nullable = false, length = 2000)
    private String strengths;

    @Column(nullable = false, length = 2000)
    private String areasForImprovement;

    @Column(length = 5000)
    private String overallComments;

    @Column(nullable = false)
    private Integer score;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        generatedAt = LocalDateTime.now();
    }
}