export const formatPrice = (price: number): string => {
  if (price < 1) {
    return price.toFixed(6);
  }
  return price.toFixed(2);
};

export const formatVolume = (volume: number): string => {
  return formatCompactNumber(volume);
};

export const formatMarketCap = (marketCap: number): string => {
  return formatCompactNumber(marketCap);
};

export const formatCompactNumber = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toFixed(2);
};

export const formatCryptoAmount = (amount: number, asset: string): string => {
  const stablecoins = ['USDT', 'USDC', 'DAI', 'BUSD'];
  if (stablecoins.includes(asset)) {
    return amount.toFixed(2);
  }
  return amount < 1 ? amount.toFixed(6) : amount.toFixed(2);
};

export const formatOrderBookPrice = (price: string): string => {
  return parseFloat(price).toFixed(2);
};

export const formatOrderBookAmount = (amount: string): string => {
  return parseFloat(amount).toFixed(2);
};

export const formatOrderBookTotal = (total: string): string => {
  return parseFloat(total).toFixed(2);
};