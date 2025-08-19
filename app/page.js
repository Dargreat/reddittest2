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
        throw new Error('Search failed. Please try again.');
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
        Reddit Subreddit Search
      </h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <a 
          href="/api/auth" 
          style={{
            backgroundColor: '#ff4500',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Login with Reddit
        </a>
      </div>

      <form onSubmit={handleSearch} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subreddits..."
            style={{
              flex: 1,
              padding: '0.5rem 1rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.375rem',
              outline: 'none'
            }}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#ff4500',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          borderLeft: '4px solid #ef4444',
          color: '#b91c1c',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p>{error}</p>
        </div>
      )}

      {results.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {results.map((subreddit, index) => (
            <div key={index} style={{
              border: '1px solid #e5e7eb',
              padding: '1rem',
              borderRadius: '0.5rem'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                <a 
                  href={subreddit.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#ff4500', textDecoration: 'none' }}
                >
                  r/{subreddit.name}
                </a>
              </h2>
              <p style={{ color: '#6b7280', margin: '0.5rem 0' }}>
                {subreddit.description}
              </p>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span>👥 {subreddit.subscribers?.toLocaleString() || 'N/A'} subscribers</span>
                <span>🔥 {subreddit.activeUsers?.toLocaleString() || 'N/A'} active</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No results found. Try searching for something like "programming" or "gaming"
          </p>
        )
      )}
    </div>
  );
}
