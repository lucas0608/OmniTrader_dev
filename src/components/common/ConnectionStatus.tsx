import React from 'react';

interface ConnectionStatusProps {
  status: 'connected' | 'disconnected' | 'connecting';
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  status, 
  onClick,
  size = 'md'
}) => {
  const sizeClasses = size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2';
  const containerClasses = onClick ? 'cursor-pointer hover:opacity-80' : '';
  
  return (
    <div 
      className={`flex items-center gap-1 ${containerClasses}`}
      onClick={onClick}
      title={onClick ? 'Click to revalidate' : undefined}
      role={onClick ? 'button' : undefined}
    >
      <div className={`${sizeClasses} rounded-full ${
        status === 'connected' ? 'bg-green-500' :
        status === 'connecting' ? 'bg-yellow-500' :
        'bg-red-500'
      }`} />
      <span className="text-xs text-gray-400">
        {status === 'connected' ? 'Valid' :
         status === 'connecting' ? 'Validating...' :
         'Invalid'}
      </span>
    </div>
  );
};