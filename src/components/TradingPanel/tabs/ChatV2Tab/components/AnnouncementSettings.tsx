import React, { useState } from 'react';
import { ChatSettings as ChatSettingsType } from '../../../../../types/chat';
import { useUserStore } from '../../../../../store/userStore';
import { useChatColors } from '../../../../../hooks/useChatColors';

interface AnnouncementSettingsProps {
  settings: ChatSettingsType;
  onClose: () => void;
  onSave: (settings: ChatSettingsType) => void;
}

export const AnnouncementSettings: React.FC<AnnouncementSettingsProps> = ({
  settings,
  onClose,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const { currentUser } = useUserStore();
  const { resetColors } = useChatColors();
  const isAdmin = currentUser?.class === 'Admin';

  const handleReset = () => {
    const newSettings = resetColors('announcement');
    setLocalSettings(newSettings);
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  if (!isAdmin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] border border-theme p-4 w-full max-w-md rounded">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-theme">Announcement Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-1">Announcement Color</label>
            <input
              type="color"
              value={localSettings.announcementChat.color}
              onChange={(e) => setLocalSettings(prev => ({
                ...prev,
                announcementChat: { ...prev.announcementChat, color: e.target.value }
              }))}
              className="w-full h-10 bg-gray-700 rounded"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="custom-checkbox">
              <input
                type="checkbox"
                checked={localSettings.announcementChat.anonymous}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  announcementChat: { 
                    ...prev.announcementChat, 
                    anonymous: e.target.checked 
                  }
                }))}
              />
              <span className="checkmark">
                <span></span>
              </span>
            </label>
            <span className="text-white text-sm">Anonymous Announcement</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={handleReset}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Reset Colors
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-theme text-black px-4 py-2 rounded hover:bg-theme/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};