import React, { useState } from 'react';
import { User } from '../../types/user';

interface AccountSearchProps {
  availableAccounts: User[];
  existingAccounts: string[];
  onAddAccount: (username: string) => void;
}

export const AccountSearch: React.FC<AccountSearchProps> = ({
  availableAccounts,
  existingAccounts,
  onAddAccount
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = availableAccounts
    .filter(account => 
      !existingAccounts.includes(account.username) &&
      account.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="flex gap-2">
      <div className="relative flex-grow">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search accounts..."
          className="w-full bg-gray-700 text-white p-1 text-sm"
        />
        {searchTerm && filteredAccounts.length > 0 && (
          <div className="absolute w-full bg-gray-800 mt-1 border border-gray-700 max-h-32 overflow-y-auto">
            {filteredAccounts.map(account => (
              <div
                key={account.username}
                className="p-2 hover:bg-gray-700 cursor-pointer text-white text-sm"
                onClick={() => {
                  onAddAccount(account.username);
                  setSearchTerm('');
                }}
              >
                {account.username}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};