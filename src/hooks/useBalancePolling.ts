import { useEffect } from 'react';
import { useBalanceStore } from '../store/balanceStore';

export const useBalancePolling = (interval = 10000) => {
  const fetchBalance = useBalanceStore(state => state.fetchBalance);

  useEffect(() => {
    fetchBalance();
    const timer = setInterval(fetchBalance, interval);
    return () => clearInterval(timer);
  }, [fetchBalance, interval]);
};