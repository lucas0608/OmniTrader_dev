import React, { useState } from 'react';
import { ChatMode } from '../../../../types/chat';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { ChatSettings } from './components/ChatSettings';
import { UserSelector } from './components/UserSelector';
import { ChatModeSelector } from './components/ChatModeSelector';
import { useChatStore } from '../../../../store/chatStore';
import { useUserStore } from '../../../../store/userStore';
import { OpenAIService } from '../../../../services/openAiService';

export const ChatV2Tab: React.FC = () => {
  const { messages, settings, mode, selectedUser, addMessage, setMode, setSelectedUser, updateSettings } = useChatStore();
  const { currentUser } = useUserStore();
  const [showSettings, setShowSettings] = useState(false);
  const isAdmin = currentUser?.class === 'Admin';

  // Hide settings button if user is not admin and in announcement mode
  const showSettingsButton = !(mode === 'announcement' && !isAdmin);

  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);
    setSelectedUser(''); // Reset selected user when mode changes
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const messageId = mode === 'announcement' ? 'announcements' : 
                     mode === 'ai' ? 'ai' : selectedUser;

    const sender = mode === 'announcement' && settings.announcementChat.anonymous ? 
                  'Announcement' : currentUser?.username || 'You';

    addMessage(messageId, {
      text,
      sender,
      timestamp: new Date()
    });

    if (mode === 'ai') {
      try {
        if (!settings.aiChat.apiKey) {
          addMessage(messageId, {
            text: 'API key is missing.',
            sender: selectedUser,
            timestamp: new Date()
          });
          return;
        }

        const openai = new OpenAIService(
          settings.aiChat.apiKey,
          settings.aiChat.selectedModel
        );

        const response = await openai.sendMessage(text, settings.aiChat.prePrompt);

        addMessage(messageId, {
          text: response,
          sender: selectedUser,
          timestamp: new Date()
        });
      } catch (error) {
        addMessage(messageId, {
          text: error instanceof Error ? error.message : 'An error occurred',
          sender: selectedUser,
          timestamp: new Date()
        });
      }
    }
  };

  const handleUserSelect = (username: string) => {
    if (username !== currentUser?.username) {
      setSelectedUser(username);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-4">
        <UserSelector
          mode={mode}
          selectedUser={selectedUser}
          onSelectUser={handleUserSelect}
        />
        
        <div className="flex items-center gap-2">
          <ChatModeSelector mode={mode} onModeChange={handleModeChange} />
          
          {showSettingsButton && (
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-700 rounded"
              title="Chat Settings"
            >
              <svg className="w-5 h-5 text-theme" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="h-64 bg-gray-800 rounded-lg overflow-y-auto">
        <ChatMessages
          messages={messages[mode === 'announcement' ? 'announcements' : mode === 'ai' ? 'ai' : selectedUser] || []}
          settings={settings}
          mode={mode}
          isAdmin={isAdmin}
          isAnonymous={settings.announcementChat.anonymous}
        />
      </div>
      
      <ChatInput 
        onSend={handleSend}
        mode={mode}
        selectedUser={selectedUser}
        disabled={mode === 'announcement' && !isAdmin}
      />

      {showSettings && (
        <ChatSettings
          mode={mode}
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={updateSettings}
        />
      )}
    </div>
  );
};