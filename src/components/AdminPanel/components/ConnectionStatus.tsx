import React from 'react';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'connecting';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ status }) => (
  <div className="flex items-center gap-1">
    <div className={`w-2 h-2 rounded-full ${
      status === 'connected' ? 'bg-green-500' :
      status === 'connecting' ? 'bg-yellow-500' :
      'bg-red-500'
    }`} />
    <span className="text-xs text-gray-400">
      {status === 'connected' ? 'Live' :
       status === 'connecting' ? 'Connecting...' :
       'Disconnected'}
    </span>
  </div>
);