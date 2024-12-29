import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

type ValidationStatus = 'connected' | 'disconnected' | 'connecting';

interface ValidationState {
  status: ValidationStatus;
  attempts: number;
  canRevalidate: boolean;
}

const createSignature = (queryString: string, secretKey: string, keyType: 'hmac' | 'ed25519'): string => {
  return keyType === 'hmac' 
    ? CryptoJS.HmacSHA256(queryString, secretKey).toString()
    : CryptoJS.HmacSHA512(queryString, secretKey).toString();
};

export const useApiKeyValidation = (
  apiKey: string,
  secretKey: string,
  keyType: 'hmac' | 'ed25519'
) => {
  const [state, setState] = useState<ValidationState>({
    status: 'disconnected',
    attempts: 0,
    canRevalidate: true
  });

  const validateKeys = useCallback(async () => {
    if (!apiKey || !secretKey) return;

    setState(prev => ({
      ...prev,
      status: 'connecting',
      canRevalidate: false
    }));

    try {
      const timestamp = Date.now().toString();
      const queryString = `timestamp=${timestamp}`;
      const signature = createSignature(queryString, secretKey, keyType);

      const response = await axios.get('https://api.binance.com/api/v3/account', {
        params: { timestamp, signature },
        headers: { 'X-MBX-APIKEY': apiKey }
      });

      setState({
        status: response.status === 200 ? 'connected' : 'disconnected',
        attempts: 0,
        canRevalidate: true
      });
    } catch (error) {
      setState(prev => ({
        status: 'disconnected',
        attempts: prev.attempts + 1,
        canRevalidate: true
      }));
    }
  }, [apiKey, secretKey, keyType]);

  useEffect(() => {
    if (apiKey && secretKey) {
      validateKeys();
    }
  }, [apiKey, secretKey, keyType, validateKeys]);

  return {
    ...state,
    revalidate: validateKeys
  };
};