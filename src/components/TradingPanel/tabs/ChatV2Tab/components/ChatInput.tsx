import React, { useState } from 'react';
import { ChatMode } from '../../../../../types/chat';
import { useChatStore } from '../../../../../store/chatStore';

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
  const [showConfirm, setShowConfirm] = useState(false);
  const { messages, setMessages } = useChatStore();

  const hasAIMessages = messages.ai?.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isButtonDisabled) {
      onSend(text);
      setText('');
    }
  };

  const handleClearAIMessages = () => {
    if (!hasAIMessages) return;
    setShowConfirm(true);
  };

  const confirmClear = () => {
    setMessages({ ...messages, ai: [] });
    setShowConfirm(false);
  };

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
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        {mode === 'ai' && (
          <button
            type="button"
            onClick={handleClearAIMessages}
            disabled={!hasAIMessages}
            className={`transition-colors duration-200 p-2 rounded ${
              hasAIMessages 
                ? 'text-gray-400 hover:text-theme cursor-pointer' 
                : 'text-gray-600 cursor-not-allowed'
            }`}
            title={hasAIMessages ? "Clear AI chat history" : "No messages to clear"}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className={`flex-1 bg-gray-700 text-white p-2 rounded outline-none focus:ring-2 focus:ring-theme/50 transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        />
        <button
          type="submit"
          disabled={isButtonDisabled}
          className={`bg-theme text-black px-4 rounded hover:bg-theme/80 transition-colors duration-200 ${
            isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Send
        </button>
      </form>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-theme p-4 rounded-lg max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-theme text-sm mb-4">Clear AI Chat History</h3>
            <p className="text-white text-sm mb-6">Are you sure you want to clear all AI chat messages? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};