import axios from 'axios';
import { AccountBalance, Position } from '../types/balance';
import { handleApiError } from '../utils/errorHandlers';

// Mock data for development
const MOCK_DATA: AccountBalance = {
  totalBalance: 128450.00,
  availableBalance: 98450.00,
  positions: [
    { asset: 'BTC', free: 2.5, locked: 0.5, total: 3.0 },
    { asset: 'ETH', free: 15.0, locked: 5.0, total: 20.0 },
    { asset: 'USDT', free: 50000.0, locked: 10000.0, total: 60000.0 }
  ]
};

export const BinanceBalanceService = {
  async getAccountBalance(): Promise<AccountBalance> {
    // In development, return mock data
    if (process.env.NODE_ENV === 'development') {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return MOCK_DATA;
    }

    // In production, use real API
    try {
      const { data } = await axios.get('/api/account');
      const balances = data.balances.filter(
        (balance: any) => parseFloat(balance.free) > 0 || parseFloat(balance.locked) > 0
      );

      const positions = balances.map((balance: any): Position => ({
        asset: balance.asset,
        free: parseFloat(balance.free),
        locked: parseFloat(balance.locked),
        total: parseFloat(balance.free) + parseFloat(balance.locked)
      }));

      const totalBalance = positions.reduce((sum, pos) => sum + pos.total, 0);
      const availableBalance = totalBalance * 0.8; // 80% of total balance

      return {
        totalBalance,
        availableBalance,
        positions
      };
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch account balance');
    }
  }
};