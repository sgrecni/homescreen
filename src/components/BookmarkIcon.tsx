import React, { useState, useCallback, useEffect, useRef } from 'react'; // Added useRef
import { useDrag, useDrop, type ConnectDragPreview, type DropTargetMonitor } from 'react-dnd'; 
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useBookmarkStore, type Bookmark } from '../store/useBookmarkStore'; // Import useBookmarkStore

interface BookmarkIconProps {
  bookmark: Bookmark;
  onRemove: (id: string) => void;
}

// Define the type for the item being dragged (must match item in useDrag)
interface DragItem {
  id: string;
  // 🔑 ADDED: The original index of the item being dragged
  originalIndex: number; 
  type: string;
  url: string;
  title: string;
  iconUrl: string;
}

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({ bookmark, onRemove }) => {
  const [imgError, setImgError] = useState(false);
  const FALLBACK_ICON_URL = 'https://s2.googleusercontent.com/s2/favicons?domain=default&sz=64';
  const ref = useRef<HTMLDivElement>(null); // Ref to the component's DOM node

  const handleError = () => {
    if (!imgError) {
      setImgError(true);
    }
  };

  const handleIconClick = () => {
    if (!isDragging) {
      window.open(bookmark.url, '_blank');
    }
  };

// Get the move action from the store
const moveBookmark = useBookmarkStore(state => state.moveBookmark);
const currentIndex = useBookmarkStore(state => state.bookmarks.findIndex(b => b.id === bookmark.id));

// --- DROP TARGET (Final Sortable Logic) ---
const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
  accept: 'BOOKMARK_ICON',
  collect: (monitor) => ({
    isOver: monitor.isOver(),
  }),
  
  hover(item: DragItem, monitor: DropTargetMonitor) {
    if (!ref.current) return;
    
    const dragId = item.id;
    const hoverId = bookmark.id;
    
    // Don't replace items with themselves
    if (dragId === hoverId) return;

    // Get stable original index and the current hover index
    const dragIndex = item.originalIndex; // Use the stable index from the dragged item
    const hoverIndex = currentIndex; // Use the index of the current hover target

    // --- PIXEL-BASED DIRECTIONAL CHECK (More reliable) ---
    
    // Determine rectangle on screen
    const hoverBoundingRect = ref.current.getBoundingClientRect();

    // Get the vertical center of the hover item
    // const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    
    // Get the horizontal center of the hover item
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the left of the hover item
    const hoverClientX = clientOffset ? clientOffset.x - hoverBoundingRect.left : 0;
    
    // If the drag is happening quickly, we might skip a step.
    // This part ensures that if we are moving one position over, we check the threshold.
    
    // Dragging right, moving to a higher index
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return; // Don't move unless past the horizontal center
    }

    // Dragging left, moving to a lower index
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return; // Don't move unless past the horizontal center
    }
    
    // If we reach here, the drag has successfully crossed the center line.
    // --- PERFORM THE MOVE ---
    
    // We pass the stable drag ID and the current hover ID.
    moveBookmark(dragId, hoverId);
    
    // 🔑 FIX 2: Crucially, update the originalIndex *instead* of the ID.
    // Update the dragged item's reported index to the new hover index.
    // This ensures that the next hover call starts its check from the correct logical position.
    item.originalIndex = hoverIndex; 
  },
}), [currentIndex, moveBookmark]); // Dependency on the component's current index


// --- DRAG SOURCE (Dragging Logic) ---
const [{ isDragging }, drag, preview] = useDrag(() => ({
  type: 'BOOKMARK_ICON',
  item: { 
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      iconUrl: bookmark.iconUrl,
      type: 'BOOKMARK_ICON',
      // 🔑 FIX 1: Pass the original starting index
      originalIndex: currentIndex, 
  } as DragItem, 
  collect: (monitor) => ({
    isDragging: monitor.isDragging(),
  }),
}), [currentIndex, bookmark.url, bookmark.title, bookmark.iconUrl]);

// Keep: Disable browser ghost image
useEffect(() => {
  preview(getEmptyImage(), { captureDraggingState: true });
}, [preview]);

// --- COMBINED REF (Must attach both drag and drop connectors) ---
const bookmarkIconRef = useCallback((node: HTMLDivElement | null) => {
  if (node) {
      // Attach React's ref
      ref.current = node; 
      
      // Attach both drag and drop connectors
      drag(node);
      drop(node);
  }
}, [drag, drop]);

// Define hover style (we'll make the background blue when hovering over a drop zone)
const backgroundColor = isOver ? 'bg-blue-100 border-blue-300' : 'hover:bg-gray-100';

return (
  <div 
    ref={bookmarkIconRef} // Combined ref handles drag and drop
    className={`flex flex-col items-center cursor-pointer p-2 rounded-lg group relative h-28 w-fit ${backgroundColor}`}
    onClick={handleIconClick}
    title={bookmark.url}
    // Hide the original item while dragging
    style={{ opacity: isDragging ? 0 : 1, cursor: isDragging ? 'grabbing' : 'pointer', transition: 'opacity 0.2s' }} 
    draggable="false"
  >
    {/* ... (Icon Image Container, Title, Remove Button code remains the same) ... */}
    <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden shrink-0">
      <img
        src={imgError ? FALLBACK_ICON_URL : bookmark.iconUrl}
        alt={`${bookmark.title} icon`}
        onError={handleError}
        className="w-10 h-10 object-contain"
      />
    </div>

    <p className="mt-1 text-xs text-center text-gray-700 max-w-[60px] truncate flex-grow-0">
      {bookmark.title}
    </p>

    {/* <button
      onClick={(e) => {
        e.stopPropagation(); 
        onRemove(bookmark.id);
      }}
      className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center -translate-y-1 translate-x-1"
      title="Remove Bookmark (Click)"
    >
      &times;
    </button> */}
  </div>
);
};