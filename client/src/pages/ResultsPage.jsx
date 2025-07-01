import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createApi } from '../utils/api.js';
import { useSocket } from '../contexts/SocketContext.jsx';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();
  const [results, setResults] = useState([]);

  const query = new URLSearchParams(location.search).get('q') || '';

  useEffect(() => {
    const api = createApi();
    api.get(`/songs/search?q=${encodeURIComponent(query)}`).then(({ data }) => setResults(data));
  }, [query]);

  const selectSong = (song) => {
    socket.emit('songSelected', song);
    navigate('/live');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Results for "{query}"</h1>
      {results.length === 0 && <p>No songs found.</p>}
      <ul className="space-y-4">
        {results.map((song) => (
          <li
            key={song.id}
            className="cursor-pointer p-4 bg-gray-700 rounded hover:bg-gray-600 flex items-center space-x-4"
            onClick={() => selectSong(song)}
          >
            {song.image && (
              <img
                src={song.image}
                alt={song.title}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-xl">{song.title}</h2>
              <p className="text-sm text-gray-300">{song.artist}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
} 