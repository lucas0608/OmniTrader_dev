export type ChatMode = 'normal' | 'group' | 'ai' | 'announcement';

export interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  type?: 'system' | 'user';
}

export interface Friend {
  username: string;
  addedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  creatorId: string;
  members: string[];
  createdAt: Date;
}

export interface ChatSettings {
  normalChat: {
    ownColor: string;
    otherColor: string;
    friends: Friend[];
  };
  groupChat: {
    ownColor: string;
    otherColor: string;
    groups: Group[];
  };
  aiChat: {
    apiKey: string;
    prePrompt: string;
    selectedModel: 'gpt-4o-mini' | 'gpt-4o';
    color: string;
  };
  announcementChat: {
    color: string;
    anonymous: boolean;
  };
}

export interface ChatState {
  messages: Record<string, Message[]>;
  settings: ChatSettings;
  selectedUser: string;
  mode: ChatMode;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
  addMessage: (userId: string, message: Omit<Message, 'id'>) => void;
  setSelectedUser: (username: string) => void;
  setMode: (mode: ChatMode) => void;
  createGroup: (group: Group) => void;
  joinGroup: (groupId: string, username: string) => void;
  leaveGroup: (groupId: string) => void;
  addGroupMember: (groupId: string, username: string) => void;
  removeGroupMember: (groupId: string, username: string) => void;
}