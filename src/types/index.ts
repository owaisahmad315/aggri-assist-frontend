export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  images?: UploadedImage[];
  timestamp: Date;
  isLoading?: boolean;
}

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  name: string;
}

export interface DiagnosisResult {
  disease?: string;
  severity?: 'low' | 'medium' | 'high';
  confidence?: number;
  recommendations?: string[];
  description?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}