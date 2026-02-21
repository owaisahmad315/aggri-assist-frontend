import React, { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
 import type { UploadedImage } from './types';
import { useChat } from './services/hooks/useChat';

function App() {
  const { messages, isLoading, sendMessage, clearChat } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSend = (content: string, images?: UploadedImage[]) => {
    sendMessage(content, images);
  };

  return (
    <div className="app-layout">
      <Sidebar
        onNewChat={clearChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-panel">
        {/* Header */}
        <header className="app-header">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="header-brand">
            <div className="header-logo-dot" />
            <span className="header-title">AgriAssist</span>
            <span className="header-status">
              <span className="status-dot" />
              AI Online
            </span>
          </div>

          <button
            className="clear-btn"
            onClick={clearChat}
            title="Clear conversation"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        {/* Chat Area */}
        <ChatWindow messages={messages} />

        {/* Input Area */}
        <div className="input-area">
          <ChatInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default App;