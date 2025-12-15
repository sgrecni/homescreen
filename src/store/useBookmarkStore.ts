import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

// --- Interfaces ---

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  iconUrl: string;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (url: string, title: string, iconUrl: string) => void;
  removeBookmark: (id: string) => void;
  moveBookmark: (dragId: string, hoverId: string) => void;
  exportBookmarks: () => void;
  importBookmarks: (data: Bookmark[]) => void;
}

// --- Local Storage Key ---
const STORAGE_KEY = 'bookmarkDashboardState';

// --- Helper Functions ---

const loadInitialState = (): Bookmark[] => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      // Return a small set of defaults if nothing is in local storage
      return [
        { 
          id: uuidv4(), 
          url: 'https://www.google.com', 
          title: 'Google', 
          iconUrl: 'https://s2.googleusercontent.com/s2/favicons?domain=google.com&sz=64' 
        },
        { 
          id: uuidv4(), 
          url: 'https://react.dev/', 
          title: 'React', 
          iconUrl: 'https://s2.googleusercontent.com/s2/favicons?domain=react.dev&sz=64' 
        },
      ];
    }
    const parsedData = JSON.parse(serializedState);
    // Basic validation to ensure we're loading an array of bookmarks
    if (Array.isArray(parsedData)) {
        return parsedData;
    }
    return [];
  } catch (e) {
    console.error("Could not load state from localStorage", e);
    return [];
  }
};

const saveState = (state: Bookmark[]) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (e) {
    console.error("Could not save state to localStorage", e);
  }
};


// --- Zustand Store Definition ---

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  // Load bookmarks on initialization
  bookmarks: loadInitialState(),

  // Add a new bookmark
  addBookmark: (url, title, iconUrl) =>
    set((state) => {
      const newBookmark: Bookmark = {
        id: uuidv4(),
        url,
        title,
        iconUrl,
      };
      const newBookmarks = [...state.bookmarks, newBookmark];
      saveState(newBookmarks);
      return { bookmarks: newBookmarks };
    }),

  // Remove a bookmark by ID
  removeBookmark: (id) =>
    set((state) => {
      const newBookmarks = state.bookmarks.filter((b) => b.id !== id);
      saveState(newBookmarks);
      return { bookmarks: newBookmarks };
    }),

  // Move a bookmark (used for drag-and-drop reordering)
  moveBookmark: (dragId: string, hoverId: string) =>
    set((state) => {
      const dragIndex = state.bookmarks.findIndex(b => b.id === dragId);
      const hoverIndex = state.bookmarks.findIndex(b => b.id === hoverId);

      if (dragIndex === -1 || hoverIndex === -1) return state;

      const newBookmarks = [...state.bookmarks];
      
      // Remove the dragged item and capture it
      const [draggedItem] = newBookmarks.splice(dragIndex, 1);
      
      // Insert the dragged item at the hover position
      newBookmarks.splice(hoverIndex, 0, draggedItem);

      saveState(newBookmarks);
      return { bookmarks: newBookmarks };
    }),

  // Export all bookmarks as a JSON file download
  exportBookmarks: () => {
    const currentState = useBookmarkStore.getState();
    const dataStr = JSON.stringify(currentState.bookmarks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileName = 'bookmarks.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    linkElement.remove();
  },

  // Import bookmarks from a JSON array
  importBookmarks: (data: Bookmark[]) =>
    set(() => {
        // Simple check to ensure imported data has necessary fields
        const validBookmarks = data.filter(b => b.id && b.url && b.title);
        saveState(validBookmarks);
        return { bookmarks: validBookmarks };
    }),
}));