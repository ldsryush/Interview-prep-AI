import React, { useState } from 'react';

interface AnswerInputProps {
  onSubmit: (answer: string) => void;
  disabled: boolean;
  loading: boolean;
}

const AnswerInput: React.FC<AnswerInputProps> = ({ onSubmit, disabled, loading }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer);
      setAnswer('');
    }
  };

  return (
    <form className="answer-input" onSubmit={handleSubmit}>
      <label htmlFor="answer-textarea">Your Answer:</label>
      <textarea
        id="answer-textarea"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer here..."
        rows={10}
      />
      <button type="submit" disabled={disabled || !answer.trim() || loading}>
        {loading ? 'Submitting...' : 'Submit Answer'}
      </button>
    </form>
  );
};

export default AnswerInput;
