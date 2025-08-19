'use client';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Search failed');
      }
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Reddit Subreddit Search</h1>
      
      <div className="mb-8">
        <a 
          href="/api/auth" 
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
        >
          Login with Reddit
        </a>
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subreddits..."
            className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((subreddit, index) => (
            <div key={index} className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold">
                <a 
                  href={subreddit.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:underline"
                >
                  r/{subreddit.name}
                </a>
              </h2>
              <p className="text-gray-600 mt-2">{subreddit.description}</p>
              <div className="flex gap-4 mt-3 text-sm text-gray-500">
                <span>👥 {subreddit.subscribers?.toLocaleString() || 'N/A'} subscribers</span>
                <span>🔥 {subreddit.activeUsers?.toLocaleString() || 'N/A'} active</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <p className="text-gray-500 text-center py-8">
            No results found. Try searching for something like "programming" or "gaming"
          </p>
        )
      )}
    </div>
  );
}