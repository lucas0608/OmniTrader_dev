import React from 'react';
import { User } from '../../../types/user';
import { useNavigateToChat } from '../../../hooks/useNavigateToChat';
import { useUserStore } from '../../../store/userStore';

interface UserAccountDetailsProps {
  account: User;
  onClose: () => void;
}

export const UserAccountDetails: React.FC<UserAccountDetailsProps> = ({ account, onClose }) => {
  const navigateToChat = useNavigateToChat();
  const { currentUser } = useUserStore();

  const handleChatClick = () => {
    if (account.username !== currentUser?.username) {
      navigateToChat(account.username);
      onClose();
    }
  };

  const isSelfChat = account.username === currentUser?.username;

  return (
    <div className="space-y-4">
      <button
        onClick={handleChatClick}
        disabled={isSelfChat}
        className={`w-full py-2 rounded ${
          isSelfChat 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-theme text-black hover:bg-theme/90'
        }`}
      >
        Chat with User
      </button>
    </div>
  );
};