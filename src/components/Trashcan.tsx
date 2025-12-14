import React, { useCallback } from 'react';
import { useDrop, type DropTargetMonitor } from 'react-dnd'; 
import { useBookmarkStore } from '../store/useBookmarkStore'; // Use the store directly

interface DragItem {
  id: string;
  type: 'BOOKMARK_ICON';
}

export const TrashCan: React.FC = () => {
  // We DO NOT destructure removeBookmark here, as it's not strictly needed 
  // for the hook dependencies, reducing potential staleness.

  const [{ isOver }, drop] = useDrop<
    DragItem, 
    void,     
    { isOver: boolean } 
  >(() => ({
    accept: 'BOOKMARK_ICON',
    
    // FIX: Access the action directly via useBookmarkStore.getState()
    // This ensures we always call the LATEST version of the action, 
    // avoiding dependency issues inside the DND lifecycle.
    drop: (item: DragItem) => {
      useBookmarkStore.getState().removeBookmark(item.id);
      console.log(`Bookmark ${item.id} deleted.`);
    },
    
    collect: (monitor: DropTargetMonitor<DragItem, void>) => ({
      isOver: monitor.isOver(),
    }),
  }), []); // Dependency array is EMPTY, because we don't rely on props/state functions

  // FIX: Using useCallback to correctly connect the ref, essential for the DND lifecycle
  const trashCanRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
        // Connect the drop target to the DOM node
        drop(node);
    }
  }, [drop]); // Dependency on 'drop' is correct here

  return (
    <div 
      ref={trashCanRef} // Assign the stable callback ref
      className={`fixed bottom-4 right-4 p-4 rounded-full shadow-2xl transition-colors duration-300 z-50
        ${isOver ? 'bg-red-600 border-4 border-white' : 'bg-red-500'} 
        w-20 h-20 flex items-center justify-center cursor-pointer`}
      title="Drag bookmarks here to delete"
    >
      <span className="text-4xl" role="img" aria-label="trash can">
        {isOver ? '🔥' : '🗑️'}
      </span>
    </div>
  );
};