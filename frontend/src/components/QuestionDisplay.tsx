import React from 'react';
import type { QuestionResponse } from '../types/api';

interface QuestionDisplayProps {
  question: QuestionResponse | null;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  if (!question) {
    return (
      <div className="question-display empty">
        <p>Select a role and click "Get Question" to start your interview practice.</p>
      </div>
    );
  }

  return (
    <div className="question-display">
      <h3>Interview Question</h3>
      <div className="question-content">
        <span className="role-badge">{question.role}</span>
        <p className="question-text">{question.questionText}</p>
      </div>
    </div>
  );
};

export default QuestionDisplay;
