import React, { useEffect } from 'react';
import { useBalanceStore } from '../../../../store/balanceStore';
import { useBalancePolling } from '../../../../hooks/useBalancePolling';
import { BalanceOverview } from './components/BalanceOverview';
import { PositionsList } from './components/PositionsList';
import { LoadingSpinner } from '../../../common/LoadingSpinner';
import '../../../../styles/scrollbar.css';

export const BalanceV2Tab = () => {
  const { balance, isLoading, error, fetchBalance } = useBalanceStore();
  useBalancePolling();

  if (isLoading && !balance) {
    return (
      <div className="h-[140px] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[140px] flex justify-center items-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  return (
    <div className="space-y-4">
      <BalanceOverview balance={balance} />
      <div className="h-[140px] overflow-y-auto custom-scrollbar">
        <PositionsList positions={balance.positions} />
      </div>
    </div>
  );
};