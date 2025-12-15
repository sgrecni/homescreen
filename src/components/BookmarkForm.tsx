import React, { useState, type FormEvent } from 'react';
import { useBookmarkStore } from '../store/useBookmarkStore';

export const BookmarkForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  
  const FALLBACK_ICON_URL = 'https://s2.googleusercontent.com/s2/favicons?domain=default&sz=64';

  // --- NEW UTILITY FUNCTION ---
  const getHostnameFromUrl = (inputUrl: string): string => {
    // 1. Remove protocol (http, https) and common prefixes (www.)
    let hostname = inputUrl.replace(/^(https?:\/\/)?(www\.)?/, '');
    
    // 2. Remove any path or query string that follows the domain name (e.g., /path?query)
    hostname = hostname.split('/')[0].split('?')[0];

    return hostname.trim();
  };
  // ---------------------------

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    let correctedUrl = url.trim();
    const lowerCaseUrl = correctedUrl.toLowerCase();
    let finalIconUrl = FALLBACK_ICON_URL;
    
    // 1. Protocol Correction (Must have a protocol to be clickable)
    if (!lowerCaseUrl.startsWith('http://') && !lowerCaseUrl.startsWith('https://')) {
      correctedUrl = `http://${correctedUrl}`; 
    }

    // 2. Hostname Extraction using the new robust utility function
    const hostname = getHostnameFromUrl(correctedUrl);

    if (hostname) {
        // Construct the favicon URL using the cleanly extracted hostname
        finalIconUrl = `https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=64`;
    } 
    // If hostname is empty, finalIconUrl remains FALLBACK_ICON_URL

    // 3. Add to Store
    addBookmark(correctedUrl, title.trim(), finalIconUrl);

    // 4. Reset Form
    setUrl('');
    setTitle('');
  };

  return (
    // ... (rest of the component structure remains the same) ...
    <form onSubmit={handleSubmit} className="flex space-x-2 w-full max-w-4xl mx-auto">
      <input
        type="text"
        placeholder="Enter URL (e.g., example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150"
      >
        Add
      </button>
    </form>
  );
};