import React from 'react';
import { User } from '../../../types/user';
import { AdminAccountDetails } from './AdminAccountDetails';
import { UserAccountDetails } from './UserAccountDetails';
import { useDraggableModal } from '../../../hooks/useDraggableModal';
import { useClickOutside } from '../../../hooks/useClickOutside';

interface AccountDetailsWindowProps {
  account: User;
  isAdmin: boolean;
  onClose: () => void;
}

export const AccountDetailsWindow: React.FC<AccountDetailsWindowProps> = ({ 
  account, 
  isAdmin,
  onClose 
}) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDraggableModal(`account-details-${account.username}`);

  useClickOutside(modalRef, onClose);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div
        ref={modalRef}
        className="bg-[#1a1a1a] border border-theme p-4 w-full max-w-md rounded-lg"
        style={{ transform: `translateY(${position.y}px)` }}
      >
        <div
          className="flex justify-between items-center mb-4 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-theme text-sm">Account Details - {account.username}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>

        {isAdmin ? (
          <AdminAccountDetails account={account} onClose={onClose} />
        ) : (
          <UserAccountDetails account={account} onClose={onClose} />
        )}
      </div>
    </div>
  );
};