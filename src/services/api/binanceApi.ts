import axios from 'axios';
import { handleApiError } from '../../utils/errorHandlers';

const BINANCE_API_BASE = 'https://api.binance.com/api/v3';

export const binanceApi = axios.create({
  baseURL: BINANCE_API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

binanceApi.interceptors.response.use(
  response => response,
  error => {
    handleApiError(error);
    return Promise.reject(error);
  }
);