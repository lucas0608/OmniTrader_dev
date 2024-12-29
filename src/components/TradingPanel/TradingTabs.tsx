import React from 'react';
import { TabType } from '../../types/trading';

interface TradingTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TradingTabs: React.FC<TradingTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabType[] = ['CHART', 'ORDER', 'RECORDV2', 'BALANCEV2', 'CHAT'];

  return (
    <div className="flex w-full">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            flex-1
            px-2 md:px-4 
            py-1 
            text-[10px] md:text-xs 
            font-mono 
            relative 
            whitespace-nowrap
            ${activeTab === tab
              ? 'bg-theme text-black'
              : 'bg-[#1a1a1a] text-theme hover:bg-[#262626]'
            }
          `}
          style={{
            borderTop: `1px solid var(--primary-color)`,
            borderRight: `1px solid var(--primary-color)`,
            borderBottom: activeTab === tab ? 'none' : `1px solid var(--primary-color)`,
            borderLeft: `1px solid var(--primary-color)`,
            marginLeft: '-1px',
            zIndex: activeTab === tab ? 1 : 0
          }}
        >
          {tab === 'RECORDV2' ? 'RECORD' : 
           tab === 'BALANCEV2' ? 'BALANCE' : tab}
        </button>
      ))}
    </div>
  );
};