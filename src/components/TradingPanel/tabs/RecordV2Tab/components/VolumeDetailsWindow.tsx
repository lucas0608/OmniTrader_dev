import React, { useRef, useEffect } from 'react';
import { useUserStore } from '../../../../../store/userStore';
import { MaskToggle } from '../../../../common/MaskToggle';
import { useDraggableModal } from '../../../../../hooks/useDraggableModal';
import { useClickOutside } from '../../../../../hooks/useClickOutside';

interface VolumeDetailsWindowProps {
  volume: number;
  onClose: () => void;
}

export const VolumeDetailsWindow: React.FC<VolumeDetailsWindowProps> = ({ volume, onClose }) => {
  const { settings } = useUserStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDraggableModal('volume-details');

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

  const formattedVolume = volume.toLocaleString(undefined, { 
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
          <h3 className="text-theme text-sm">Volume Details</h3>
          <div className="flex items-center gap-2">
            <MaskToggle maskType="volumeMask" />
            <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
          </div>
        </div>
        <div className="text-white text-xl font-mono">
          {settings.maskSettings.volumeMask ? "******.**" : `$${formattedVolume}`}
        </div>
      </div>
    </div>
  );
};