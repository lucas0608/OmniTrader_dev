import { useEffect, useRef } from 'react';
import { Message } from '../types/chat';

export const useChatScroll = (messages: Message[]) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return scrollRef;
};