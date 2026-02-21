import React from 'react';
import type { RecordingState } from '../services/hooks/useVoiceRecorder'

interface VoiceButtonProps {
  recordingState: RecordingState;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  recordingState,
  onStart,
  onStop,
  disabled,
}) => {
  const isRecording = recordingState === 'recording';
  const isProcessing = recordingState === 'processing';

  const handleClick = () => {
    if (isRecording) onStop();
    else if (!isProcessing) onStart();
  };

  return (
    <button
      type="button"
      className={`voice-btn ${isRecording ? 'recording' : ''} ${isProcessing ? 'processing' : ''}`}
      onClick={handleClick}
      disabled={disabled || isProcessing}
      aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
      title={isRecording ? 'Click to stop recording' : 'Click to record voice'}
    >
      {isProcessing ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="spin">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10"/>
        </svg>
      ) : isRecording ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="6" width="12" height="12" rx="2"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="currentColor" strokeWidth="2"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="19" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="8" y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )}
      {isRecording && <span className="recording-pulse" />}
    </button>
  );
};

export default VoiceButton;