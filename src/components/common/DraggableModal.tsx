import React from 'react';
import { useDraggableY } from '../../hooks/useDraggableY';

interface DraggableModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  initialY?: number;
}

export const DraggableModal: React.FC<DraggableModalProps> = ({
  title,
  onClose,
  children,
  initialY
}) => {
  const { position, handleMouseDown } = useDraggableY(initialY);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-[100]">
      <div 
        className="bg-[#1a1a1a] border border-theme p-4 w-full max-w-md rounded-lg mt-4"
        style={{ transform: `translateY(${position.y}px)` }}
      >
        <div 
          className="flex justify-between items-center mb-4 cursor-move"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-theme text-sm select-none">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>
        {children}
      </div>
    </div>
  );
};