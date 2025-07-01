import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminMain() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/admin/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <form onSubmit={handleSearch} className="bg-gray-800 p-8 rounded shadow w-96">
        <h1 className="text-2xl mb-4 text-center">Search any song...</h1>
        <input
          className="w-full p-2 mb-4 text-black"
          placeholder="Song title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="bg-blue-500 hover:bg-blue-600 w-full py-2">Search</button>
      </form>
    </div>
  );
} 