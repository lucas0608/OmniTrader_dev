import React, { useState, useRef } from 'react';
import { ChatMode, ChatSettings as ChatSettingsType } from '../../../../../types/chat';
import { GroupChatSettings } from './GroupChatSettings';
import { AIChatSettings } from './AIChatSettings';
import { useChatColors } from '../../../../../hooks/useChatColors';
import { useUserStore } from '../../../../../store/userStore';
import { useClickOutside } from '../../../../../hooks/useClickOutside';

interface ChatSettingsProps {
  mode: ChatMode;
  settings: ChatSettingsType;
  onClose: () => void;
  onSave: (settings: ChatSettingsType) => void;
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({
  mode,
  settings,
  onClose,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const { resetColors } = useChatColors();
  const { currentUser } = useUserStore();
  const isAdmin = currentUser?.class === 'Admin';
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose);

  const handleReset = () => {
  const resetSettings = resetColors(mode);
  setLocalSettings(prev => ({
    ...prev,
    ...resetSettings,
    aiChat: {
      ...prev.aiChat,
      color: resetSettings.aiChat?.color || prev.aiChat.color
    }
  }));
};

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const renderContent = () => {
    switch (mode) {
      case 'normal':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-theme">Normal Chat Settings</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
            </div>
            <div>
              <label className="block text-white text-sm mb-1">My Message Color</label>
              <input
                type="color"
                value={localSettings.normalChat.ownColor}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  normalChat: { ...prev.normalChat, ownColor: e.target.value }
                }))}
                className="w-full h-10 bg-gray-700 rounded"
              />
            </div>
            <div>
              <label className="block text-white text-sm mb-1">Other's Message Color</label>
              <input
                type="color"
                value={localSettings.normalChat.otherColor}
                onChange={(e) => setLocalSettings(prev => ({
                  ...prev,
                  normalChat: { ...prev.normalChat, otherColor: e.target.value }
                }))}
                className="w-full h-10 bg-gray-700 rounded"
              />
            </div>
          </>
        );

      case 'group':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-theme">Group Chat Settings</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
            </div>
            <GroupChatSettings 
              settings={localSettings} 
              onSettingsChange={setLocalSettings} 
            />
          </>
        );

      case 'ai':
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-theme">AI Chat Settings</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
            </div>
            <AIChatSettings 
              settings={localSettings} 
              onSettingsChange={setLocalSettings} 
            />
          </>
        );

      case 'announcement':
        if (!isAdmin) return null;
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-theme">Announcement Settings</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
            </div>
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
            <div className="flex items-center gap-2 mt-4">
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
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-[#1a1a1a] border border-theme p-4 w-full max-w-md rounded">
        <div className="space-y-4">
          {renderContent()}
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