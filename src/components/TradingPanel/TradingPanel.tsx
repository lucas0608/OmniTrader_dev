import React from 'react';
import { Panel } from '../common/Panel';
import { TradingTabs } from './TradingTabs';
import { ChartTab } from './tabs/ChartTab';
import { OrderV2Tab } from './tabs/OrderV2Tab';
import { RecordV2Tab } from './tabs/RecordV2Tab';
import { BalanceV2Tab } from './tabs/BalanceV2Tab';
import { ChatV2Tab } from './tabs/ChatV2Tab';
import { useTradingPanel } from '../../hooks/useTradingPanel';

export const TradingPanel = () => {
  const { activeTab, setActiveTab } = useTradingPanel();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'CHART':
        return <ChartTab />;
      case 'ORDER':
        return <OrderV2Tab />;
      case 'RECORDV2':
        return <RecordV2Tab />;
      case 'BALANCEV2':
        return <BalanceV2Tab />;
      case 'CHAT':
        return <ChatV2Tab />;
    }
  };

  return (
    <Panel title="TRADING PANEL">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-md mb-4">
          <TradingTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="w-full">{renderTabContent()}</div>
      </div>
    </Panel>
  );
};