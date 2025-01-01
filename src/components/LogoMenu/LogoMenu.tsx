import React, { useState, useRef } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { usePanelStore } from '../../store/panelStore';
import { useUserStore } from '../../store/userStore';
import { useMobileCheck } from '../../hooks/useMobileCheck';

export const LogoMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { resetPositions, addNewSet, closeAllSets } = usePanelStore();
  const { selectUser } = useUserStore();
  const isMobile = useMobileCheck();

  useClickOutside(menuRef, () => setIsOpen(false));

  const handleNewAdminPanel = () => {
    addNewSet();
    setIsOpen(false);
  };

  const handleCloseAllAdminPanels = () => {
    closeAllSets();
    setIsOpen(false);
  };

  const handleResetPosition = () => {
    resetPositions();
    setIsOpen(false);
  };

  const handleLogout = () => {
    selectUser(null);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <img 
          src="/logo.svg" 
          alt="OMNI TRADER" 
          className="h-5 md:h-8"
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-[#1a1a1a] border border-theme rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={handleNewAdminPanel}
              className={`w-full px-4 py-2 text-left text-sm ${
                isMobile 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-white hover:bg-gray-700'
              }`}
              disabled={isMobile}
            >
              New Admin Panel
            </button>
            <button
              onClick={handleCloseAllAdminPanels}
              className={`w-full px-4 py-2 text-left text-sm ${
                isMobile 
                  ? 'text-gray-500 cursor-not-allowed' 
                  : 'text-white hover:bg-gray-700'
              }`}
              disabled={isMobile}
            >
              Close All Admin Panels
            </button>
            <button
              onClick={handleResetPosition}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 text-sm"
            >
              Reset Position
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-500 hover:bg-gray-700 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};