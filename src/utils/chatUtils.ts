import { Message } from '../types/chat';

export const createSystemMessage = (text: string): Omit<Message, 'id'> => ({
  text,
  sender: 'System',
  timestamp: new Date(),
  type: 'system'
});