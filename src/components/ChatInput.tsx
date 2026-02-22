import React, { useState, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { UploadedImage } from '../types';
import { useVoiceRecorder } from '../services/hooks/useVoiceRecorder';
import { transcribeAudio } from '../services/api';
import ImageUploader from './ImageUploader';
import VoiceButton from './VoiceButton';

interface ChatInputProps {
  onSend: (content: string, images?: UploadedImage[]) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { recordingState, startRecording, stopRecording, error: voiceError } = useVoiceRecorder();

  const handleSend = useCallback(() => {
    if (disabled || (!text.trim() && images.length === 0)) return;
    onSend(text.trim(), images.length > 0 ? images : undefined);
    setText('');
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [text, images, onSend, disabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = async () => {
    if (recordingState === 'recording') {
      const blob = await stopRecording();
      if (blob) {
        const result = await transcribeAudio(blob);
        if (result.success && result.data?.text) {
          setText((prev) => prev + (prev ? ' ' : '') + result.data!.text);
          textareaRef.current?.focus();
        }
      }
    } else {
      await startRecording();
    }
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((f) => f.type.startsWith('image/'));
    const remaining = 5 - images.length;
    const toProcess = fileArray.slice(0, remaining);
    const newImages: UploadedImage[] = toProcess.map((file) => ({
      id: uuidv4(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setImages((prev) => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [images]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const canSend = !disabled && (text.trim().length > 0 || images.length > 0);

  return (
    <div
      className={`chat-input-container ${isDragging ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="drop-overlay">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
            <path d="M21 15l-5-5L5 21" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
          <span>Drop images here</span>
        </div>
      )}

      <ImageUploader images={images} onImagesChange={setImages} />

      {voiceError && <div className="voice-error">{voiceError}</div>}

      <div className="input-row">
        <button
          type="button"
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || images.length >= 5}
          title="Attach crop images"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && processFiles(e.target.files)}
          />
        </button>

        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Describe your crop issue or ask a question..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          style={{ resize: 'none' }}
        />

        <VoiceButton
          recordingState={recordingState}
          onStart={handleVoiceToggle}
          onStop={handleVoiceToggle}
          disabled={disabled}
        />

        <button
          type="button"
          className={`send-btn ${canSend ? 'active' : ''}`}
          onClick={handleSend}
          disabled={!canSend}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <line x1="22" y1="2" x2="11" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2" stroke="currentColor" strokeWidth="2" fill="currentColor" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <p className="input-hint">
        Press <kbd>Enter</kbd> to send · <kbd>Shift+Enter</kbd> for new line · Drag & drop images
      </p>
    </div>
  );
};

export default ChatInput;