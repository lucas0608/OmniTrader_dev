export interface Trade {
  id: number;
  symbol: string;
  price: string;
  quantity: string;
  quoteQuantity: string;
  time: number;
  isBuyer: boolean;
  isMaker: boolean;
  commission: string;
  commissionAsset: string;
}

export interface TradeHistory {
  trades: Trade[];
  isLoading: boolean;
  error: string | null;
}