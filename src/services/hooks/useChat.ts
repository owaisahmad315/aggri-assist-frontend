import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
 import { sendChatMessage } from '../api';
import type { Message, UploadedImage } from '../../types';
 
export function useChat() {
  const sessionIdRef = useRef<string>(uuidv4());

  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content:   
        "Hello! I'm AgriAssist, your AI-powered crop health advisor. Upload images of your crops and describe any issues you're seeing — I'll diagnose diseases, pests, nutrient deficiencies, and provide treatment recommendations.\n\nTip: For best results, upload clear, well-lit photos of affected leaves, stems, or fruit.",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string, images?: UploadedImage[]) => {
      if (!content.trim() && (!images || images.length === 0)) return;

      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        images,
        timestamp: new Date(),
      };

      const loadingId = uuidv4();
      const loadingMessage: Message = {
        id: loadingId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isLoading: true,
      };

      setMessages((prev) => [...prev, userMessage, loadingMessage]);
      setIsLoading(true);

      const imageFiles = images?.map((img) => img.file) ?? [];
      const response = await sendChatMessage(content, imageFiles, sessionIdRef.current);

      // Update session ID if backend returns one
      if (response.success && response.data?.sessionId) {
        sessionIdRef.current = response.data.sessionId;
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingId
            ? {
                ...msg,
                isLoading: false,
                content: response.success
                  ? response.data?.reply ?? 'No response received.'
                  : `⚠️ ${response.error}`,
              }
            : msg
        )
      );
      setIsLoading(false);
    },
    [messages]
  );

  const clearChat = useCallback(() => {
    sessionIdRef.current = uuidv4(); // new session
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content:
          "Hello! I'm AgriAssist, your AI-powered crop health advisor. Upload images of your crops and describe any issues you're seeing — I'll diagnose diseases, pests, nutrient deficiencies, and provide treatment recommendations.",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return { messages, isLoading, sendMessage, clearChat, sessionId: sessionIdRef.current };
}