import React from 'react';
import { ConnectionStatus } from '../common/ConnectionStatus';
import { useApiKeyValidation } from '../../hooks/useApiKeyValidation';

interface ApiKeyValidationProps {
  apiKey: string;
  secretKey: string;
  keyType: 'hmac' | 'ed25519';
}

export const ApiKeyValidation: React.FC<ApiKeyValidationProps> = ({ 
  apiKey, 
  secretKey,
  keyType 
}) => {
  const { status, canRevalidate, revalidate } = useApiKeyValidation(
    apiKey, 
    secretKey,
    keyType
  );

  if (!apiKey || !secretKey) return null;

  return (
    <ConnectionStatus
      status={status}
      onClick={canRevalidate ? revalidate : undefined}
      size="sm"
    />
  );
};