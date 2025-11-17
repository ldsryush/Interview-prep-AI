package com.interviewprep.service;

import com.interviewprep.entity.Question;
import com.interviewprep.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    private final Random random = new Random();
    
    // Simulated AI question templates by role
    private static final Map<String, String[]> QUESTION_TEMPLATES = new HashMap<>();
    
    static {
        QUESTION_TEMPLATES.put("Software Engineer", new String[]{
            "Explain the difference between abstract classes and interfaces in Java.",
            "What is the time complexity of a binary search algorithm?",
            "Describe how you would implement a least-recently-used (LRU) cache.",
            "What are the SOLID principles in object-oriented programming?",
            "How would you optimize a slow database query?"
        });
        
        QUESTION_TEMPLATES.put("Data Scientist", new String[]{
            "Explain the bias-variance tradeoff in machine learning.",
            "What is the difference between supervised and unsupervised learning?",
            "How would you handle missing data in a dataset?",
            "Describe a situation where you would use a random forest vs. a neural network.",
            "What metrics would you use to evaluate a classification model?"
        });
        
        QUESTION_TEMPLATES.put("Product Manager", new String[]{
            "How do you prioritize features in a product roadmap?",
            "Describe your process for gathering and validating customer requirements.",
            "How would you handle conflicting stakeholder interests?",
            "What metrics would you track to measure product success?",
            "Explain how you would launch a new product feature."
        });
        
        QUESTION_TEMPLATES.put("Frontend Developer", new String[]{
            "Explain the virtual DOM and how React uses it.",
            "What are the differences between let, const, and var in JavaScript?",
            "How would you optimize the performance of a web application?",
            "Describe your approach to responsive web design.",
            "What is the event loop in JavaScript?"
        });
    }
    
    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }
    
    public Question generateQuestion(String role) {
        // AI simulation: Select a random question for the role
        String[] questions = QUESTION_TEMPLATES.getOrDefault(role, new String[]{
            "Tell me about yourself and your experience.",
            "What are your strengths and weaknesses?",
            "Why are you interested in this position?"
        });
        
        String questionText = questions[random.nextInt(questions.length)];
        
        Question question = new Question();
        question.setRole(role);
        question.setQuestionText(questionText);
        
        return questionRepository.save(question);
    }
}
