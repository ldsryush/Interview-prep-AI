import React, { useState, useEffect, useRef } from 'react';
import { Question, Feedback } from '../services/api';

interface InterviewSessionProps {
  role: string;
  question: Question | null;
  loading: boolean;
  onAnswerSubmit: (answerText: string) => void;
  feedback: Feedback | null;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({
  role,
  question,
  loading,
  onAnswerSubmit,
  feedback,
}) => {
  const [answerText, setAnswerText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Reset form when feedback is received
  useEffect(() => {
    if (feedback) {
      setSubmitted(true);
    }
  }, [feedback]);

  useEffect(() => {
    if (question) {
      const utter = new SpeechSynthesisUtterance(`${question.questionText}${question.hints ? ' Hint: ' + question.hints : ''}`);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }, [question]);

  useEffect(() => {
    if (feedback) {
      const text = `Score ${feedback.score} out of 10. Strengths: ${feedback.strengths}. Areas for improvement: ${feedback.areasForImprovement}. Overall comments: ${feedback.overallComments}.`;
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }, [feedback]);

  const handleSubmit = () => {
    if (answerText.trim()) {
      onAnswerSubmit(answerText);
      setAnswerText('');
    }
  };

  const handleNextQuestion = () => {
    setSubmitted(false);
    setAnswerText('');
  };

  const startRecording = () => {
    const SR: typeof window & { webkitSpeechRecognition?: any } = window as any;
    const SpeechRecognitionCtor = (SR.SpeechRecognition || SR.webkitSpeechRecognition);
    if (!SpeechRecognitionCtor) {
      alert('Speech Recognition is not supported in this browser.');
      return;
    }
    const recognition: SpeechRecognition = new SpeechRecognitionCtor();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswerText(transcript);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
    setIsRecording(true);
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(false);
  };

  // Show loading state
  if (loading && !question) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Loading question...</p>
      </div>
    );
  }

  // Show question and answer form (before submission)
  if (question && !submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.role}>Role: {role}</h2>
          <span style={styles.difficulty}>Difficulty: {question.difficulty}</span>
        </div>

        <div style={styles.questionBox}>
          <h3 style={styles.questionLabel}>Question:</h3>
          <p style={styles.questionText}>{question.questionText}</p>
          {question.hints && (
            <div style={styles.hintsBox}>
              <strong>💡 Hint:</strong> {question.hints}
            </div>
          )}
        </div>

        <div style={styles.answerBox}>
          <label htmlFor="answerTextarea" style={styles.label}>
            Your Answer:
          </label>
          <textarea
            id="answerTextarea"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your answer here..."
            style={styles.textarea}
            rows={6}
          />
          <div style={styles.buttonGroup}>
            {!isRecording ? (
              <button onClick={startRecording} style={styles.micButton}>🎤 Record Answer</button>
            ) : (
              <button onClick={stopRecording} style={styles.stopButton}>⏹️ Stop Recording</button>
            )}
            <button onClick={handleSubmit} style={styles.submitButton}>
              Submit Answer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show feedback (after submission)
  if (feedback) {
    return (
      <div style={styles.container}>
        <div style={styles.feedbackBox}>
          <h2 style={styles.feedbackTitle}>Feedback</h2>

          <div style={styles.scoreBox}>
            <span style={styles.scoreLabel}>Score:</span>
            <span style={styles.scoreValue}>{feedback.score}/10</span>
          </div>

          <div style={styles.feedbackSection}>
            <h3 style={styles.sectionTitle}>✅ Strengths:</h3>
            <p style={styles.feedbackText}>{feedback.strengths}</p>
          </div>

          <div style={styles.feedbackSection}>
            <h3 style={styles.sectionTitle}>📝 Areas for Improvement:</h3>
            <p style={styles.feedbackText}>{feedback.areasForImprovement}</p>
          </div>

          <div style={styles.feedbackSection}>
            <h3 style={styles.sectionTitle}>💬 Overall Comments:</h3>
            <p style={styles.feedbackText}>{feedback.overallComments}</p>
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={handleNextQuestion} style={styles.nextButton}>
              Next Question
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '30px auto',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '30px',
    paddingBottom: '15px',
    borderBottom: '2px solid #e0e0e0',
  },
  role: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    color: '#333',
    margin: 0,
  },
  difficulty: {
    padding: '6px 12px',
    backgroundColor: '#ffc107',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
  },
  loadingText: {
    textAlign: 'center' as const,
    fontSize: '16px',
    color: '#666',
  },
  questionBox: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    borderLeft: '4px solid #007bff',
  },
  questionLabel: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '10px',
    margin: 0,
  },
  questionText: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '15px',
    margin: '10px 0 15px 0',
  },
  hintsBox: {
    padding: '12px',
    backgroundColor: '#e7f3ff',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#0066cc',
  },
  answerBox: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'Arial, sans-serif',
    boxSizing: 'border-box' as const,
    resize: 'vertical' as const,
  },
  buttonGroup: {
    display: 'flex' as const,
    gap: '10px',
    marginTop: '15px',
  },
  submitButton: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  micButton: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    backgroundColor: '#17a2b8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  stopButton: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  nextButton: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  feedbackBox: {
    padding: '20px',
    backgroundColor: '#f0f8ff',
    borderRadius: '4px',
    borderLeft: '4px solid #28a745',
  },
  feedbackTitle: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '20px',
  },
  scoreBox: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    marginBottom: '20px',
    textAlign: 'center' as const,
    border: '2px solid #ffc107',
  },
  scoreLabel: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#666',
    marginRight: '10px',
  },
  scoreValue: {
    fontSize: '28px',
    fontWeight: 'bold' as const,
    color: '#ffc107',
  },
  feedbackSection: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold' as const,
    color: '#333',
    marginBottom: '10px',
  },
  feedbackText: {
    fontSize: '14px',
    color: '#555',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default InterviewSession;