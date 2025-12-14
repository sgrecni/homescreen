import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  iconUrl: string; // The URL for the favicon
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (id: string) => void;
  // NEW ACTION: Function to replace the entire bookmarks array
  setBookmarks: (newBookmarks: Bookmark[]) => void; 
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarks: [],
      
      addBookmark: (bookmark) =>
        set((state) => {
          if (state.bookmarks.some(b => b.url === bookmark.url)) {
            console.warn('Bookmark already exists for this URL.');
            return state;
          }
          return {
            bookmarks: [...state.bookmarks, bookmark],
          };
        }),

      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      // NEW ACTION IMPLEMENTATION
      setBookmarks: (newBookmarks) => set({ bookmarks: newBookmarks }),
    }),
    {
      name: 'bookmark-storage', 
      storage: createJSONStorage(() => localStorage),
    }
  )
);