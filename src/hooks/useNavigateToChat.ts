import { useCallback } from 'react';
import { useChatStore } from '../store/chatStore';
import { usePanelVisibility } from './usePanelVisibility';
import { useTradingPanel } from './useTradingPanel';

export const useNavigateToChat = () => {
  const { setMode, setSelectedUser } = useChatStore();
  const { visiblePanels, togglePanel } = usePanelVisibility();
  const { setActiveTab } = useTradingPanel();

  return useCallback((username: string) => {
    // Set chat mode and user
    setMode('normal');
    setSelectedUser(username);

    // Ensure Trading Panel is visible
    if (!visiblePanels['TRADING PANEL']) {
      togglePanel('TRADING PANEL');
    }

    // Switch to chat tab
    setActiveTab('CHAT');
  }, [setMode, setSelectedUser, togglePanel, setActiveTab, visiblePanels]);
};