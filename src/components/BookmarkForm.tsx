// BookmarkForm.tsx
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
  const getAutoTitle = (urlInput: string): string => {
    try {
      // 1. Ensure the URL has a protocol for the URL constructor to work
      let formattedUrl = urlInput.trim();
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'https://' + formattedUrl;
      }

      const url = new URL(formattedUrl);
      
      // 2. Get hostname (e.g., "gemini.google.com" or "www.yahoo.com")
      let hostname = url.hostname;

      // 3. Remove 'www.' if present
      hostname = hostname.replace(/^www\./i, '');

      // 4. Split by dots and pick the most relevant part
      // For "yahoo.com" -> ["yahoo", "com"] -> "yahoo"
      // For "gemini.google.com" -> ["gemini", "google", "com"] -> "gemini"
      const parts = hostname.split('.');
      
      // Logic: If there's more than one part, take the first one 
      // unless it's just a two-part domain (like "google.com")
      const brandName = parts.length > 1 ? parts[0] : hostname;

      // 5. Capitalize the first letter
      return brandName.charAt(0).toUpperCase() + brandName.slice(1);
    } catch (e) {
      return ''; // Fallback if URL is totally mangled
    }
  };
  // ---------------------------

  // const handleUrlBlur = () => {
  //   // Only auto-fill if the user hasn't already typed a custom title
  //   if (url && !title) {
  //     const autoTitle = getAutoTitle(url);
  //     setTitle(autoTitle);
  //   }
  // }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let finalTitle = title.trim();
  
    if (!finalTitle && url) {
      finalTitle = getAutoTitle(url);
    }

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
    addBookmark(correctedUrl, finalTitle.trim(), finalIconUrl);

    // 4. Reset Form
    setUrl('');
    setTitle('');
  };

  return (
    // ... (rest of the component structure remains the same) ...
    <form onSubmit={handleSubmit} className="flex space-x-2 w-full max-w-4xl mx-auto">
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL (e.g., yahoo.com)"
        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-1/4 p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95 transition-all duration-150"
      >
        Add
      </button>
    </form>
  );
};