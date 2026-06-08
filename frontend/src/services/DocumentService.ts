import apiClient from '@/config/apiClient';
import type DocumentResponse from '@/models/DocumentResponse';

// POST /library/documents  (multipart/form-data)
// Part 1: "file"     → binary file
// Part 2: "document" → JSON blob { title, description }
export const uploadDocument = async (
  file: File,
  title: string,
  description: string
): Promise<{ documentId: string; message: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'document',
    new Blob([JSON.stringify({ title, description })], { type: 'application/json' })
  );

  const response = await apiClient.post('/library/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// GET /library/documents
export const getAllDocuments = async (): Promise<DocumentResponse[]> => {
  const response = await apiClient.get<DocumentResponse[]>('/library/documents');
  return response.data;
};

// GET /library/documents/{id}
export const getDocument = async (id: string): Promise<DocumentResponse> => {
  const response = await apiClient.get<DocumentResponse>(`/library/documents/${id}`);
  return response.data;
};

// DELETE /library/documents/{id}
export const deleteDocument = async (id: string): Promise<void> => {
  await apiClient.delete(`/library/documents/${id}`);
};
