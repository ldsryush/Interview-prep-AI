import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/interview';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface SessionMessage {
  id?: number;
  sessionId?: number;
  role: 'INTERVIEWER' | 'CANDIDATE';
  content: string;
  createdAt?: string;
}

export interface StartSessionResponse {
  sessionId: number;
  role: string;
  difficulty: Difficulty;
  interviewerMessage: string;
}

export interface SendMessageResponse {
  sessionId: number;
  interviewerMessage: string;
}

export interface EndSessionResponse {
  sessionId: number;
  strengths: string;
  areasForImprovement: string;
  overallComments: string;
  score: number;
}

export const startSession = async (
  role: string,
  difficulty: Difficulty = 'MEDIUM'
): Promise<StartSessionResponse> => {
  const response = await api.post<StartSessionResponse>('/session/start', {
    role,
    difficulty,
  });
  return response.data;
};

export const sendSessionMessage = async (
  sessionId: number,
  content: string
): Promise<SendMessageResponse> => {
  const response = await api.post<SendMessageResponse>(`/session/${sessionId}/message`, {
    content,
  });
  return response.data;
};

export const endSession = async (sessionId: number): Promise<EndSessionResponse> => {
  const response = await api.post<EndSessionResponse>(`/session/${sessionId}/end`);
  return response.data;
};
