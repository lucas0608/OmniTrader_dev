import { ChatSettings, ChatMode } from '../types/chat';
import { useUserStore } from '../store/userStore';

export const useMessageDisplay = (
  settings: ChatSettings,
  mode: ChatMode,
  isAdmin: boolean,
  isAnonymous: boolean
) => {
  const { currentUser } = useUserStore();

  const getMessageColor = (sender: string) => {
    const isOwnMessage = sender === currentUser?.username || sender === 'You';

    switch (mode) {
      case 'normal':
        return isOwnMessage ? settings.normalChat.ownColor : settings.normalChat.otherColor;
      case 'group':
        return isOwnMessage ? settings.groupChat.ownColor : settings.groupChat.otherColor;
      case 'ai':
        return isOwnMessage ? settings.normalChat.ownColor : settings.aiChat.color;
      case 'announcement':
        return settings.announcementChat.color;
      default:
        return '#ffffff';
    }
  };

  const getDisplayName = (sender: string) => {
    if (mode === 'announcement' && !isAdmin && isAnonymous) {
      return 'Announcement';
    }

    // Use nickname in group chat if set
    if (mode === 'group' && settings.groupChat.nickname && sender === currentUser?.username) {
      return settings.groupChat.nickname;
    }

    return sender === currentUser?.username ? 'You' : sender;
  };

  return { getMessageColor, getDisplayName };
};