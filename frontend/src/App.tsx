import React, { useState } from 'react';
import RoleSelection from './components/RoleSelection';
import InterviewSession from './components/InterviewSession';
import { Question, Answer, Feedback, getQuestion, submitAnswer } from './services/api';

type AppState = 'roleSelection' | 'interviewSession';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('roleSelection');
  const [selectedRole, setSelectedRole] = useState('');
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle role selection and fetch first question
  const handleStartInterview = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      // Fetch a question for the selected role
      const fetchedQuestion = await getQuestion(selectedRole);
      setQuestion(fetchedQuestion);
      setAppState('interviewSession');
    } catch (err) {
      setError('Failed to fetch question. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle answer submission
  const handleAnswerSubmit = async (answerText: string) => {
    if (!question) {
      setError('No question loaded');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create answer object
      const answer: Answer = {
        question: { id: question.id },
        answerText,
      };

      // Submit answer and get feedback
      const fetchedFeedback = await submitAnswer(answer);
      setFeedback(fetchedFeedback);
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle next question
  const handleNextQuestion = async () => {
    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      // Fetch next question for the same role
      const nextQuestion = await getQuestion(selectedRole);
      setQuestion(nextQuestion);
    } catch (err) {
      setError('Failed to fetch next question.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to role selection
  const handleBackToRoleSelection = () => {
    setAppState('roleSelection');
    setSelectedRole('');
    setQuestion(null);
    setFeedback(null);
    setError(null);
  };

  return (
    <div style={styles.app}>
      {/* Error message display */}
      {error && (
        <div style={styles.errorBanner}>
          <p style={styles.errorText}>❌ {error}</p>
        </div>
      )}

      {/* Role Selection Screen */}
      {appState === 'roleSelection' && (
        <RoleSelection
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          onStartInterview={handleStartInterview}
        />
      )}

      {/* Interview Session Screen */}
      {appState === 'interviewSession' && (
        <div>
          <button
            onClick={handleBackToRoleSelection}
            style={styles.backButton}
          >
            ← Back to Role Selection
          </button>
          <InterviewSession
            role={selectedRole}
            question={question}
            loading={loading}
            onAnswerSubmit={handleAnswerSubmit}
            feedback={feedback}
          />
        </div>
      )}
    </div>
  );
};

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    padding: '20px',
  },
  errorBanner: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '15px',
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '4px',
  },
  errorText: {
    color: '#721c24',
    margin: 0,
    fontSize: '14px',
  },
  backButton: {
    margin: '20px auto',
    display: 'block',
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default App;