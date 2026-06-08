import apiClient from '@/config/apiClient';
import type QuestionDto from '@/models/QuestionDto';
import type AnswerDto from '@/models/AnswerDto';

// ── Questions ────────────────────────────────────────────────────────────────

// GET /forum/questions
export const getAllQuestions = async (): Promise<QuestionDto[]> => {
  const response = await apiClient.get<QuestionDto[]>('/forum/questions');
  return response.data;
};

// GET /forum/questions/{questionId}
export const getQuestionById = async (questionId: string): Promise<QuestionDto> => {
  const response = await apiClient.get<QuestionDto>(`/forum/questions/${questionId}`);
  return response.data;
};

// POST /forum/questions
export const createQuestion = async (question: QuestionDto): Promise<QuestionDto> => {
  const response = await apiClient.post<QuestionDto>('/forum/questions', question);
  return response.data;
};

// PUT /forum/questions/{questionId}
export const updateQuestion = async (
  questionId: string,
  question: QuestionDto
): Promise<QuestionDto> => {
  const response = await apiClient.put<QuestionDto>(`/forum/questions/${questionId}`, question);
  return response.data;
};

// DELETE /forum/questions/{questionId}
export const deleteQuestion = async (questionId: string): Promise<void> => {
  await apiClient.delete(`/forum/questions/${questionId}`);
};

// ── Answers ──────────────────────────────────────────────────────────────────

// GET /forum/questions/{questionId}/answers
export const getAnswersByQuestion = async (questionId: string): Promise<AnswerDto[]> => {
  const response = await apiClient.get<AnswerDto[]>(
    `/forum/questions/${questionId}/answers`
  );
  return response.data;
};

// POST /forum/questions/{questionId}/answers
export const createAnswer = async (
  questionId: string,
  answer: AnswerDto
): Promise<AnswerDto> => {
  const response = await apiClient.post<AnswerDto>(
    `/forum/questions/${questionId}/answers`,
    answer
  );
  return response.data;
};

// DELETE /forum/questions/{questionId}/answers/{answerId}
export const deleteAnswer = async (
  questionId: string,
  answerId: string
): Promise<void> => {
  await apiClient.delete(`/forum/questions/${questionId}/answers/${answerId}`);
};
