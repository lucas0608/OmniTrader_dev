import React, { useState } from 'react';
import { Group } from '../../../../../types/chat';
import { useUserStore } from '../../../../../store/userStore';
import { useChatStore } from '../../../../../store/chatStore';
import { GroupSettings } from './GroupSettings';

interface GroupChatControlsProps {
  onClose: () => void;
}

export const GroupChatControls: React.FC<GroupChatControlsProps> = ({ onClose }) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showSettings, setShowSettings] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUserStore();
  const { createGroup, joinGroup, settings } = useChatStore();

  if (!currentUser) {
    return (
      <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a1a1a] border border-theme rounded-lg shadow-lg z-50">
        <div className="p-3 text-red-500 text-sm text-center">
          Please select a user first
        </div>
      </div>
    );
  }

  // Safely access groups with fallback to empty array
  const userGroups = settings?.groupChat?.groups?.filter(group => 
    group.members.includes(currentUser.username)
  ) || [];

  const handleCreateGroup = () => {
    if (!groupName.trim()) {
      setError('Group name cannot be empty');
      return;
    }

    const newGroup: Group = {
      id: Math.random().toString(36).substring(2, 14),
      name: groupName.trim(),
      creatorId: currentUser.username,
      members: [currentUser.username],
      createdAt: new Date()
    };

    createGroup(newGroup);
    setGroupName('');
    setShowCreateGroup(false);
    onClose();
  };

  const handleJoinGroup = () => {
    if (!groupId.trim()) {
      setError('Group ID cannot be empty');
      return;
    }

    try {
      joinGroup(groupId.trim(), currentUser.username);
      setGroupId('');
      setShowJoinGroup(false);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to join group');
      }
    }
  };

  return (
    <>
      <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a1a1a] border border-theme rounded-lg shadow-lg z-50">
        <div className="p-3">
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => {
                setShowCreateGroup(true);
                setShowJoinGroup(false);
                setError(null);
              }}
              className="flex-1 bg-theme text-black p-2 text-sm rounded hover:bg-theme/90"
            >
              Create Group
            </button>
            <button
              onClick={() => {
                setShowJoinGroup(true);
                setShowCreateGroup(false);
                setError(null);
              }}
              className="flex-1 bg-theme text-black p-2 text-sm rounded hover:bg-theme/90"
            >
              Join Group
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-3">{error}</div>
          )}

          {showCreateGroup && (
            <div className="space-y-3">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name..."
                className="w-full bg-gray-700 text-white p-2 text-sm rounded"
              />
              <button
                onClick={handleCreateGroup}
                className="w-full bg-theme text-black p-2 text-sm rounded hover:bg-theme/90"
              >
                Create
              </button>
            </div>
          )}

          {showJoinGroup && (
            <div className="space-y-3">
              <input
                type="text"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                placeholder="Enter group ID..."
                className="w-full bg-gray-700 text-white p-2 text-sm rounded"
              />
              <button
                onClick={handleJoinGroup}
                className="w-full bg-theme text-black p-2 text-sm rounded hover:bg-theme/90"
              >
                Join
              </button>
            </div>
          )}

          <div className="mt-3">
            <div className="text-theme text-sm mb-2">My Groups</div>
            <div className="max-h-48 overflow-y-auto">
              {userGroups.map(group => (
                <div
                  key={group.id}
                  className="p-2 hover:bg-gray-700 text-white text-sm flex justify-between items-center"
                >
                  <span>{group.name}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSettings(group)}
                      className="text-theme hover:text-theme/80"
                      title="Settings"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    {group.creatorId === currentUser.username && (
                      <button
                        onClick={() => navigator.clipboard.writeText(group.id)}
                        className="text-theme hover:text-theme/80"
                        title="Copy ID"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {userGroups.length === 0 && (
                <div className="text-gray-500 text-sm text-center py-2">
                  No groups yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <GroupSettings
          group={showSettings}
          onClose={() => setShowSettings(null)}
        />
      )}
    </>
  );
};