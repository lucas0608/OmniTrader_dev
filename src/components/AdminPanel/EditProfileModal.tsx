import React, { useState, useRef, useEffect } from 'react';
import { User, UserClass } from '../../types/user';
import { useUserStore } from '../../store/userStore';
import { useDraggableModal } from '../../hooks/useDraggableModal';
import { useClickOutside } from '../../hooks/useClickOutside';
import { PasswordInput } from '../common/PasswordInput';
import { ApiKeyValidation } from './ApiKeyValidation';

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { currentUser, users, updateUser } = useUserStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDraggableModal('edit-profile');

  const [formData, setFormData] = useState({
    username: currentUser?.username || '',
    password: '', // Keep empty for password changes
    host: currentUser?.host || '',
    port: currentUser?.port || '',
    class: currentUser?.class || 'Demo',
    keyType: currentUser?.keyType || 'hmac',
    apiKey: currentUser?.apiKey || '',
    secretKey: currentUser?.secretKey || ''
  });

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username,
        password: '', // Keep empty for password changes
        host: currentUser.host,
        port: currentUser.port,
        class: currentUser.class,
        keyType: currentUser.keyType || 'hmac',
        apiKey: currentUser.apiKey || '',
        secretKey: currentUser.secretKey || ''
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.username) {
      setError('Username is required');
      return;
    }

    // Check for duplicate username only if username was changed
    if (formData.username !== currentUser?.username) {
      const isDuplicate = users.some(user => 
        user.username === formData.username && user.username !== currentUser?.username
      );
      
      if (isDuplicate) {
        setError('Username already exists');
        return;
      }
    }

    try {
      if (currentUser) {
        // If password is empty, keep the existing password
        const updatedUser = {
          ...formData,
          password: formData.password || currentUser.password
        };
        updateUser(currentUser.username, updatedUser);
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (!currentUser) return null;

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
          <h2 className="text-theme text-sm">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm mb-1">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-gray-700 text-white p-2 text-sm rounded"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Class</label>
              <select
                value={formData.class}
                onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value as UserClass }))}
                className="w-full bg-gray-700 text-white p-2 text-sm rounded"
              >
                <option value="Admin">Admin</option>
                <option value="Live">Live</option>
                <option value="Demo">Demo</option>
              </select>
            </div>
          </div>

          <PasswordInput
            value={formData.password}
            onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
            label="New Password (leave empty to keep current)"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm mb-1">Host</label>
              <input
                type="text"
                value={formData.host}
                onChange={(e) => setFormData(prev => ({ ...prev, host: e.target.value }))}
                className="w-full bg-gray-700 text-white p-2 text-sm rounded"
                placeholder="Enter host"
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-1">Port</label>
              <input
                type="text"
                value={formData.port}
                onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                className="w-full bg-gray-700 text-white p-2 text-sm rounded"
                placeholder="Enter port"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Key Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-white">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.keyType === 'hmac'}
                    onChange={() => setFormData(prev => ({ ...prev, keyType: 'hmac' }))}
                  />
                  <span className="checkmark">
                    <span></span>
                  </span>
                </div>
                <span className="text-sm">HMAC-SHA-256</span>
              </label>
              <label className="flex items-center gap-2 text-white">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.keyType === 'ed25519'}
                    onChange={() => setFormData(prev => ({ ...prev, keyType: 'ed25519' }))}
                  />
                  <span className="checkmark">
                    <span></span>
                  </span>
                </div>
                <span className="text-sm">Ed25519</span>
              </label>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-white text-sm">API Key</label>
              <ApiKeyValidation 
                apiKey={formData.apiKey} 
                secretKey={formData.secretKey}
                keyType={formData.keyType}
              />
            </div>
            <input
              type="text"
              value={formData.apiKey}
              onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
              className="w-full bg-gray-700 text-white p-2 text-sm rounded"
              placeholder="Enter API key"
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-1">Secret Key</label>
            <div className="relative">
              <input
                type={showSecret ? "text" : "password"}
                value={formData.secretKey}
                onChange={(e) => setFormData(prev => ({ ...prev, secretKey: e.target.value }))}
                className="w-full bg-gray-700 text-white p-2 text-sm rounded pr-10"
                placeholder="Enter secret key"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showSecret ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-theme text-black px-4 py-2 rounded hover:bg-theme/90"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};