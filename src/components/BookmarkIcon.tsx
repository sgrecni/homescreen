// src/components/BookmarkIcon.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDrag, useDrop, type DropTargetMonitor } from 'react-dnd'; 
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useBookmarkStore, type Bookmark } from '../store/useBookmarkStore';

interface BookmarkIconProps {
  bookmark: Bookmark;
}

interface DragItem {
  id: string;
  originalIndex: number; 
  type: string;
}

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({ bookmark }) => {
  // --- States ---
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(bookmark.title);
  
  const FALLBACK_ICON_URL = 'https://s2.googleusercontent.com/s2/favicons?domain=default&sz=64';
  const ref = useRef<HTMLDivElement>(null);

  // --- Store Actions ---
  const { moveBookmark, updateBookmarkTitle, bookmarks } = useBookmarkStore();
  const currentIndex = bookmarks.findIndex(b => b.id === bookmark.id);

  // --- Renaming Handlers ---
  const startEditing = () => {
    setDraftTitle(bookmark.title);
    setIsEditing(true);
  };

  const saveTitle = () => {
    if (draftTitle.trim() && draftTitle.trim() !== bookmark.title) {
      updateBookmarkTitle(bookmark.id, draftTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Enter') saveTitle();
      if (e.key === 'Escape') setIsEditing(false);
      e.stopPropagation(); // Don't trigger global shortcuts while typing
    } else if (e.key === 'F2') {
      e.preventDefault();
      startEditing();
    }
  };

  const handleMouseEnter = () => {
    if (!isEditing && ref.current) {
      ref.current.focus();
    }
  };

  const clickCoords = useRef<{ x: number, y: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    clickCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  
    if (clickCoords.current) {
      const deltaX = Math.abs(e.clientX - clickCoords.current.x);
      const deltaY = Math.abs(e.clientY - clickCoords.current.y);
      
      // 2. If the mouse moved more than 5 pixels, it's a drag, not a click
      if (deltaX > 5 || deltaY > 5) {
        return; 
      }
    }

    startEditing();
  };

  // --- Drag and Drop Logic (Your original logic restored & cleaned) ---
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: 'BOOKMARK_ICON',
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current || item.id === bookmark.id) return;

      const dragIndex = item.originalIndex;
      const hoverIndex = currentIndex;
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset ? clientOffset.x - hoverBoundingRect.left : 0;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveBookmark(item.id, bookmark.id);
      item.originalIndex = hoverIndex; 
    },
  }), [currentIndex, moveBookmark]);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'BOOKMARK_ICON',
    // 🔑 Disable dragging if we are currently renaming
    canDrag: !isEditing,
    item: () => {
      // 🔑 We return a function here to ensure we get the FRESH state 
      // of the bookmark when the drag starts
      return { 
        id: bookmark.id, 
        type: 'BOOKMARK_ICON', 
        originalIndex: currentIndex,
        iconUrl: bookmark.iconUrl, // 👈 ADD THIS
        title: bookmark.title      // 👈 ADD THIS
      };
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }), [currentIndex, bookmark.id, isEditing]);

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  const bookmarkIconRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      ref.current = node; 
      drag(node);
      drop(node);
    }
  }, [drag, drop]);

  // --- Render Helpers ---
  const handleIconClick = (e: React.MouseEvent) => {
    if (isEditing) return;
    // Only open link if clicking the icon container, not the text
    const target = e.target as HTMLElement;
    if (target.tagName !== 'P' && target.tagName !== 'INPUT') {
      window.open(bookmark.url, '_blank');
    }
  };

  return (
    <div 
      ref={bookmarkIconRef}
      tabIndex={0} // Allows element to be focused for F2
      onKeyDown={handleKeyDown}
      onClick={handleIconClick}
      onMouseEnter={handleMouseEnter} // Fixes focus on hover for F2
      className={`
        flex flex-col items-center p-2 rounded-lg group relative h-28 w-24 transition-all outline-none
        ${isOver ? 'bg-blue-50' : 'hover:bg-gray-100'}
        focus:border-blue-300 focus:bg-blue-50/50
      `}
      style={{ 
        opacity: isDragging ? 0 : 1, 
        cursor: isEditing ? 'text' : isDragging ? 'grabbing' : 'pointer' 
      }}
    >
      {/* Icon Image Container */}
      <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden shrink-0 pointer-events-none">
        <img
          src={imgError ? FALLBACK_ICON_URL : bookmark.iconUrl}
          alt=""
          onError={() => setImgError(true)}
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Title / Input Area */}
      {isEditing ? (
        <input
          autoFocus
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          onBlur={saveTitle}
          className="mt-1 text-xs text-center text-gray-800 w-full bg-white border border-blue-500 rounded px-1 outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <p 
          className="mt-1 text-xs text-center text-gray-700 w-full truncate font-medium hover:text-blue-600"
          title="Click to rename"
          onMouseDown={handleMouseDown} // 🔑 Capture start pos
          onClick={handleLabelClick}    // 🔑 Check movement before renaming
        >
          {bookmark.title}
        </p>
      )}
    </div>
  );
};