export default interface QuestionDto {
  id?: string;
  title?: string;
  heading?: string;
  content: string;
  userId?: string;
  createdAt?: string;
  hashtags?: string[];
  tags?: string[];
}
