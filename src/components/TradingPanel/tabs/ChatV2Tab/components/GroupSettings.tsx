import React, { useState, useRef } from 'react';
import { Group } from '../../../../../types/chat';
import { useUserStore } from '../../../../../store/userStore';
import { useChatStore } from '../../../../../store/chatStore';
import { useClickOutside } from '../../../../../hooks/useClickOutside';

interface GroupSettingsProps {
  group: Group;
  onClose: () => void;
}

export const GroupSettings: React.FC<GroupSettingsProps> = ({ group, onClose }) => {
  const [newName, setNewName] = useState(group.name);
  const { currentUser } = useUserStore();
  const { settings, updateSettings, leaveGroup, removeGroupMember } = useChatStore();
  const isCreator = group.creatorId === currentUser?.username;
  const modalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useClickOutside(modalRef, onClose);

  const handleUpdateName = () => {
    if (!newName.trim() || !isCreator) return;
    
    const updatedGroups = settings.groupChat.groups.map(g => 
      g.id === group.id ? { ...g, name: newName.trim() } : g
    );

    updateSettings({
      groupChat: { ...settings.groupChat, groups: updatedGroups }
    });
  };

  const handleLeaveGroup = async () => {
    try {
      if (isCreator && group.members.length > 1) {
        setError('Remove all members before deleting the group');
        return;
      }
      
      await leaveGroup(group.id);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to leave group');
      }
    }
  };

  const handleRemoveMember = (username: string) => {
    if (!isCreator || username === group.creatorId) return;
    removeGroupMember(group.id, username);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div 
        ref={modalRef}
        className="bg-[#1a1a1a] border border-theme p-4 w-full max-w-md rounded-lg"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-theme text-sm">Group Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">
              {error}
            </div>
          )}

          {isCreator && (
            <div>
              <label className="block text-white text-sm mb-1">Group Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 bg-gray-700 text-white p-2 text-sm rounded"
                />
                <button
                  onClick={handleUpdateName}
                  className="bg-theme text-black px-4 py-2 rounded text-sm hover:bg-theme/90"
                >
                  Update
                </button>
              </div>
            </div>
          )}

          <div>
            <div className="text-white text-sm mb-2">Group ID</div>
            <div className="flex gap-2 items-center">
              <code className="flex-1 bg-gray-700 p-2 rounded text-sm text-gray-300">
                {group.id}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(group.id)}
                className="bg-theme text-black px-4 py-2 rounded text-sm hover:bg-theme/90"
              >
                Copy
              </button>
            </div>
          </div>

          <div>
            <div className="text-white text-sm mb-2">Members ({group.members.length})</div>
            <div className="bg-gray-800 rounded max-h-48 overflow-y-auto">
              {group.members.map(member => (
                <div
                  key={member}
                  className="flex justify-between items-center p-2 hover:bg-gray-700"
                >
                  <span className="text-white text-sm">
                    {member} {member === group.creatorId && '(Creator)'}
                  </span>
                  {isCreator && member !== group.creatorId && (
                    <button
                      onClick={() => handleRemoveMember(member)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isCreator ? (
            <button
              onClick={handleLeaveGroup}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-4"
            >
              Delete Group
            </button>
          ) : (
            <button
              onClick={handleLeaveGroup}
              className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-4"
            >
              Leave Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};