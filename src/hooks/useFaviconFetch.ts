// src/hooks/useFaviconFetch.ts
/**
 * Custom hook to generate the favicon URL for a given website URL.
 * NOTE: We are using the Google S2 Favicon service for this demo 
 * to reliably fetch favicons without CORS issues. 
 * The base format is: https://s2.googleusercontent.com/s2/favicons?domain=<url>
 */
export const useFaviconFetch = () => {
  // Helper function to extract the root domain from a full URL
  const extractDomain = (url: string): string => {
    try {
      // Add a protocol if missing to ensure new URL works
      const standardizedUrl = url.startsWith('http') ? url : `https://${url}`;
      const hostname = new URL(standardizedUrl).hostname;
      return hostname.startsWith('www.') ? hostname.substring(4) : hostname;
    } catch (e) {
      // Fallback for invalid URLs
      return ''; 
    }
  };

  const getFaviconUrl = (url: string): string => {
    const domain = extractDomain(url);
    if (!domain) return ''; 

    // Google S2 Favicon Service URL
    return `https://s2.googleusercontent.com/s2/favicons?domain=${domain}&sz=64`;
  };

  return { getFaviconUrl, extractDomain };
};
