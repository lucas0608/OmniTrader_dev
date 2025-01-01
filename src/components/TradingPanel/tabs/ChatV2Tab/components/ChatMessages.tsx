import React from 'react';
import { Message, ChatSettings, ChatMode } from '../../../../../types/chat';
import { useMessageDisplay } from '../hooks/useMessageDisplay';
import { useChatScroll } from '../../../../../hooks/useChatScroll';
import '../../../../../styles/scrollbar.css';

interface ChatMessagesProps {
  messages: Message[];
  settings: ChatSettings;
  mode: ChatMode;
  isAdmin?: boolean;
  isAnonymous?: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  settings,
  mode,
  isAdmin = false,
  isAnonymous = true
}) => {
  const { getMessageColor, getDisplayName } = useMessageDisplay(settings, mode, isAdmin, isAnonymous);
  const scrollRef = useChatScroll(messages);

  return (
    <div 
      ref={scrollRef}
      className="flex-1 h-full bg-[#1F2937] overflow-y-auto custom-scrollbar relative"
    >
      <div className="p-4 space-y-2 min-h-full">
        {messages.map((msg) => (
          <div 
            key={`${msg.id}-${msg.timestamp.toString()}`}
            className={`text-sm break-words ${msg.type === 'system' ? 'text-gray-400 italic' : ''}`}
            style={{ color: msg.type === 'system' ? undefined : getMessageColor(msg.sender) }}
          >
            <span className="text-xs text-gray-500 mr-1">
              {new Date(msg.timestamp).toLocaleTimeString()} - 
            </span>
            <span className="font-bold mr-1">{getDisplayName(msg.sender)}: </span>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};