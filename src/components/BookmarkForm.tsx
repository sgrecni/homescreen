// src/components/BookmarkForm.tsx
import React, { useState } from 'react';
import { useBookmarkStore } from '../store/useBookmarkStore';
import { useFaviconFetch } from '../hooks/useFaviconFetch';

export const BookmarkForm: React.FC = () => {
  const [inputUrl, setInputUrl] = useState('');
  const [error, setError] = useState('');
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const { getFaviconUrl, extractDomain } = useFaviconFetch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!inputUrl.trim()) {
      setError('Please enter a URL.');
      return;
    }

    try {
      // 1. Generate the icon URL
      const iconUrl = getFaviconUrl(inputUrl);
      if (!iconUrl) {
         setError('Invalid URL format.');
         return;
      }

      // 2. Extract a simple title (e.g., the domain name)
      const title = extractDomain(inputUrl).replace(/\..*$/, ''); // "google" from "google.com"

      // 3. Create and add the new bookmark
      addBookmark({
        id: Date.now().toString(), // Simple unique ID
        url: inputUrl,
        title: title.charAt(0).toUpperCase() + title.slice(1), // Capitalize first letter
        iconUrl: iconUrl,
      });

      // 4. Reset form
      setInputUrl('');
    } catch (err) {
      setError('Could not process the URL. Ensure it is a valid web address.');
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-3 text-gray-800">Add New Bookmark</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <input
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Paste URL (e.g., https://google.com)"
          className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-150"
        >
          Grab Icon & Save
        </button>
      </form>
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
};
