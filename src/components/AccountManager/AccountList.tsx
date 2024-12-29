import React, { useState } from 'react';
import { User } from '../../types/user';
import { AccountStatus } from '../../types/account';
import { AccountDetailsWindow } from './AccountDetailsWindow';
import { useUserStore } from '../../store/userStore';
import './checkbox.css';

interface AccountListProps {
  accounts: Array<User & { status: AccountStatus }>;
  isUnlocked: boolean;
  selectedAccounts: string[];
  onToggleSelect: (username: string) => void;
  onRemoveAccount: (username: string) => void;
}

export const AccountList: React.FC<AccountListProps> = ({
  accounts,
  isUnlocked,
  selectedAccounts,
  onToggleSelect,
  onRemoveAccount
}) => {
  const [selectedAccount, setSelectedAccount] = useState<User | null>(null);
  const { currentUser } = useUserStore();

  const handleAccountClick = (account: User, event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('account-name')) {
      setSelectedAccount(account);
    }
  };

  return (
    <div className="space-y-2">
      {accounts.map((account, index) => (
        <div
          key={account.username}
          className={`grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center text-theme text-sm p-2 ${
            index % 2 === 0 ? 'bg-[#262626]' : 'bg-[#1a1a1a]'
          }`}
          onClick={(e) => handleAccountClick(account, e)}
        >
          <div className="flex items-center gap-2 min-w-0">
            <label className="custom-checkbox flex-shrink-0">
              <input
                type="checkbox"
                checked={selectedAccounts.includes(account.username)}
                onChange={() => onToggleSelect(account.username)}
                disabled={!isUnlocked}
              />
              <span className="checkmark">
                <span></span>
              </span>
            </label>
            <span className="truncate account-name cursor-pointer hover:text-theme/80">
              {account.username}
            </span>
          </div>
          <div className="text-center">[{account.class}]</div>
          <div className={`text-center ${account.status.color || ''}`}>
            {account.status.text}
          </div>
          <div className="flex justify-end w-4">
            {isUnlocked && (
              <button
                onClick={() => onRemoveAccount(account.username)}
                className="text-red-500 hover:text-red-400 flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        </div>
      ))}

      {selectedAccount && currentUser && (
        <AccountDetailsWindow
          account={selectedAccount}
          isAdmin={currentUser.class === 'Admin'}
          onClose={() => setSelectedAccount(null)}
        />
      )}
    </div>
  );
};