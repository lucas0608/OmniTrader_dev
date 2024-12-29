import React, { useState } from 'react';
import { useUserStore } from '../../../store/userStore';

export const ChatTab = () => {
  const { users, currentUser } = useUserStore();
  const [messages, setMessages] = useState<Array<{text: string, sender: string}>>([]);
  const [inputText, setInputText] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [aiModel, setAiModel] = useState<'none' | 'gpt-4' | 'gpt-3.5'>('none');

  const handleSend = () => {
    if (!inputText.trim() || !selectedUser) return;
    
    const newMessage = {
      text: inputText,
      sender: selectedUser
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    if (aiModel !== 'none') {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: `AI response to: ${inputText}`,
          sender: aiModel
        }]);
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="flex-1 bg-gray-700 text-white p-2 text-sm"
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.username} value={user.username}>
              {user.username}
            </option>
          ))}
        </select>
        
        <select
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value as 'none' | 'gpt-4' | 'gpt-3.5')}
          className="flex-1 bg-gray-700 text-white p-2 text-sm"
        >
          <option value="none">Normal Chat</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5">GPT-3.5</option>
        </select>
      </div>

      <div className="h-64 bg-gray-800 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`text-sm ${
            msg.sender.includes('gpt') ? 'text-green-500' : 'text-white'
          }`}>
            <span className="font-bold">{msg.sender}: </span>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-white p-2"
        />
        <button 
          onClick={handleSend}
          className="bg-[#ff9933] text-black px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
};