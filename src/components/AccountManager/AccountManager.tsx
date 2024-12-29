import React from 'react';
import { Panel } from '../common/Panel';
import { AccountList } from './AccountList';
import { AccountSearch } from './AccountSearch';
import { useAccountManagerStore } from '../../store/accountManagerStore';
import { useUserStore } from '../../store/userStore';

export const AccountManager = () => {
  const { users } = useUserStore();
  const {
    managedAccounts,
    selectedAccounts,
    isUnlocked,
    addAccount,
    removeAccount,
    toggleAccountSelection
  } = useAccountManagerStore();

  return (
    <Panel title="ACCOUNT MANAGER">
      <div className="space-y-4">
        {isUnlocked && (
          <AccountSearch
            availableAccounts={users}
            existingAccounts={managedAccounts.map(a => a.username)}
            onAddAccount={(username) => addAccount(username, users)}
          />
        )}

        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 text-theme text-sm mb-2">
          <div>A/C</div>
          <div className="text-center">CLASS</div>
          <div className="text-center">STATUS</div>
          <div></div>
        </div>
        
        <AccountList
          accounts={managedAccounts}
          isUnlocked={isUnlocked}
          selectedAccounts={selectedAccounts}
          onToggleSelect={toggleAccountSelection}
          onRemoveAccount={removeAccount}
        />
      </div>
    </Panel>
  );
};