import React, { useState, useRef, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { useDraggableModal } from '../../hooks/useDraggableModal';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useLogoPreview } from '../../hooks/useLogoPreview';
import './FunctionFilter.css';

interface ProfileSettingsModalProps {
  onClose: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({ onClose }) => {
  const { settings, updateUserSettings } = useUserStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const modalRef = useRef<HTMLDivElement>(null);
  const { updateLogo, revertLogo } = useLogoPreview();
  
  const {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDraggableModal('profile-settings');

  useClickOutside(modalRef, handleCancel);

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

  const handleColorChange = (value: string) => {
    setLocalSettings(prev => ({ ...prev, themeColor: value }));
    document.documentElement.style.setProperty('--primary-color', value);
    updateLogo(value);
  };

  const handlePresetColorClick = (color: string) => {
    handleColorChange(color);
  };

  const handlePriceSourceChange = (source: 'binance' | 'coincap') => {
    setLocalSettings(prev => ({
      ...prev,
      priceSource: {
        binance: source === 'binance',
        coincap: source === 'coincap'
      }
    }));
  };

  const handleDataMethodChange = (method: 'polling' | 'streaming') => {
    setLocalSettings(prev => ({ ...prev, dataMethod: method }));
  };

  const handleSave = () => {
    updateUserSettings(localSettings);
    onClose();
  };

  function handleCancel() {
    document.documentElement.style.setProperty('--primary-color', settings.themeColor);
    revertLogo();
    onClose();
  }

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
          <h2 className="text-theme text-sm">Profile Settings</h2>
          <button onClick={handleCancel} className="text-gray-400 hover:text-white">×</button>
        </div>

        <div className="space-y-6">
          {/* Theme Color */}
          <div>
            <label className="block text-white text-sm mb-1">Theme Color</label>
            <input
              type="color"
              value={localSettings.themeColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-10 bg-gray-700 rounded"
            />
            <div className="flex gap-2 mt-2">
              {settings.presetColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetColorClick(color)}
                  className="w-8 h-8 border border-gray-600 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Price Data Source */}
          <div>
            <label className="block text-white text-sm mb-2">Price Data Source</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-white">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={localSettings.priceSource.binance}
                    onChange={() => handlePriceSourceChange('binance')}
                  />
                  <span className="checkmark">
                    <span></span>
                  </span>
                </div>
                <span className="text-sm">Binance API</span>
              </label>
              <label className="flex items-center gap-2 text-white">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={localSettings.priceSource.coincap}
                    onChange={() => handlePriceSourceChange('coincap')}
                  />
                  <span className="checkmark">
                    <span></span>
                  </span>
                </div>
                <span className="text-sm">CoinCap API</span>
              </label>
            </div>
          </div>

          {/* Data Method */}
          <div>
            <label className="block text-white text-sm mb-2">Data Method</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-white">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={localSettings.dataMethod === 'polling'}
                    onChange={() => handleDataMethodChange('polling')}
                  />
                  <span className="checkmark">
                    <span></span>
                  </span>
                </div>
                <span className="text-sm">Polling</span>
              </label>
              <label className="flex items-center gap-2 text-white">
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={localSettings.dataMethod === 'streaming'}
                    onChange={() => handleDataMethodChange('streaming')}
                  />
                  <span className="checkmark">
                    <span></span>
                  </span>
                </div>
                <span className="text-sm">Data Streaming</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleCancel}
              className="bg-gray-700 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-theme text-black px-4 py-2 rounded hover:bg-theme/90"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};