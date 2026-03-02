// src/components/HomeScreen.tsx
import React, { useState } from 'react';
import { useBookmarkStore } from '../store/useBookmarkStore';
import { BookmarkIcon } from './BookmarkIcon';
import { BookmarkForm } from './BookmarkForm';
import { TrashCan } from './Trashcan';
import { DragLayer } from './DragLayer';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useBookmarkUtils } from '../utils/useBookmarkUtils';
import { SideMenu } from './SideMenu';

interface HomeScreenProps {
  onOpenAbout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenAbout }) => {
  const bookmarks = useBookmarkStore((state) => state.bookmarks);

  // Utility hook for Import/Export logic
  const { handleImport, handleExport } = useBookmarkUtils();

  // State for menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Styles to match BookmarkIcon exactly for a consistent grid
  const ICON_CONTENT_CLASSES = "w-14 h-14 flex items-center justify-center bg-white rounded-xl shadow-md border-2 border-gray-100 overflow-hidden shrink-0";
  const ICON_WRAPPER_CLASSES = "flex flex-col items-center cursor-pointer p-2 rounded-lg group relative h-28 w-24 transition-all hover:bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400";

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Custom Drag Layer for crisp desktop dragging */}
      <DragLayer />

      <div className="min-h-screen bg-white flex flex-col items-center pt-8 pb-32">
        {/* Icon Grid */}
        <div className="w-full max-w-7xl px-4 transition-all duration-300">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-y-8 gap-x-4 w-full justify-items-center">
            
            {/* ☰ The Menu Button as a Grid Tile */}
            <div 
              onClick={toggleMenu}
              className={ICON_WRAPPER_CLASSES}
              title="Open Menu"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
            >
              <div className={ICON_CONTENT_CLASSES}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <p className="mt-1 text-xs text-center text-gray-700 font-medium">
                Menu
              </p>
            </div>

            {/* List of Bookmark Icons */}
            {bookmarks.map((bookmark) => (
              <BookmarkIcon 
                key={bookmark.id} 
                bookmark={bookmark} 
              />
            ))}
            
          </div>
        </div>

        {/* Floating Toolbar & Trash Area */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50/90 backdrop-blur-sm border-t border-gray-200 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.05)] z-10">
          <div className="max-w-2xl mx-auto">
            <BookmarkForm />
            <p className="mt-3 text-center text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
              Power User: Click title or press F2 to rename
            </p>
          </div>
          
          {/* Trash Can sits on top of this bar but is absolutely positioned within it or the screen */}
          <TrashCan />
        </div>
      </div>

      {/* Persistent Side Menu */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onExport={handleExport}
        onImport={handleImport}
        onAboutClick={onOpenAbout}
      />
    </DndProvider>
  );
};