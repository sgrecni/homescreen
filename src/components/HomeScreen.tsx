import React, { useRef } from 'react'; // Import useRef
import { useBookmarkStore, type Bookmark } from '../store/useBookmarkStore';
import { BookmarkIcon } from './BookmarkIcon';
import { BookmarkForm } from './BookmarkForm';
import { TrashCan } from './Trashcan';
import { DragLayer } from './DragLayer';

// --- (No changes to the component function definition) ---
export const HomeScreen: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for the hidden file input
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const removeBookmark = useBookmarkStore((state) => state.removeBookmark);
  // Get the new action from the store
  const setBookmarks = useBookmarkStore((state) => state.setBookmarks); 

  // Function to handle the export (from previous step)
  const handleExport = () => {
    // ... (Export logic remains the same) ...
    if (bookmarks.length === 0) {
      alert('There are no bookmarks to export!');
      return;
    }
    const jsonString = JSON.stringify(bookmarks, null, 2); 
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-backup-${new Date().toISOString().slice(0, 10)}.json`; 
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // --- NEW: Function to handle the import ---
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    // Define what happens when the file is successfully read
    reader.onload = (e) => {
      try {
        const jsonContent = e.target?.result as string;
        const importedData: Bookmark[] = JSON.parse(jsonContent);
        
        // Simple validation check: ensure it's an array and has required fields
        if (
          !Array.isArray(importedData) || 
          importedData.some(b => !b.id || !b.url || !b.title || !b.iconUrl)
        ) {
          throw new Error('Invalid or corrupted bookmark file structure.');
        }

        // 1. Load the data into the store
        setBookmarks(importedData);
        alert(`Successfully imported ${importedData.length} bookmarks!`);

      } catch (error) {
        console.error('Bookmark Import Error:', error);
        alert(`Failed to import file: ${error instanceof Error ? error.message : 'File format is incorrect.'}`);
      } finally {
        // Reset the input value so the same file can be selected again if needed
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    
    // Read the file as text
    reader.readAsText(file);
  };
  
  // Function to trigger the hidden file input click
  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-8 pb-32">
      <DragLayer />

      {/* Header and Export/Import Buttons */}
      <header className="text-center mb-10 w-full max-w-4xl">
        <div className="flex justify-center items-center mt-2 space-x-4">
            <p className="text-gray-600">Your icons persist using your local browser storage.  If you clear your cache, your icons will go away.</p>
            
            {/* Import Button */}
            <button
                onClick={triggerImport}
                className="bg-blue-500 text-black text-sm px-3 py-1 rounded-md hover:bg-blue-600 transition duration-150 shadow-md"
            >
                ⬆️ Import Bookmarks
            </button>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                accept=".json" // Only accept JSON files
                onChange={handleImport}
                className="hidden" // Keep the input hidden
            />
            
            {/* Export Button (from previous step) */}
            <button
                onClick={handleExport}
                className="bg-green-500 text-black text-sm px-3 py-1 rounded-md hover:bg-green-600 transition duration-150 shadow-md"
            >
                ⬇️ Export Bookmarks
            </button>
        </div>
      </header>
      
      {/* Icon Grid (Centered) */}
      <div className="flex-grow w-full max-w-4xl">
        {/* ... (Icon rendering logic remains the same) ... */}
        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-4 gap-y-2 p-4">
            {bookmarks.map((bookmark) => (
              <BookmarkIcon 
                key={bookmark.id} 
                bookmark={bookmark} 
                onRemove={removeBookmark} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-500">
            No bookmarks saved yet. Add one below!
          </div>
        )}
      </div>
      <TrashCan />

      {/* Fixed Form at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50 border-t-2 border-gray-200 shadow-xl z-10">
        <div className="max-w-2xl mx-auto">
          <BookmarkForm />
        </div>
        <p className="mt-2 text-center text-xs text-gray-400">
          Note: Favicons are fetched using the Google S2 proxy service.
        </p>
      </div>

    </div>
  );
};