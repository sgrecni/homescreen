import React, { useState } from 'react'; // Import useRef
import { useBookmarkStore } from '../store/useBookmarkStore';
import { BookmarkIcon } from './BookmarkIcon';
import { BookmarkForm } from './BookmarkForm';
import { TrashCan } from './Trashcan';
import { DragLayer } from './DragLayer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useBookmarkUtils } from '../utils/useBookmarkUtils';
import { SideMenu } from './SideMenu';

// --- (No changes to the component function definition) ---
export const HomeScreen: React.FC = () => {
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);

  // 🔑 FIX: Get the import/export functions from the new utility hook
  const { handleImport, handleExport } = useBookmarkUtils();

  // State for menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  // Define the common styling for the icon content container
  const ICON_CONTENT_CLASSES = "w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden shrink-0";

  // Define the common styling for the entire icon wrapper
  const ICON_WRAPPER_CLASSES = "flex flex-col items-center cursor-pointer p-2 rounded-lg group relative h-28 w-fit hover:bg-gray-100";

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Include the Custom Drag Layer and Trash Can */}
      <DragLayer />

      <div className="min-h-screen bg-white flex flex-col items-center py-8">
        {/* Header - Menu Button */}
        {/* <header className="mb-10 w-full flex justify-start">
          <h1 className="text-4xl font-extrabold text-gray-900">Dashboard</h1>
        </header> */}

        {/* Icon Grid Wrapper */}
        <div className="w-full transition-all duration-300">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 w-full justify-items-center">
            {/* 🔑 FIX: The new Menu Button as the FIRST Grid Item */}
            <div 
              onClick={toggleMenu}
              className={ICON_WRAPPER_CLASSES}
              title="Open Menu"
            >
                <div className={ICON_CONTENT_CLASSES}>
                    {/* SVG Icon (Styling the SVG for visibility) */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </div>

                {/* Title */}
                <p className="mt-1 text-xs text-center text-gray-700 max-w-[60px] truncate flex-grow-0">
                  Menu
                </p>
                {/* Note: No remove button needed here */}
            </div>

            {/* Existing Bookmark Icons */}
            {bookmarks.map((bookmark) => (
              <BookmarkIcon 
                key={bookmark.id} 
                bookmark={bookmark} 
                onRemove={removeBookmark} 
              />
            ))}
            
          </div>
        </div>

        {/* Fixed Form at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 border-t-2 border-gray-200 shadow-xl z-10">
          <div className="max-w-2xl mx-auto">
            <BookmarkForm />
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            Note: Favicons are fetched using the Google S2 proxy service.
          </p>
          <TrashCan />
        </div>

      </div>

      {/* RENDER THE MENU COMPONENT (props remain the same) */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onExport={handleExport}
        onImport={handleImport}
      />

    </DndProvider>
  );
};