import React from 'react';
import { ChatMode } from '../../../../../types/chat';

interface ChatHeaderProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onSettingsClick: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  mode,
  onModeChange,
  onSettingsClick
}) => (
  <div className="flex justify-between items-center">
    <select
      value={mode}
      onChange={(e) => onModeChange(e.target.value as ChatMode)}
      className="bg-gray-700 text-white p-2 text-sm rounded"
    >
      <option value="normal">Normal Chat</option>
      <option value="group">Group Chat</option>
      <option value="ai">AI Model</option>
    </select>
    
    <button
      onClick={onSettingsClick}
      className="p-2 hover:bg-gray-700 rounded"
      title="Chat Settings"
    >
      <svg className="w-5 h-5 text-[#ff9933]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>
  </div>
);