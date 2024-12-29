import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Message, ChatMode, ChatSettings, Group, ChatState } from '../types/chat';
import { createSystemMessage } from '../utils/chatUtils';
import { useUserStore } from './userStore';

const DEFAULT_SETTINGS: ChatSettings = {
  normalChat: {
    ownColor: '#ff9933',
    otherColor: '#f5ffff',
    friends: []
  },
  groupChat: {
    ownColor: '#ff9933',
    otherColor: '#f5ffff',
    groups: []
  },
  aiChat: {
    apiKey: '',
    prePrompt: '',
    selectedModel: 'gpt-4',
    color: '#33ff33'
  },
  announcementChat: {
    color: '#33ff33',
    anonymous: true
  }
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: {},
      selectedUser: '',
      mode: 'normal',
      settings: DEFAULT_SETTINGS,

      setSelectedUser: (username: string) => set({ selectedUser: username }),
      
      setMode: (mode: ChatMode) => set({ mode }),

      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings }
        })),

      addMessage: (userId, message) =>
        set((state) => ({
          messages: {
            ...state.messages,
            [userId]: [
              ...(state.messages[userId] || []),
              { ...message, id: Date.now() }
            ]
          }
        })),

      createGroup: (group) =>
        set((state) => {
          const systemMessage = createSystemMessage(`New group ${group.name} has been created. Welcome.`);
          get().addMessage(group.id, systemMessage);

          return {
            settings: {
              ...state.settings,
              groupChat: {
                ...state.settings.groupChat,
                groups: [...state.settings.groupChat.groups, group]
              }
            }
          };
        }),

      joinGroup: (groupId, username) =>
        set((state) => {
          const group = state.settings.groupChat.groups.find(g => g.id === groupId);
          if (!group) throw new Error('Group not found');
          
          if (group.members.includes(username)) {
              // Check if the user is the creator
            if (group.creatorId === username) {
               throw new Error('You are the creator of this group');
              }
            throw new Error('Already a member of this group');
          }

          const systemMessage = createSystemMessage(`${username} has joined the group.`);
          get().addMessage(groupId, systemMessage);

          return {
            settings: {
              ...state.settings,
              groupChat: {
                ...state.settings.groupChat,
                groups: state.settings.groupChat.groups.map(g =>
                  g.id === groupId
                    ? { ...g, members: [...g.members, username] }
                    : g
                )
              }
            }
          };
        }),

      leaveGroup: (groupId) =>
        set((state) => {
          const group = state.settings.groupChat.groups.find(g => g.id === groupId);
          if (!group) return state;

          const currentUser = useUserStore.getState().currentUser;
          if (!currentUser) return state;

          const username = currentUser.username;
          
          if (group.creatorId === username && group.members.length === 1) {
            return {
              settings: {
                ...state.settings,
                groupChat: {
                  ...state.settings.groupChat,
                  groups: state.settings.groupChat.groups.filter(g => g.id !== groupId)
                }
              }
            };
          }

          const systemMessage = createSystemMessage(`${username} has left the group.`);
          get().addMessage(groupId, systemMessage);

          return {
            settings: {
              ...state.settings,
              groupChat: {
                ...state.settings.groupChat,
                groups: state.settings.groupChat.groups.map(g =>
                  g.id === groupId
                    ? { ...g, members: g.members.filter(m => m !== username) }
                    : g
                )
              }
            }
          };
        }),

      removeGroupMember: (groupId, username) =>
        set((state) => {
          const group = state.settings.groupChat.groups.find(g => g.id === groupId);
          if (!group) return state;

          const currentUser = useUserStore.getState().currentUser;
          if (!currentUser || group.creatorId !== currentUser.username) {
            return state;
          }

          const systemMessage = createSystemMessage(`${username} has been removed from the group.`);
          get().addMessage(groupId, systemMessage);

          return {
            settings: {
              ...state.settings,
              groupChat: {
                ...state.settings.groupChat,
                groups: state.settings.groupChat.groups.map(g =>
                  g.id === groupId
                    ? { ...g, members: g.members.filter(m => m !== username) }
                    : g
                )
              }
            }
          };
        }),

      addGroupMember: (groupId, username) =>
        set((state) => ({
          settings: {
            ...state.settings,
            groupChat: {
              ...state.settings.groupChat,
              groups: state.settings.groupChat.groups.map(g =>
                g.id === groupId
                  ? { ...g, members: [...g.members, username] }
                  : g
              )
            }
          }
        }))
    }),
    {
      name: 'chat-storage',
      version: 1
    }
  )
);