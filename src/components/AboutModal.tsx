import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800">About Domus</h2>
          
          {/* 🔑 The Inline SVG Close Button */}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
            aria-label="Close modal"
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 max-h-[70vh] overflow-y-auto space-y-6 text-slate-600">
          <p>
            Welcome to <span className="font-semibold text-blue-600">Domus</span>, 
            a personalized starting point for your web experience.
          </p>
          
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Navigation Tips</h3>
            <ul className="space-y-2 text-sm">
              <li>• Drag icons to reorganize your grid.</li>
              <li>• Click the label to rename.</li>
              <li>• Use <strong>F2</strong> to quickly rename a focused icon.</li>
            </ul>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <a 
              href="https://github.com/sgrecni/homescreen"
              className="inline-block px-4 py-2 rounded-md bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
            >
              Project GitHub
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};