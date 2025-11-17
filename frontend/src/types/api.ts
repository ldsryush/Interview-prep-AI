export interface QuestionResponse {
  id: number;
  role: string;
  questionText: string;
}

export interface AnswerRequest {
  questionId: number;
  answerText: string;
}

export interface FeedbackResponse {
  id: number;
  answerId: number;
  feedbackText: string;
  score: number;
  strengths: string;
  improvements: string;
}
