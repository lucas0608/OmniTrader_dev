export const WS_CONFIG = {
  BASE_URL: 'wss://stream.binance.com:9443/ws',
  RECONNECT_DELAY: 3000,
  MAX_RECONNECT_ATTEMPTS: 3
} as const;