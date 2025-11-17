import React from 'react';
import type { FeedbackResponse } from '../types/api';

interface FeedbackViewProps {
  feedback: FeedbackResponse | null;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback }) => {
  if (!feedback) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#4caf50';
    if (score >= 6) return '#ff9800';
    return '#f44336';
  };

  return (
    <div className="feedback-view">
      <h3>AI Feedback</h3>
      
      <div className="score-section">
        <div className="score-circle" style={{ borderColor: getScoreColor(feedback.score) }}>
          <span className="score-value">{feedback.score}</span>
          <span className="score-label">/ 10</span>
        </div>
      </div>

      <div className="feedback-content">
        <div className="feedback-section">
          <h4>Overall Feedback</h4>
          <p>{feedback.feedbackText}</p>
        </div>

        <div className="feedback-section strengths">
          <h4>💪 Strengths</h4>
          <p>{feedback.strengths}</p>
        </div>

        <div className="feedback-section improvements">
          <h4>📈 Areas for Improvement</h4>
          <p>{feedback.improvements}</p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackView;
