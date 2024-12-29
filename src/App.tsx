import React, { useEffect } from 'react';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { TradingPanel } from './components/TradingPanel/TradingPanel';
import { AccountManager } from './components/AccountManager/AccountManager';
import { AlgoManager } from './components/AlgoManager/AlgoManager';
import { CompactTradingPanel } from './components/CompactTradingPanel/CompactTradingPanel';
import { usePanelVisibility } from './hooks/usePanelVisibility';
import { useUserStore } from './store/userStore';
import { useAccountManagerStore } from './store/accountManagerStore';
import { useAlgoManagerStore } from './store/algoManagerStore';
import { useLogoManagement } from './hooks/useLogoManagement';
import { useThemeInitialization } from './hooks/useThemeInitialization';

const App = () => {
  const { visiblePanels, panelOrder } = usePanelVisibility();
  const { loadUsers } = useUserStore();
  const { loadAccounts } = useAccountManagerStore();
  const { loadAlgos } = useAlgoManagerStore();
  useLogoManagement();
  useThemeInitialization(); // Add theme initialization

  useEffect(() => {
    loadUsers();
    loadAccounts();
    loadAlgos();
  }, [loadUsers, loadAccounts, loadAlgos]);

  const renderPanel = (panelName: string, index: number) => {
    if (!visiblePanels[panelName]) return null;

    switch (panelName) {
      case 'ADMIN PANEL':
        return <AdminPanel key={`panel-${index}`} />;
      case 'TRADING PANEL':
        return <TradingPanel key={`panel-${index}`} />;
      case 'ACCOUNT MANAGER':
        return <AccountManager key={`panel-${index}`} />;
      case 'ALGO MANAGER':
        return <AlgoManager key={`panel-${index}`} />;
      case 'COMPACT TRADING PANEL':
        return <CompactTradingPanel key={`panel-${index}`} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black p-1 md:p-2 overflow-y-auto">
      <div className="w-full max-w-md mx-auto">
        <header className="flex items-center gap-2 mb-1">
          <img 
            src="/logo.svg" 
            alt="OMNI TRADER" 
            className="h-5 md:h-8"
          />
          <h1 className="font-bold text-theme">
            <span className="text-lg md:text-2xl">OMNI TRADER</span>
            <span className="text-xs md:text-sm"> v3.2</span>
          </h1>
        </header>
        {panelOrder.map((panel, index) => renderPanel(panel, index))}
      </div>
    </div>
  );
};

export default App;