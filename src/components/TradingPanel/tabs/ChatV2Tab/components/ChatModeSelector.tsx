import React from 'react';
import { ChatMode } from '../../../../../types/chat';

interface ChatModeSelectorProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export const ChatModeSelector: React.FC<ChatModeSelectorProps> = ({
  mode,
  onModeChange
}) => {
  // Show announcement mode for all users
  const modes = [
    { value: 'normal', label: 'Normal Chat' },
    { value: 'group', label: 'Group Chat' },
    { value: 'ai', label: 'AI Model' },
    { value: 'announcement', label: 'Announcement' }
  ] as { value: ChatMode; label: string }[];

  return (
    <select
      value={mode}
      onChange={(e) => onModeChange(e.target.value as ChatMode)}
      className="bg-gray-700 text-white h-8 text-sm rounded px-2"
    >
      {modes.map(m => (
        <option key={m.value} value={m.value}>{m.label}</option>
      ))}
    </select>
  );
};