import React from 'react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onImport: () => () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onExport, onImport }) => {

  const handleAboutClick = () => {
    alert("Bookmark Dashboard v1.0\n\nBuilt with React, TypeScript, and Tailwind CSS.");
    onClose();
  };

  return (
    <>
      {/* Overlay 
        - REMOVED: bg-black bg-opacity-50 (Now transparent)
        - KILLED: pointer-events-none when closed to prevent blocking clicks 
      */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={onClose}
        />
      )}

      {/* Side Menu Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}` 
          // Changed: left-0, and -translate-x-full (moves left to hide)
        }
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 text-2xl focus:outline-none"
            >
              &times;
            </button>
          </div>
          
          <ul className="space-y-4">
            {/* Import Button */}
            <li>
              <button 
                onClick={() => { onImport()(); onClose(); }}
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-2"
              >
                <span>📥</span> Import Bookmarks
              </button>
            </li>

            {/* Export Button */}
            <li>
              <button 
                onClick={() => { onExport(); onClose(); }}
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-2"
              >
                <span>📤</span> Export Bookmarks
              </button>
            </li>

            {/* About Option */}
            <li>
              <button 
                onClick={handleAboutClick}
                className="w-full text-left py-2 px-3 rounded hover:bg-gray-100 text-gray-700 flex items-center gap-2"
              >
                <span>ℹ️</span> About
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};