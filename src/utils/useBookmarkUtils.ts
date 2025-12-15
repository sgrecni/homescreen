import { useCallback } from 'react';
import { useBookmarkStore } from '../store/useBookmarkStore';

/**
 * Custom hook to handle file-system related actions for bookmarks.
 * @returns {object} Contains functions for handling import and export operations.
 */
export const useBookmarkUtils = () => {
  // Get the store actions using useBookmarkStore.getState() to avoid unnecessary component re-renders
  // and ensure we always get the latest functions.
  const { exportBookmarks, importBookmarks } = useBookmarkStore.getState();

  // Logic for handling the export button click
  const handleExport = useCallback(() => {
    exportBookmarks(); // Uses the store's logic
  }, [exportBookmarks]);

  // Logic for handling the import file selection and parsing
  const handleImport = useCallback(() => {
    // This function returns a function which is called when the menu button is clicked.
    return () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'application/json';
        fileInput.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (event.target?.result) {
                        try {
                            const data = JSON.parse(event.target.result as string);
                            importBookmarks(data); // Uses the store's logic
                            alert('Bookmarks imported successfully!');
                        } catch (error) {
                            alert('Error importing bookmarks. File format is invalid.');
                        }
                    }
                };
                reader.readAsText(file);
            }
        };
        fileInput.click();
    };
  }, [importBookmarks]);

  return { handleImport, handleExport };
};