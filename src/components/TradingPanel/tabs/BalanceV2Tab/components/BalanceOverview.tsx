import React, { useState } from 'react';
import { AccountBalance } from '../../../../../types/balance';
import { useUserStore } from '../../../../../store/userStore';
import { BalanceDetailsWindow } from '../../../../common/BalanceDetailsWindow';

interface BalanceOverviewProps {
  balance: AccountBalance;
}

export const BalanceOverview: React.FC<BalanceOverviewProps> = ({ balance }) => {
  const [showTotalBalance, setShowTotalBalance] = useState(false);
  const [showAvailableBalance, setShowAvailableBalance] = useState(false);
  const { settings } = useUserStore();
  
  const positionPercentage = (balance.totalBalance - balance.availableBalance) / balance.totalBalance * 100;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div 
          className="bg-gray-800 p-4 rounded flex justify-between items-center cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => setShowTotalBalance(true)}
        >
          <div>
            <div className="text-theme text-sm mb-1">Total Balance</div>
            <div className="text-white text-lg">
              {settings.maskSettings.totalBalanceMask ? "******.**" : `$${balance.totalBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
            </div>
          </div>
          <div className="w-20 h-20 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#444"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="var(--primary-color)"
                strokeWidth="3"
                strokeDasharray={`${positionPercentage}, 100`}
              />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="fill-white text-xs"
              >
                {positionPercentage.toFixed(0)}%
              </text>
            </svg>
          </div>
        </div>
        <div 
          className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => setShowAvailableBalance(true)}
        >
          <div className="text-theme text-sm mb-1">Available Balance</div>
          <div className="text-white text-lg">
            {settings.maskSettings.availableBalanceMask ? "******.**" : `$${balance.availableBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          </div>
          <div className="text-gray-400 text-xs mt-1">
            In Position: {settings.maskSettings.availableBalanceMask ? "******.**" : `$${(balance.totalBalance - balance.availableBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          </div>
        </div>
      </div>

      {showTotalBalance && (
        <BalanceDetailsWindow
          amount={balance.totalBalance}
          title="Total Balance"
          onClose={() => setShowTotalBalance(false)}
          maskType="totalBalanceMask"
        />
      )}

      {showAvailableBalance && (
        <BalanceDetailsWindow
          amount={balance.availableBalance}
          title="Available Balance"
          onClose={() => setShowAvailableBalance(false)}
          maskType="availableBalanceMask"
        />
      )}
    </>
  );
};