import React, { useState, useRef } from 'react';
import { ChatMode } from '../../../../../types/chat';
import { useUserStore } from '../../../../../store/userStore';
import { useChatStore } from '../../../../../store/chatStore';
import { FriendList } from './FriendList';
import { GroupChatControls } from './GroupChatControls';
import { useClickOutside } from '../../../../../hooks/useClickOutside';

interface UserSelectorProps {
  mode: ChatMode;
  selectedUser: string;
  onSelectUser: (username: string) => void;
}

export const UserSelector: React.FC<UserSelectorProps> = ({
  mode,
  selectedUser,
  onSelectUser
}) => {
  const [showFriendList, setShowFriendList] = useState(false);
  const [showGroupControls, setShowGroupControls] = useState(false);
  const { currentUser } = useUserStore();
  const { settings } = useChatStore();
  const controlsRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(controlsRef, () => {
    setShowFriendList(false);
    setShowGroupControls(false);
  });

  const selectClassName = "bg-gray-700 text-white h-8 text-sm rounded px-2";

  // For announcement mode
  if (mode === 'announcement') {
    return (
      <select
        value="announcements"
        disabled
        className={`w-full ${selectClassName} opacity-75`}
      >
        <option value="announcements">All Users</option>
      </select>
    );
  }

  // For AI mode
  if (mode === 'ai') {
    return (
      <select
        value={selectedUser}
        onChange={(e) => onSelectUser(e.target.value)}
        className={`w-full ${selectClassName}`}
      >
        <option value="">Select AI Model</option>
        <option value="gpt-4o-mini">GPT-4o Mini</option>
        <option value="gpt-4o">GPT-4o</option>
      </select>
    );
  }

  // For group mode - only show groups where user is a member
  if (mode === 'group') {
    const userGroups = settings.groupChat?.groups?.filter(group => 
      group.creatorId === currentUser?.username || 
      group.members.includes(currentUser?.username || '')
    ) || [];

    return (
      <div className="flex gap-2 relative flex-1" ref={controlsRef}>
        <button
          onClick={() => setShowGroupControls(!showGroupControls)}
          className="bg-theme text-black h-8 w-8 rounded hover:bg-theme/90 flex items-center justify-center text-lg font-bold leading-none"
          title="Group Controls"
        >
          +
        </button>
        
        <select
          value={selectedUser}
          onChange={(e) => onSelectUser(e.target.value)}
          className={`flex-1 ${selectClassName}`}
        >
          <option value="">Select Group</option>
          {userGroups.map(group => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        {showGroupControls && (
          <GroupChatControls onClose={() => setShowGroupControls(false)} />
        )}
      </div>
    );
  }

  // For normal chat mode - only show friends
  const friends = settings.normalChat?.friends || [];

  return (
    <div className="flex gap-2 relative flex-1" ref={controlsRef}>
      <button
        onClick={() => setShowFriendList(!showFriendList)}
        className="bg-theme text-black h-8 w-8 rounded hover:bg-theme/90 flex items-center justify-center text-lg font-bold leading-none"
        title="Add Friend"
      >
        +
      </button>
      
      <select
        value={selectedUser}
        onChange={(e) => onSelectUser(e.target.value)}
        className={`flex-1 ${selectClassName}`}
      >
        <option value="">Select Friend</option>
        {friends.map(friend => (
          <option key={friend.username} value={friend.username}>
            {friend.username}
          </option>
        ))}
      </select>

      {showFriendList && (
        <FriendList onClose={() => setShowFriendList(false)} />
      )}
    </div>
  );
};