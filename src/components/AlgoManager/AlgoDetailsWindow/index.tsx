import React, { useRef, useEffect } from 'react';
import { ManagedAlgo } from '../../../types/algo';
import { AdminAlgoDetails } from './AdminAlgoDetails';
import { UserAlgoDetails } from './UserAlgoDetails';
import { useDraggableModal } from '../../../hooks/useDraggableModal';
import { useClickOutside } from '../../../hooks/useClickOutside';

interface AlgoDetailsWindowProps {
  algo: ManagedAlgo;
  isAdmin: boolean;
  onClose: () => void;
}

export const AlgoDetailsWindow: React.FC<AlgoDetailsWindowProps> = ({
  algo,
  isAdmin,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    position,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useDraggableModal(`algo-details-${algo.name}`);

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
  }, [isDragging, handleMouseMove, handleMouseUp]);

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
          <h2 className="text-theme text-sm">Algo Details - {algo.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
        </div>

        {isAdmin ? (
          <AdminAlgoDetails algo={algo} onClose={onClose} />
        ) : (
          <UserAlgoDetails algo={algo} onClose={onClose} />
        )}
      </div>
    </div>
  );
};