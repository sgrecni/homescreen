// src/components/Trashcan.tsx
import React, { useCallback } from 'react';
import { useDrop, type DropTargetMonitor } from 'react-dnd'; 
import { useBookmarkStore } from '../store/useBookmarkStore';

interface DragItem {
  id: string;
  type: 'BOOKMARK_ICON';
}

export const TrashCan: React.FC = () => {
  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem, 
    void,     
    { isOver: boolean; canDrop: boolean } 
  >(() => ({
    accept: 'BOOKMARK_ICON',
    
    // Using getState() ensures the action is never "stale"
    drop: (item: DragItem) => {
      useBookmarkStore.getState().removeBookmark(item.id);
    },
    
    collect: (monitor: DropTargetMonitor<DragItem, void>) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), []);

  const trashCanRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      drop(node);
    }
  }, [drop]);

  // Only show or highlight the trash can when a drag is actually happening
  if (!canDrop && !isOver) {
    // We keep it rendered but subtle so it doesn't "pop" in and out distractingly
  }

  return (
    <div 
      ref={trashCanRef}
      className={`
        fixed bottom-6 right-6 w-20 h-20 rounded-full shadow-2xl 
        transition-all duration-300 z-50 flex items-center justify-center 
        cursor-pointer border-4 border-white
        ${isOver 
          ? 'bg-red-600 scale-110 rotate-12 ring-4 ring-red-200' 
          : canDrop 
            ? 'bg-red-500 animate-pulse scale-105' 
            : 'bg-gray-300 opacity-20 grayscale translate-y-2'
        }
      `}
      title="Drag bookmarks here to delete"
    >
      <div className="flex flex-col items-center">
        <span className="text-3xl" role="img" aria-label="trash can">
          {isOver ? '🔥' : '🗑️'}
        </span>
        {isOver && (
          <span className="text-[10px] text-white font-bold uppercase animate-bounce">
            Drop!
          </span>
        )}
      </div>
    </div>
  );
};