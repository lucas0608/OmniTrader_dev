import React, { useState, useRef } from 'react';
import { ChatSettings } from '../../../../../types/chat';
import { useClickOutside } from '../../../../../hooks/useClickOutside';

interface AIChatSettingsProps {
  settings: ChatSettings;
  onSettingsChange: (newSettings: ChatSettings) => void;
  onClose?: () => void;
}

export const AIChatSettings: React.FC<AIChatSettingsProps> = ({
  settings,
  onClose,
  onSettingsChange
}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutside(modalRef, onClose || (() => {}));

  const handleChange = (field: keyof ChatSettings['aiChat'], value: string) => {
    onSettingsChange({
      ...settings,
      aiChat: { ...settings.aiChat, [field]: value }
    });
  };

  return (
    <div ref={modalRef} className="space-y-4">
      <div>
        <label className="block text-white text-sm mb-1">My Message Color</label>
        <input
          type="color"
          value={settings.normalChat.ownColor}
          onChange={(e) => onSettingsChange({
            ...settings,
            normalChat: { ...settings.normalChat, ownColor: e.target.value }
          })}
          className="w-full h-10 bg-gray-700 rounded"
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-1">AI's Message Color</label>
        <input
          type="color"
          value={settings.aiChat.color || '#33ff33'}
          onChange={(e) => handleChange('color', e.target.value)}
          className="w-full h-10 bg-gray-700 rounded"
        />
      </div>
      <div>
        <label className="block text-white text-sm mb-1">API Key</label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={settings.aiChat.apiKey || ''}
            onChange={(e) => handleChange('apiKey', e.target.value)}
            className="w-full bg-gray-700 text-white p-2 rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            {showApiKey ? (
              // Eye icon (visible)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              // Eye-off icon (hidden)
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-white text-sm mb-1">Pre-prompt</label>
        <textarea
          value={settings.aiChat.prePrompt || ''}
          onChange={(e) => handleChange('prePrompt', e.target.value)}
          className="w-full bg-gray-700 text-white p-2 h-32 rounded text-sm"
          placeholder="Enter instructions for the AI model. This will be used as context for all conversations. For example: 'You are a trading assistant. Provide concise, accurate responses about market analysis and trading strategies.'"
        />
      </div>
    </div>
  );
};
