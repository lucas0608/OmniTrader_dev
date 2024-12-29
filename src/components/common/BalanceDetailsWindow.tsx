import React, { useRef, useEffect } from 'react';
import { useUserStore } from '../../store/userStore';
import { MaskToggle } from './MaskToggle';
import { useDraggableModal } from '../../hooks/useDraggableModal';
import { useClickOutside } from '../../hooks/useClickOutside';

interface BalanceDetailsWindowProps {
  amount: number;
  title: string;
  onClose: () => void;
  maskType: keyof UserSettings['maskSettings'];
}

export const BalanceDetailsWindow: React.FC<BalanceDetailsWindowProps> = ({ 
  amount, 
  title,
  onClose,
  maskType
}) => {
  const { settings } = useUserStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDraggableModal(`balance-${maskType}`);

  useClickOutside(modalRef, onClose);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const formattedAmount = amount.toLocaleString(undefined, { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });

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
          <h3 className="text-theme text-sm">{title}</h3>
          <div className="flex items-center gap-2">
            <MaskToggle maskType={maskType} />
            <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
          </div>
        </div>
        <div className="text-white text-xl font-mono">
          {settings.maskSettings[maskType] ? "******.**" : `$${formattedAmount}`}
        </div>
      </div>
    </div>
  );
};