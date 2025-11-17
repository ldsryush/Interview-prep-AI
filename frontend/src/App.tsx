import { useState } from 'react';
import RoleSelector from './components/RoleSelector';
import QuestionDisplay from './components/QuestionDisplay';
import AnswerInput from './components/AnswerInput';
import FeedbackView from './components/FeedbackView';
import { getQuestion, submitAnswer } from './services/api';
import type { QuestionResponse, FeedbackResponse } from './types/api';
import './App.css';

function App() {
  const [selectedRole, setSelectedRole] = useState('');
  const [question, setQuestion] = useState<QuestionResponse | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetQuestion = async () => {
    if (!selectedRole) {
      setError('Please select a role first');
      return;
    }

    setLoading(true);
    setError(null);
    setFeedback(null);
    
    try {
      const newQuestion = await getQuestion(selectedRole);
      setQuestion(newQuestion);
    } catch (err) {
      setError('Failed to fetch question. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (answerText: string) => {
    if (!question) {
      setError('No question available');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const feedbackResponse = await submitAnswer({
        questionId: question.id,
        answerText,
      });
      setFeedback(feedbackResponse);
    } catch (err) {
      setError('Failed to submit answer. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion(null);
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 AI Interview Prep</h1>
        <p>Practice your interview skills with AI-powered feedback</p>
      </header>

      <main className="app-main">
        <div className="controls">
          <RoleSelector
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            disabled={loading}
          />
          <button
            className="get-question-btn"
            onClick={handleGetQuestion}
            disabled={!selectedRole || loading}
          >
            {loading && !question ? 'Loading...' : 'Get Question'}
          </button>
          {question && (
            <button
              className="reset-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Start New Question
            </button>
          )}
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <QuestionDisplay question={question} />

        {question && !feedback && (
          <AnswerInput
            onSubmit={handleSubmitAnswer}
            disabled={loading}
            loading={loading}
          />
        )}

        <FeedbackView feedback={feedback} />

        {feedback && (
          <button
            className="next-question-btn"
            onClick={handleReset}
          >
            Try Another Question
          </button>
        )}
      </main>

      <footer className="app-footer">
        <p>Note: This is a simulated AI. For production, integrate with actual AI services like OpenAI GPT.</p>
      </footer>
    </div>
  );
}

export default App;
