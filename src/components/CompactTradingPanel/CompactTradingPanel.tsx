import React from 'react';
import { Panel } from '../common/Panel';
import { PriceDisplay } from './components/PriceDisplay';
import { TradingControls } from './components/TradingControls';

export const CompactTradingPanel = () => {
  return (
    <Panel title="COMPACT TRADING PANEL">
      <div className="space-y-2 max-w-full">
        <div className="grid grid-cols-2 gap-2">
          <PriceDisplay />
        </div>
        <TradingControls />
      </div>
    </Panel>
  );
};