import React from 'react';
import { ChatSettings } from '../../../../../types/chat';

interface GroupChatSettingsProps {
  settings: ChatSettings;
  onSettingsChange: (newSettings: ChatSettings) => void;
}

export const GroupChatSettings: React.FC<GroupChatSettingsProps> = ({
  settings,
  onSettingsChange
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-white text-sm mb-1">My Message Color</label>
      <input
        type="color"
        value={settings.groupChat.ownColor}
        onChange={(e) => onSettingsChange({
          ...settings,
          groupChat: { ...settings.groupChat, ownColor: e.target.value }
        })}
        className="w-full h-10 bg-gray-700 rounded"
      />
    </div>
    <div>
      <label className="block text-white text-sm mb-1">Other's Message Color</label>
      <input
        type="color"
        value={settings.groupChat.otherColor}
        onChange={(e) => onSettingsChange({
          ...settings,
          groupChat: { ...settings.groupChat, otherColor: e.target.value }
        })}
        className="w-full h-10 bg-gray-700 rounded"
      />
    </div>
  </div>
);