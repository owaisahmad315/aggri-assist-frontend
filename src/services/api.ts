import type { ApiResponse, DiagnosisResult, Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('agri_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const json = await res.json().catch(() => ({ success: false, error: 'Invalid server response' }));
  if (!res.ok || !json.success) {
    return { success: false, error: json.error ?? `HTTP ${res.status}` };
  }
  return { success: true, data: json.data };
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function register(
  name: string,
  email: string,
  password: string
): Promise<ApiResponse<{ token: string; user: { id: string; name: string; email: string } }>> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse(res);
}

export async function login(
  email: string,
  password: string
): Promise<ApiResponse<{ token: string; user: { id: string; name: string; email: string } }>> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(res);
}

// ─── Chat (text + optional images) ───────────────────────────────────────────

export async function sendChatMessage(
  message: string,
  images?: File[],
  sessionId?: string
): Promise<ApiResponse<{ reply: string; sessionId: string }>> {
  try {
    const formData = new FormData();
    formData.append('message', message);
    if (sessionId) formData.append('sessionId', sessionId);
    images?.forEach((img) => formData.append('images', img));

    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    return handleResponse(res);
  } catch {
    return { success: false, error: 'Network error. Is the backend running?' };
  }
}

// ─── Dedicated Diagnosis (images required) ───────────────────────────────────

export async function analyzeCropImages(
  images: File[],
  userMessage: string,
  sessionId?: string
): Promise<ApiResponse<{
  sessionId: string;
  reply: string;
  diagnoses: DiagnosisResult[];
}>> {
  try {
    const formData = new FormData();
    images.forEach((img) => formData.append('images', img));
    formData.append('message', userMessage);
    if (sessionId) formData.append('sessionId', sessionId);

    const res = await fetch(`${API_BASE_URL}/diagnose`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    return handleResponse(res);
  } catch {
    return { success: false, error: 'Network error. Please try again.' };
  }
}

// ─── Voice Transcription ──────────────────────────────────────────────────────

export async function transcribeAudio(
  audioBlob: Blob
): Promise<ApiResponse<{ text: string }>> {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const res = await fetch(`${API_BASE_URL}/transcribe`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: formData,
    });
    return handleResponse(res);
  } catch {
    return { success: false, error: 'Transcription failed. Please try again.' };
  }
}

// ─── Sessions ─────────────────────────────────────────────────────────────────

export async function getSessions(): Promise<
  ApiResponse<Array<{ sessionId: string; title: string; updatedAt: string }>>
> {
  try {
    const res = await fetch(`${API_BASE_URL}/sessions`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(res);
  } catch {
    return { success: false, error: 'Failed to fetch sessions.' };
  }
}

export async function saveChatSession(
  sessionId: string,
  messages: Message[]
): Promise<ApiResponse<{ id: string; sessionId: string }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ sessionId, messages }),
    });
    return handleResponse(res);
  } catch {
    return { success: false, error: 'Failed to save session.' };
  }
}