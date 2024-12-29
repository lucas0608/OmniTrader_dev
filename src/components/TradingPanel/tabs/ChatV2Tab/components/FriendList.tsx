import React, { useState } from 'react';
import { Friend } from '../../../../../types/chat';
import { User } from '../../../../../types/user';
import { useUserStore } from '../../../../../store/userStore';
import { useChatStore } from '../../../../../store/chatStore';

interface FriendListProps {
  onClose: () => void;
}

export const FriendList: React.FC<FriendListProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { users, currentUser } = useUserStore();
  const { settings, updateSettings } = useChatStore();
  const friends = settings.normalChat.friends || [];

  // Filter out current user and existing friends
  const availableUsers = users.filter(user => 
    user.username !== currentUser?.username && 
    !friends.some(friend => friend.username === user.username) &&
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFriend = (username: string) => {
    const newFriend: Friend = {
      username,
      addedAt: new Date()
    };

    updateSettings({
      ...settings,
      normalChat: {
        ...settings.normalChat,
        friends: [...friends, newFriend]
      }
    });
    setSearchTerm('');
  };

  const removeFriend = (username: string) => {
    updateSettings({
      ...settings,
      normalChat: {
        ...settings.normalChat,
        friends: friends.filter(friend => friend.username !== username)
      }
    });
  };

  return (
    <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a1a1a] border border-theme rounded-lg shadow-lg z-50">
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="w-full bg-gray-700 text-white p-2 text-sm rounded"
          />
        </div>

        {searchTerm && availableUsers.length > 0 && (
          <div className="mt-2 max-h-32 overflow-y-auto border-b border-gray-700">
            {availableUsers.map(user => (
              <div
                key={user.username}
                className="p-2 hover:bg-gray-700 cursor-pointer text-white text-sm flex justify-between items-center"
                onClick={() => addFriend(user.username)}
              >
                <span>{user.username}</span>
                <span className="text-theme">+</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2">
          <div className="text-theme text-sm mb-2">Friends List</div>
          <div className="max-h-48 overflow-y-auto">
            {friends.map(friend => (
              <div
                key={friend.username}
                className="p-2 hover:bg-gray-700 text-white text-sm flex justify-between items-center"
              >
                <span>{friend.username}</span>
                <button
                  onClick={() => removeFriend(friend.username)}
                  className="text-red-500 hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
            {friends.length === 0 && (
              <div className="text-gray-500 text-sm text-center py-2">
                No friends added yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};