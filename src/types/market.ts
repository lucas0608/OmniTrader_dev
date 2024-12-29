export interface MarketData {
  symbol: string;
  price: number;
  high: number;
  low: number;
  open: number;
  timestamp: number;
}

export interface AccountInfo {
  username: string;
  host: string;
  port: number;
  algoEnabled: boolean;
}

export interface AlgoStatus {
  name: string;
  class: 'LIVE' | 'Demo';
  status: string;
  pnl?: number;
}

export interface MarketDataType {
  symbol: string;
  price: number;
  priceChange24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  volumeChange24h: number;
  marketCap: number;
  marketCapRank: number;
  circulatingSupply: number;
  maxSupply: number | null;
  lastUpdate: string;
}