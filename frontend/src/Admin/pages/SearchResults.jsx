import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';

export default function SearchResults() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const q = params.get('q') || '';

    const FetchSearchResults = async (searchQuery) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/search/`, {
        params: { q: searchQuery },
        withCredentials: true
      })
      setData(response.data);
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 2) invoke it in useEffect whenever `q` changes
  useEffect(() => {
    if (!q.trim()) return
    FetchSearchResults(q)
  }, [q])

  return (
    <>
      <Dashboard >
         <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Results for “{q}”</h1>

      {loading && <p>Loading…</p>}
      {error   && <p className="text-red-500">Error: {error}</p>}

      {data && (
        <>
          {data.products?.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mt-6">Products</h2>
              <ul className="divide-y">
                {data.products.map(p => (
                  <li key={p.id} className="py-2">
                    <strong>{p.name}</strong> — {p.description} (${p.price})
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* no results */}
          {data.products.length === 0 && (
            <p>No results found.</p>
          )}
        </>
      )}
    </div>
      </Dashboard>
    </>
  )
}
