import React from 'react';

interface SidebarProps {
  onNewChat: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
        <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
        <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Image Analysis',
    desc: 'Upload up to 5 crop photos',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    label: 'Voice Input',
    desc: 'Speak your query, we transcribe',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    label: 'AI Diagnosis',
    desc: 'Identify diseases & deficiencies',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
    label: 'Treatment Plans',
    desc: 'Actionable remedies & prevention',
  },
];

const tips = [
  'Photograph leaves showing symptoms',
  'Include both close-up and wide shots',
  'Mention soil type and recent weather',
  'Note when symptoms first appeared',
];

const Sidebar: React.FC<SidebarProps> = ({ onNewChat, isOpen, onClose }) => {
  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="var(--accent)"/>
                <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 8v1M12 15v1M8 12H7M17 12h-1" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="logo-text">
              <span className="logo-name">AgriAssist</span>
              <span className="logo-tag">Crop Health AI</span>
            </div>
          </div>
        </div>

        <button className="new-chat-btn" onClick={onNewChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          New Consultation
        </button>

        <div className="sidebar-section">
          <h3 className="section-title">Capabilities</h3>
          <ul className="features-list">
            {features.map((f) => (
              <li key={f.label} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <div className="feature-label">{f.label}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="section-title">📸 Photo Tips</h3>
          <ul className="tips-list">
            {tips.map((tip) => (
              <li key={tip} className="tip-item">
                <span className="tip-dot" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-footer">
          <div className="version-badge">AI Model v2.1</div>
          <p className="disclaimer">
            AgriAssist provides guidance based on visual analysis. Always consult a local agronomist for critical decisions.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;