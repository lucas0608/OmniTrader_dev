import React from 'react';
import { User } from '../../../types/user';
import { useTradingStore } from '../../../store/tradingStore';
import { useChatStore } from '../../../store/chatStore';
import { useUserStore } from '../../../store/userStore';
import { useNavigateToChat } from '../../../hooks/useNavigateToChat';

interface AdminAccountDetailsProps {
  account: User;
  onClose: () => void;
}

export const AdminAccountDetails: React.FC<AdminAccountDetailsProps> = ({ account, onClose }) => {
  const { currentUser } = useUserStore();
  const { algoEnabled, toggleAlgo } = useUserStore();
  const { positions } = useTradingStore();
  const navigateToChat = useNavigateToChat();

  const handleChatClick = () => {
    // Only allow chat if not the current user
    if (account.username !== currentUser?.username) {
      navigateToChat(account.username);
      onClose();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded">
        <h3 className="text-theme text-sm mb-2">Current Positions</h3>
        {positions.length > 0 ? (
          <div className="space-y-2">
            {positions.map((position, index) => (
              <div key={index} className="grid grid-cols-3 text-white text-sm">
                <span>{position.symbol}</span>
                <span className="text-center">{position.amount}</span>
                <span className={`text-right ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {position.pnl >= 0 ? '+' : ''}{position.pnl}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-sm">No active positions</div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleChatClick}
          disabled={account.username === currentUser?.username}
          className={`flex-1 py-2 rounded ${
            account.username === currentUser?.username
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-theme text-black hover:bg-theme/90'
          }`}
        >
          Chat with User
        </button>
        <button
          onClick={toggleAlgo}
          className={`flex-1 py-2 rounded ${
            algoEnabled ? 'bg-green-500 text-black' : 'bg-gray-700 text-white'
          }`}
        >
          Algo {algoEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <button
        onClick={() => {
          // TODO: Implement close all positions logic
          console.log('Closing all positions...');
        }}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Close All Positions
      </button>
    </div>
  );
};