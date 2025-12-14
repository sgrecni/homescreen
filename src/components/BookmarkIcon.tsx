// src/components/BookmarkIcon.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useDrag, type ConnectDragPreview } from 'react-dnd'; 
import { getEmptyImage } from 'react-dnd-html5-backend';
import { type Bookmark } from '../store/useBookmarkStore';

interface BookmarkIconProps {
  bookmark: Bookmark;
  onRemove: (id: string) => void;
}

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({ bookmark, onRemove }) => {
  const [imgError, setImgError] = useState(false);
  const FALLBACK_ICON_URL = 'https://s2.googleusercontent.com/s2/favicons?domain=default&sz=64';

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

  // useDrag hook: returns drag and preview connectors
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'BOOKMARK_ICON',
    // The item data passed to the TrashCan
    item: { 
      id: bookmark.id,
      url: bookmark.url,
      title: bookmark.title,
      iconUrl: bookmark.iconUrl,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [bookmark]); // Dependency on the entire bookmark object

  // 1. DISABLE BROWSER GHOST: Essential for preventing the scaling/glitch.
  // This tells the browser to drag a transparent image, requiring the Custom Drag Layer to draw the icon.
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  // 2. Drag Ref: Connects the drag source to the outer div
  const bookmarkIconRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
        drag(node);
    }
  }, [drag]);

  return (
    <div 
      ref={bookmarkIconRef}
      // MODIFIED:
      // 1. Removed hover:bg-gray-100 to eliminate the gray box on hover.
      // 2. Maintained p-2 for spacing.
      // 3. Maintained h-28 w-fit for stable layout.
      className="flex flex-col items-center cursor-pointer p-2 rounded-lg group relative h-28 w-fit"
      onClick={handleIconClick}
      title={bookmark.url}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: isDragging ? 'grabbing' : 'pointer', transition: 'opacity 0.2s' }} 
      draggable="false"
    >
      {/* Icon Image Container */}
      <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden shrink-0">
        <img
          src={imgError ? FALLBACK_ICON_URL : bookmark.iconUrl}
          alt={`${bookmark.title} icon`}
          onError={handleError}
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Title */}
      <p className="mt-1 text-xs text-center text-gray-700 max-w-[60px] truncate flex-grow-0">
        {bookmark.title}
      </p>

      {/* Remove Button - REMAINS HIDDEN BY DEFAULT, VISIBLE ONLY ON GROUP-HOVER */}
      <button
        onClick={(e) => {
          e.stopPropagation(); 
          onRemove(bookmark.id);
        }}
        // The opacity-0 and group-hover:opacity-100 classes achieve the desired "show on hover" effect.
        className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-black rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center -translate-y-1 translate-x-1"
        title="Remove Bookmark (Click)"
      >
        &times;
      </button>
    </div>
  );
};