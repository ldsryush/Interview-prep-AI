import axios from 'axios';

// Base URL for the backend
const API_BASE_URL = 'http://localhost:8080/api/interview';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// TypeScript interfaces (type definitions for the data)
export interface Question {
  id: number;
  role: string;
  questionText: string;
  hints: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  createdAt: string;
}

export interface Answer {
  id?: number;
  question: { id: number };
  answerText: string;
  submittedAt?: string;
}

export interface Feedback {
  id: number;
  answer: Answer;
  strengths: string;
  areasForImprovement: string;
  overallComments: string;
  score: number;
  generatedAt: string;
}

// API functions
export const getQuestion = async (role: string): Promise<Question> => {
  const response = await api.get<Question>('/question', {
    params: { role },
  });
  return response.data;
};

export const submitAnswer = async (answer: Answer): Promise<Feedback> => {
  const response = await api.post<Feedback>('/answer', answer);
  return response.data;
};