import React, { useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { UserDataModal } from './UserDataModal';

export const UserDataSection = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const { currentUser, algoEnabled } = useUserStore();

  return (
    <div className="bg-[#1a1a1a] border border-theme p-3 h-[140px] overflow-hidden">
      <div 
        className="text-white font-mono text-sm leading-relaxed cursor-pointer"
        onClick={() => setShowUserModal(true)}
      >
        <div>USER: {currentUser?.username || 'N/A'}</div>
        <div>HOST: {currentUser?.host || 'N/A'}</div>
        <div>PORT: {currentUser?.port || 'N/A'}</div>
        <div className="text-theme">{algoEnabled ? 'ALGO ON' : 'ALGO OFF'}</div>
      </div>

      {showUserModal && <UserDataModal onClose={() => setShowUserModal(false)} />}
    </div>
  );
};