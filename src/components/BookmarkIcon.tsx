// src/components/BookmarkIcon.tsx
import React from 'react';
import { type Bookmark } from '../store/useBookmarkStore';

interface BookmarkIconProps {
  bookmark: Bookmark;
  onRemove: (id: string) => void;
}

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({ bookmark, onRemove }) => {
  // Simple error handling for image loading
  const [imgError, setImgError] = React.useState(false);

  // Fallback icon URL (e.g., a generic globe)
  const FALLBACK_ICON_URL = 'https://s2.googleusercontent.com/s2/favicons?domain=default&sz=64';

  const handleError = () => {
    // Only set error flag if it's not already the fallback
    if (!imgError) {
      setImgError(true);
    }
  };

  const handleIconClick = () => {
    // Simulate opening the bookmark in a new tab
    window.open(bookmark.url, '_blank');
  };

  return (
    <div
      className="flex flex-col items-center cursor-pointer p-2 hover:bg-gray-100 rounded-lg group relative"
      onClick={handleIconClick}
      title={bookmark.url}
    >
      {/* Icon Image */}
      <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden">
        <img
          src={imgError ? FALLBACK_ICON_URL : bookmark.iconUrl}
          alt={`${bookmark.title} icon`}
          onError={handleError}
          className="w-10 h-10 object-contain"
        />
      </div>

      {/* Title */}
      <p className="mt-1 text-xs text-center text-gray-700 max-w-[60px] truncate">
        {bookmark.title}
      </p>

      {/* Remove Button (Appears on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the icon click
          onRemove(bookmark.id);
        }}
        className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center -translate-y-1 translate-x-1"
        title="Remove Bookmark"
      >
        &times;
      </button>
    </div>
  );
};
