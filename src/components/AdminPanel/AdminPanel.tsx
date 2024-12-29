import React, { useState } from 'react';
import { Panel } from '../common/Panel';
import { MarketInfo } from './components/MarketInfo';
import { UserDataSection } from './components/UserDataSection';
import { CreateProfileModal } from './CreateProfileModal';
import { EditProfileModal } from './EditProfileModal';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { FunctionFilter } from './FunctionFilter';
import { useAccountManagerStore } from '../../store/accountManagerStore';
import { useAlgoManagerStore } from '../../store/algoManagerStore';
import { usePanelVisibility } from '../../hooks/usePanelVisibility';
import { useFilterStore } from '../../store/filterStore';
import { useUserStore } from '../../store/userStore';

export const AdminPanel = () => {
  const [showFunctionFilter, setShowFunctionFilter] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const { setUnlocked: setAccountManagerUnlocked } = useAccountManagerStore();
  const { setUnlocked: setAlgoManagerUnlocked } = useAlgoManagerStore();
  const { updatePanelOrder } = usePanelVisibility();
  const { items, pendingOrder, applyPendingOrder, clearPendingOrder } = useFilterStore();
  const { currentUser } = useUserStore();

  const handleSettingsClick = () => {
    const newState = !showFunctionFilter;
    setShowFunctionFilter(newState);
    setAccountManagerUnlocked(newState);
    setAlgoManagerUnlocked(newState);

    if (!newState) {
      if (pendingOrder) {
        applyPendingOrder();
      } else {
        const newOrder = items
          .filter(item => !item.blocked && item.name !== 'FUNCTION FILTER')
          .map(item => item.name);
        updatePanelOrder(newOrder);
      }
    }
  };

  return (
    <>
      <Panel 
        title="ADMIN PANEL" 
        showSettings 
        onSettingsClick={handleSettingsClick}
        isSettingsActive={showFunctionFilter}
      >
        <div className="space-y-4">
          <MarketInfo />
          <div className="grid grid-cols-2 gap-4">
            <UserDataSection />
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setShowCreateProfile(true)}
                className="bg-gray-700 text-white py-1 px-3 text-sm"
              >
                Create Profile
              </button>
              <button 
                onClick={() => setShowEditProfile(true)}
                disabled={!currentUser}
                className={`bg-gray-700 text-white py-1 px-3 text-sm ${
                  !currentUser ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Edit Profile
              </button>
              <button 
                onClick={() => setShowProfileSettings(true)}
                className="bg-gray-700 text-white py-1 px-3 text-sm"
              >
                Profile Settings
              </button>
            </div>
          </div>
        </div>
      </Panel>
      
      {showCreateProfile && <CreateProfileModal onClose={() => setShowCreateProfile(false)} />}
      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
      {showProfileSettings && <ProfileSettingsModal onClose={() => setShowProfileSettings(false)} />}
      {showFunctionFilter && <FunctionFilter />}
    </>
  );
};