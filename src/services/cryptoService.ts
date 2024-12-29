import axios from 'axios';
import { MarketData } from '../types/market';
import { handleApiError } from '../utils/errorHandlers';

const COINCAP_API = 'https://api.coincap.io/v2';
const BINANCE_API = 'https://api.binance.com/api/v3';

const symbolMap: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'BNB': 'binance-coin',
  'SOL': 'solana',
  'XRP': 'xrp',
  'DOGE': 'dogecoin'
};

const getAssetId = (symbol: string): string => {
  const cleanSymbol = symbol.replace('USDT', '');
  return symbolMap[cleanSymbol] || cleanSymbol.toLowerCase();
};

export const CoinCapService = {
  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      const assetId = getAssetId(symbol);
      const { data } = await axios.get(`${COINCAP_API}/assets/${assetId}`);
      const assetData = data.data;
      const price = parseFloat(assetData.priceUsd);
      
      // Calculate high/low as ±2% of current price for CoinCap
      // since it doesn't provide 24h high/low
      const priceVariation = price * 0.02;
      
      return {
        symbol,
        price,
        high: price + priceVariation,
        low: price - priceVariation,
        change24h: parseFloat(assetData.changePercent24Hr),
        volume24h: parseFloat(assetData.volumeUsd24Hr),
        volumeChange24h: 0, // CoinCap doesn't provide this
        marketCap: parseFloat(assetData.marketCapUsd),
        marketCapRank: parseInt(assetData.rank),
        circulatingSupply: parseFloat(assetData.supply),
        maxSupply: assetData.maxSupply ? parseFloat(assetData.maxSupply) : null,
        timestamp: Date.now()
      };
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch market data from CoinCap');
    }
  }
};

export const BinanceService = {
  async getMarketData(symbol: string): Promise<MarketData> {
    try {
      // Fetch data from multiple endpoints
      const [ticker24h, tickerPrice, coinInfo] = await Promise.all([
        axios.get(`${BINANCE_API}/ticker/24hr`, { params: { symbol } }),
        axios.get(`${BINANCE_API}/ticker/price`, { params: { symbol } }),
        axios.get(`${COINCAP_API}/assets/${getAssetId(symbol)}`) // Use CoinCap for additional data
      ]);

      const ticker = ticker24h.data;
      const price = parseFloat(tickerPrice.data.price);
      const coinData = coinInfo.data.data;

      // Ensure high/low prices are relative to current price
      const high = Math.max(parseFloat(ticker.highPrice), price);
      const low = Math.min(parseFloat(ticker.lowPrice), price);

      return {
        symbol,
        price,
        high,
        low,
        change24h: parseFloat(ticker.priceChangePercent),
        volume24h: parseFloat(ticker.volume),
        volumeChange24h: 0, // Binance doesn't provide volume change
        marketCap: parseFloat(coinData.marketCapUsd),
        marketCapRank: parseInt(coinData.rank),
        circulatingSupply: parseFloat(coinData.supply),
        maxSupply: coinData.maxSupply ? parseFloat(coinData.maxSupply) : null,
        timestamp: ticker.closeTime
      };
    } catch (error) {
      handleApiError(error);
      throw new Error('Failed to fetch market data from Binance');
    }
  }
};