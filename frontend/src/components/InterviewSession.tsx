import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import { Difficulty, EndSessionResponse, SessionMessage } from '../services/api';
=======
import { Question, Feedback } from './services/api';
import { on } from 'events';
>>>>>>> abb712429d5d64d61e3585b6c463a92dcc617d2a

interface InterviewSessionProps {
  role: string;
  difficulty: Difficulty;
  interviewerMessage: string;
  messages: SessionMessage[];
  loading: boolean;
  onAnswerSubmit: (answerText: string) => void;
  onEndInterview: () => void;
  feedback: EndSessionResponse | null;
}

const InterviewSession: React.FC<InterviewSessionProps> = ({
  role,
  difficulty,
  interviewerMessage,
  messages,
  loading,
  onAnswerSubmit,
  onEndInterview,
  feedback,
}) => {
  const [answerText, setAnswerText] = useState('');
<<<<<<< HEAD
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
=======
  const [submitted, setSubmitted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
>>>>>>> abb712429d5d64d61e3585b6c463a92dcc617d2a

  useEffect(() => {
    const recognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!recognitionConstructor) {
      setSpeechSupported(false);
      return;
    }

    setSpeechSupported(true);
    const recognition = new recognitionConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalTranscript += transcript;
        }
      }

      const transcript = finalTranscript.trim();
      if (!transcript) {
        return;
      }

      setAnswerText((current) => `${current} ${transcript}`.trim());
    };

    recognition.onerror = (event: any) => {
      setMicError(`Microphone error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (!interviewerMessage || feedback) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `Interviewer says: ${interviewerMessage}`
    );
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [interviewerMessage, feedback, role]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `Here is your feedback. Score ${feedback.score} out of 10. Strengths: ${feedback.strengths}. Areas for improvement: ${feedback.areasForImprovement}. Overall comments: ${feedback.overallComments}`
    );
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
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
      recognitionRef.current?.stop();
      setIsListening(false);
      onAnswerSubmit(answerText);
      setAnswerText('');
    }
  };

  const handleMicToggle = () => {
    if (!recognitionRef.current) {
      setMicError('Speech recognition is not supported in this browser. Use Chrome or Edge.');
      return;
    }

    setMicError(null);

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current.start();
    setIsListening(true);
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
      if (answerText.trim()) {
        onAnswerSubmit(answerText);
        setAnswerText('');
      }
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
    if (answerText.trim()) {
      onAnswerSubmit(answerText);
      setAnswerText('');
    }
  };

  // Show loading state
  if (loading && messages.length === 0) {
    return (
      <div style={styles.container}>
        <p style={styles.loadingText}>Starting interview...</p>
      </div>
    );
  }

  // Show active interview conversation
  if (!feedback) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.role}>Role: {role}</h2>
          <span style={styles.difficulty}>Difficulty: {difficulty}</span>
        </div>

        <div style={styles.questionBox}>
          <h3 style={styles.questionLabel}>Conversation:</h3>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}-${message.content.slice(0, 16)}`}
              style={
                message.role === 'INTERVIEWER'
                  ? styles.interviewerBubble
                  : styles.candidateBubble
              }
            >
              <strong>{message.role === 'INTERVIEWER' ? 'Interviewer' : 'You'}:</strong>{' '}
              {message.content}
            </div>
          ))}
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
            rows={5}
          />
          <div style={styles.buttonGroup}>
<<<<<<< HEAD
            <button onClick={handleSubmit} style={styles.submitButton} disabled={loading}>
              {loading ? 'Sending...' : 'Send Response'}
            </button>
            <button
              onClick={handleMicToggle}
              style={styles.micButton}
              disabled={!speechSupported || loading}
            >
              {isListening ? 'Stop Mic' : 'Start Mic'}
            </button>
            <button onClick={onEndInterview} style={styles.endButton} disabled={loading}>
              End Interview
=======
            {!isRecording ? (
              <button onClick={startRecording} style={styles.micButton}>🎤 Record Answer</button>
            ) : (
              <button onClick={stopRecording} style={styles.stopButton}>⏹️ Stop Recording</button>
            )}
            <button onClick={handleSubmit} style={styles.submitButton}>
              Submit Answer
>>>>>>> abb712429d5d64d61e3585b6c463a92dcc617d2a
            </button>
          </div>
          {micError && <p style={styles.micError}>{micError}</p>}
          {!speechSupported && (
            <p style={styles.micHint}>Voice input is available in Chrome or Edge.</p>
          )}
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
            <p style={styles.feedbackHint}>Interview ended. Use Back to Role Selection to start a new one.</p>
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
  endButton: {
    padding: '12px 20px',
    fontSize: '16px',
    fontWeight: 'bold' as const,
    backgroundColor: '#dc3545',
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
  micError: {
    marginTop: '10px',
    color: '#c82333',
    fontSize: '13px',
  },
  micHint: {
    marginTop: '10px',
    color: '#666',
    fontSize: '13px',
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
  interviewerBubble: {
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#e7f3ff',
    borderRadius: '6px',
    color: '#004085',
    lineHeight: '1.5',
  },
  candidateBubble: {
    marginBottom: '12px',
    padding: '12px',
    backgroundColor: '#f1f3f5',
    borderRadius: '6px',
    color: '#343a40',
    lineHeight: '1.5',
  },
  feedbackHint: {
    margin: 0,
    color: '#333',
    fontSize: '14px',
  },
};

export default InterviewSession;