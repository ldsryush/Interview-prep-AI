import type { QuestionResponse, AnswerRequest, FeedbackResponse } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getQuestion = async (role: string): Promise<QuestionResponse> => {
  const response = await fetch(`${API_BASE_URL}/question?role=${encodeURIComponent(role)}`);
  if (!response.ok) {
    throw new Error('Failed to fetch question');
  }
  return response.json();
};

export const submitAnswer = async (answerRequest: AnswerRequest): Promise<FeedbackResponse> => {
  const response = await fetch(`${API_BASE_URL}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answerRequest),
  });
  if (!response.ok) {
    throw new Error('Failed to submit answer');
  }
  return response.json();
};
