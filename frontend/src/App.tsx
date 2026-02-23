import React, { useState } from 'react';
import axios from 'axios';
import RoleSelection from './components/RoleSelection';
import InterviewSession from './components/InterviewSession';
import {
  Difficulty,
  EndSessionResponse,
  SessionMessage,
  sendSessionMessage,
  startSession,
  endSession,
} from './services/api';

type AppState = 'roleSelection' | 'interviewSession';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('roleSelection');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('MEDIUM');
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentInterviewerMessage, setCurrentInterviewerMessage] = useState<string>('');
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [finalFeedback, setFinalFeedback] = useState<EndSessionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getApiErrorMessage = (fallback: string, errorValue: unknown): string => {
    if (axios.isAxiosError(errorValue)) {
      const responseMessage = (errorValue.response?.data as { message?: string } | undefined)?.message;
      if (responseMessage) {
        return responseMessage;
      }
    }
    return fallback;
  };

  const handleStartInterview = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError(null);
    setFinalFeedback(null);

    try {
      const session = await startSession(selectedRole, selectedDifficulty);
      setSessionId(session.sessionId);
      setCurrentInterviewerMessage(session.interviewerMessage);
      setMessages([
        {
          role: 'INTERVIEWER',
          content: session.interviewerMessage,
        },
      ]);
      setAppState('interviewSession');
    } catch (err) {
      setError(getApiErrorMessage('Failed to start interview. Make sure backend is running and OPENAI_API_KEY is set.', err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (answerText: string) => {
    if (!sessionId) {
      setError('No active interview session');
      return;
    }

    setLoading(true);
    setError(null);
    setFinalFeedback(null);

    const candidateMessage: SessionMessage = {
      role: 'CANDIDATE',
      content: answerText,
    };
    setMessages((current) => [...current, candidateMessage]);

    try {
      const response = await sendSessionMessage(sessionId, answerText);
      setCurrentInterviewerMessage(response.interviewerMessage);
      setMessages((current) => [
        ...current,
        {
          role: 'INTERVIEWER',
          content: response.interviewerMessage,
        },
      ]);
    } catch (err) {
      setError(getApiErrorMessage('Failed to send your response. Please try again.', err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    if (!sessionId) {
      setError('No active interview session');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const feedback = await endSession(sessionId);
      setFinalFeedback(feedback);
    } catch (err) {
      setError(getApiErrorMessage('Failed to end session and generate final feedback.', err));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToRoleSelection = () => {
    setAppState('roleSelection');
    setSelectedRole('');
    setSelectedDifficulty('MEDIUM');
    setSessionId(null);
    setCurrentInterviewerMessage('');
    setMessages([]);
    setFinalFeedback(null);
    setError(null);
  };

  return (
    <div style={styles.app}>
      {error && (
        <div style={styles.errorBanner}>
          <p style={styles.errorText}>❌ {error}</p>
        </div>
      )}

      {appState === 'roleSelection' && (
        <RoleSelection
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedDifficulty={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          onStartInterview={handleStartInterview}
        />
      )}

      {appState === 'interviewSession' && (
        <div>
          <button onClick={handleBackToRoleSelection} style={styles.backButton}>
            ← Back to Role Selection
          </button>
          <InterviewSession
            role={selectedRole}
            difficulty={selectedDifficulty}
            interviewerMessage={currentInterviewerMessage}
            messages={messages}
            loading={loading}
            onAnswerSubmit={handleAnswerSubmit}
            onEndInterview={handleEndInterview}
            feedback={finalFeedback}
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
