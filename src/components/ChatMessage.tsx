import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const TypingDots: React.FC = () => (
  <div className="typing-dots">
    <span /><span /><span />
  </div>
);

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`message-row ${isAssistant ? 'assistant' : 'user'}`}>
      {isAssistant && (
        <div className="message-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>
      )}

      <div className="message-bubble">
        {message.images && message.images.length > 0 && (
          <div className="message-images">
            {message.images.map((img) => (
              <img key={img.id} src={img.preview} alt={img.name} className="message-image" />
            ))}
          </div>
        )}
        {message.isLoading ? (
          <TypingDots />
        ) : (
          <div className="message-text">
            {message.content.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < message.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        )}
        <span className="message-time">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;