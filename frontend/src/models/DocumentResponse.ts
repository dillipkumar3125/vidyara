export type DocumentStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';

export default interface DocumentResponse {
  id: string;
  title: string;
  description?: string;
  fileType?: string;
  fileSize?: number;
  uploadedBy?: string;
  status: DocumentStatus;
  createdAt?: string;
}
