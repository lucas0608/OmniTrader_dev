import React, { useState, useRef } from 'react';
import { useUserStore } from '../../store/userStore';
import { useDraggableModal } from '../../hooks/useDraggableModal';
import { useClickOutside } from '../../hooks/useClickOutside';

interface UserDataModalProps {
  onClose: () => void;
}

export const UserDataModal: React.FC<UserDataModalProps> = ({ onClose }) => {
  const { users, currentUser, selectUser, deleteUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDraggableModal('user-data-modal');

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

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogin = () => {
    // Login logic will be implemented later
    console.log('Login with:', { username, password });
  };

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
          <h2 className="text-theme text-sm">User Access Panel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 text-sm rounded"
              />
            </div>
            <div className="flex-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white p-2 text-sm rounded pr-8"
              />
              <button
                type="button"
                  onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
>
                       {showPassword ? (
    // 顯示圖標（"眼睛張開"）
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-    2.943-9.542-7z" />
                    </svg>
                          ) : (
    // 隱藏圖標（"眼睛劃線"）
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0                          114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                            )}
              </button>
            </div>
            <button
              onClick={handleLogin}
              className="bg-theme text-black px-4 py-2 rounded text-sm hover:bg-theme/80"
            >
              Login
            </button>
          </div>

          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700 text-white p-2 mb-4 text-sm rounded"
          />

          <div className="max-h-48 overflow-y-auto">
            {filteredUsers.map(user => (
              <div
                key={user.username}
                className={`flex justify-between items-center p-2 cursor-pointer hover:bg-gray-700 rounded ${
                  currentUser?.username === user.username ? 'bg-gray-700' : ''
                }`}
                onClick={() => {
                  selectUser(user.username);
                  onClose();
                }}
              >
                <div className="text-white text-sm">
                  <div>USER: {user.username}</div>
                  <div>HOST: {user.host}</div>
                  <div>PORT: {user.port}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteUser(user.username);
                  }}
                  className="text-red-500 hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};