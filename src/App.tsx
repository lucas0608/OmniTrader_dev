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
import { useViewSwitching } from './hooks/useViewSwitching';
import { LogoMenu } from './components/LogoMenu/LogoMenu';

const App = () => {
  const { visiblePanels, panelOrder } = usePanelVisibility();
  const { loadUsers } = useUserStore();
  const { loadAccounts } = useAccountManagerStore();
  const { loadAlgos } = useAlgoManagerStore();
  useLogoManagement();
  useThemeInitialization();
  useViewSwitching();

  useEffect(() => {
    loadUsers();
    loadAccounts();
    loadAlgos();
  }, [loadUsers, loadAccounts, loadAlgos]);

  const renderPanel = (panelName: string, index: number) => {
    if (!visiblePanels[panelName]) return null;

    // Extract base panel name and set ID
    const [baseName, setId] = panelName.split('_SET');

    const panel = (() => {
      switch (baseName) {
        case 'ADMIN PANEL':
          return <AdminPanel />;
        case 'TRADING PANEL':
          return <TradingPanel />;
        case 'ACCOUNT MANAGER':
          return <AccountManager />;
        case 'ALGO MANAGER':
          return <AlgoManager />;
        case 'COMPACT TRADING PANEL':
          return <CompactTradingPanel />;
        default:
          return null;
      }
    })();

    return (
      <React.Fragment key={panelName}>
        {panel}
      </React.Fragment>
    );
  };

  return (
    <div className="min-h-screen bg-black p-1 md:p-2 overflow-y-auto">
      <div className="w-full flex flex-col items-center md:items-start md:pl-2">
        <div className="w-full max-w-md">
          <header className="flex items-center gap-2 mb-1">
            <LogoMenu />
            <h1 className="font-bold text-theme">
              <span className="text-lg md:text-2xl">OMNI TRADER</span>
              <span className="text-xs md:text-sm"> v3.2</span>
            </h1>
          </header>
          {panelOrder.map((panel, index) => renderPanel(panel, index))}
        </div>
      </div>
    </div>
  );
};

export default App;