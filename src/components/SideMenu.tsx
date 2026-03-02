import React from 'react';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  // Simplified the type for standard usage
  // onImport: () => void;
  onImport: () => () => void;
  onAboutClick: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onExport, onImport, onAboutClick }) => {
  return (
    <>
      {/* Transparent Overlay 
        Captures clicks outside the menu to close it without darkening the screen.
      */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={onClose}
        />
      )}

      {/* Side Menu Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-100
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}` 
        }
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-800 rounded flex items-center justify-center text-white text-[10px] font-bold">B</div>
              <h2 className="text-lg font-bold text-gray-800 tracking-tight">Dashboard</h2>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-900 text-2xl transition-colors focus:outline-none"
            >
              &times;
            </button>
          </div>
          
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => { onImport()(); onClose(); }}
                className="w-full text-left py-3 px-4 rounded-xl bg-blue-800 hover:bg-blue-600 text-white flex items-center gap-3 transition-colors font-medium"
              >
                <span className="text-xl">📥</span> Import Bookmarks
              </button>
            </li>

            <li>
              <button 
                onClick={() => { onExport(); onClose(); }}
                className="w-full text-left py-3 px-4 rounded-xl bg-blue-800 hover:bg-blue-600 text-white flex items-center gap-3 transition-colors font-medium"
              >
                <span className="text-xl">📤</span> Export Bookmarks
              </button>
            </li>

            <li className="pt-4 mt-4 border-t border-gray-50">
              <button
                onClick={onAboutClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all rounded-lg group"
              >
                <span className="font-medium">About Domus</span>
              </button>
            </li>
          </ul>
        </div>
        
        <div className="absolute bottom-6 left-6 right-6">
           <p className="text-[10px] text-gray-400 uppercase tracking-tighter text-center">
             Local Storage Mode Active
           </p>
        </div>
      </div>
    </>
  );
};