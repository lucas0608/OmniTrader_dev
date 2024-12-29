import { ChatSettings, ChatMode } from '../types/chat';

const DEFAULT_COLORS = {
  own: '#FF9933',
  other: '#F5FFFF',
  ai: '#33FF33',
  announcement: '#33FF33'
} as const;

export const useChatColors = () => {
  const resetColors = (mode: ChatMode): Partial<ChatSettings> => {
    switch (mode) {
      case 'normal':
        return {
          normalChat: {
            ownColor: DEFAULT_COLORS.own,
            otherColor: DEFAULT_COLORS.other
          }
        };
        
      case 'group':
        return {
          groupChat: {
            ownColor: DEFAULT_COLORS.own,
            otherColor: DEFAULT_COLORS.other
          }
        };
        
       case 'ai':
        return {
          normalChat: {
            ownColor: DEFAULT_COLORS.own,  // Add this line to reset user's message color
            otherColor: DEFAULT_COLORS.other
          },
          aiChat: {
            color: DEFAULT_COLORS.ai
          }
        };
        
      case 'announcement':
        return {
          announcementChat: {
            color: DEFAULT_COLORS.announcement
          }
        };
        
      default:
        return {};
    }
  };

  return {
    defaultColors: DEFAULT_COLORS,
    resetColors
  };
};