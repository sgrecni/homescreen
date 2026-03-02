// src/store/useBookmarkStore.ts
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
  // 🔑 Added for the F2/Click-to-rename feature
  updateBookmarkTitle: (id: string, newTitle: string) => void; 
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
    if (Array.isArray(parsedData)) return parsedData;
    return [];
  } catch (e) {
    console.error("Could not load state from localStorage", e);
    return [];
  }
};

const saveState = (state: Bookmark[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Could not save state to localStorage", e);
  }
};

// --- Zustand Store Definition ---

export const useBookmarkStore = create<BookmarkStore>((set) => ({
  bookmarks: loadInitialState(),

  addBookmark: (url, title, iconUrl) =>
    set((state) => {
      const newBookmark: Bookmark = { id: uuidv4(), url, title, iconUrl };
      const newBookmarks = [...state.bookmarks, newBookmark];
      saveState(newBookmarks);
      return { bookmarks: newBookmarks };
    }),

  removeBookmark: (id) =>
    set((state) => {
      const newBookmarks = state.bookmarks.filter((b) => b.id !== id);
      saveState(newBookmarks);
      return { bookmarks: newBookmarks };
    }),

  // 🔑 The logic that powers the new renaming feature
  updateBookmarkTitle: (id, newTitle) =>
    set((state) => {
      const newBookmarks = state.bookmarks.map((b) => 
        b.id === id ? { ...b, title: newTitle } : b
      );
      saveState(newBookmarks);
      return { bookmarks: newBookmarks };
    }),

  moveBookmark: (dragId, hoverId) =>
    set((state) => {
      const dragIndex = state.bookmarks.findIndex(b => b.id === dragId);
      const hoverIndex = state.bookmarks.findIndex(b => b.id === hoverId);
      if (dragIndex === -1 || hoverIndex === -1) return state;

      const newBookmarks = [...state.bookmarks];
      const [draggedItem] = newBookmarks.splice(dragIndex, 1);
      newBookmarks.splice(hoverIndex, 0, draggedItem);

      saveState(newBookmarks);
      return { bookmarks: newBookmarks };
    }),

  exportBookmarks: () => {
    const currentState = useBookmarkStore.getState();
    const dataStr = JSON.stringify(currentState.bookmarks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'bookmarks.json');
    linkElement.click();
    linkElement.remove();
  },

  importBookmarks: (data) =>
    set(() => {
      const validBookmarks = data.filter(b => b.id && b.url && b.title);
      saveState(validBookmarks);
      return { bookmarks: validBookmarks };
    }),
}));