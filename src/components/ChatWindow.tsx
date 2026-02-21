import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatWindowProps {
  messages: Message[];
}

const EmptyState: React.FC = () => (
  <div className="empty-state">
    <div className="empty-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round"/>
        <polyline points="9 22 9 12 15 12 15 22" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    </div>
    <h2 className="empty-title">Ready to Diagnose Your Crops</h2>
    <p className="empty-subtitle">
      Upload images of affected crops and describe what you're seeing. I'll analyze and provide expert guidance.
    </p>
    <div className="quick-prompts">
      <span className="prompt-chip">🍃 Yellow spots on leaves</span>
      <span className="prompt-chip">🌱 Stunted growth analysis</span>
      <span className="prompt-chip">🍅 Fruit discoloration</span>
      <span className="prompt-chip">🌿 Wilting symptoms</span>
    </div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const hasUserMessages = messages.some((m) => m.role === 'user');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-window">
      {!hasUserMessages ? (
        <EmptyState />
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
};

export default ChatWindow;