import React, { useState } from 'react';
import { ChatMode } from '../../../../../types/chat';

interface ChatInputProps {
  onSend: (text: string) => void;
  mode: ChatMode;
  disabled?: boolean;
  selectedUser?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSend, 
  mode, 
  disabled,
  selectedUser 
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isButtonDisabled) {
      onSend(text);
      setText('');
    }
  };

  // Button is disabled if:
  // 1. Component is explicitly disabled OR
  // 2. In normal/group mode with no selected user OR
  // 3. In AI mode with no selected model OR
  // 4. In announcement mode and disabled
  const isButtonDisabled = disabled || 
    ((mode === 'normal' || mode === 'group') && !selectedUser) ||
    (mode === 'ai' && !selectedUser) ||
    (mode === 'announcement' && disabled);

  const getPlaceholder = () => {
    if (mode === 'announcement' && disabled) return "Only admins can send announcements";
    if (mode === 'ai' && !selectedUser) return "Select an AI model first...";
    if (mode === 'announcement') return "Send announcement to all users...";
    if (!selectedUser && mode !== 'announcement') return "Select a user to start chatting...";
    return "Type your message...";
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={getPlaceholder()}
        disabled={disabled}
        className={`flex-1 bg-gray-700 text-white p-2 rounded ${disabled ? 'opacity-50' : ''}`}
      />
      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`bg-theme text-black px-4 rounded hover:bg-theme/80 ${
          isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Send
      </button>
    </form>
  );
};