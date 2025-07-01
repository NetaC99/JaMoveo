import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { createApi } from '../utils/api.js';

export default function LivePage() {
  const socket = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const scrollInterval = useRef(null);
  const containerRef = useRef(null);

  // listen for quit event
  useEffect(() => {
    if (!socket) return;
    const onQuit = () => {
      // admins back to admin dashboard, players to main page
      if (user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/player');
      }
    };
    socket.on('quit', onQuit);
    return () => socket.off('quit', onQuit);
  }, [socket, navigate, user]);

  // listen for current song because we are new here
  useEffect(() => {
    if (!socket) return;
    const onSong = (info) => {
      fetchSong(info.id);
    };
    socket.on('currentSong', onSong);
    return () => socket.off('currentSong', onSong);
  }, [socket]);

  const fetchSong = async (id) => {
    try {
      const api = createApi();
      const { data } = await api.get(`/songs/${id}`);
      setSong(data);
    } catch (err) {
      console.error(err);
      navigate('/player');
    }
  };

  // when component mounts, request current song from socket if not present
  useEffect(() => {
    if (socket && !song) {
      socket.emit('requestCurrent'); // not implemented, but server will send automatically on connect
    }
  }, [socket, song]);

  // scrolling
  useEffect(() => {
    if (scrolling) {
      scrollInterval.current = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop += 1;
        }
      }, 30);
    } else if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
    return () => clearInterval(scrollInterval.current);
  }, [scrolling]);

  // Detect if song contains Hebrew characters to set RTL direction
  const isHebrew = useMemo(() => {
    if (!song) return false;
    const hebrewRegex = /[\u0590-\u05FF]/;
    return song.lines.some((lineGroup) =>
      lineGroup.some((word) => hebrewRegex.test(word.lyrics))
    );
  }, [song]);

  if (!song) {
    return (
      <div className="flex items-center justify-center h-full">
        <h1 className="text-2xl">Loading song...</h1>
      </div>
    );
  }

  const showChords = user.instrument !== 'vocals';

  const toggleScroll = () => setScrolling((s) => !s);

  const handleQuit = () => socket.emit('quitSession');

  return (
    <div className="h-full flex flex-col">
      <header
        className="p-4 bg-gray-900 text-center text-2xl font-bold"
        dir={isHebrew ? 'rtl' : 'ltr'}
      >
        {song.title} - {song.artist}
      </header>
      <div
        ref={containerRef}
        className={`flex-1 overflow-y-auto p-6 space-y-4 text-3xl leading-snug ${
          isHebrew ? 'text-right' : ''
        }`}
        dir={isHebrew ? 'rtl' : 'ltr'}
      >
        {song.lines.map((lineGroup, idx) => (
          <p key={idx}>
            {lineGroup.map((word, wIdx) => (
              <span key={wIdx} className="mr-1">
                {showChords && word.chords && (
                  <span className="text-green-400 mr-1">[{word.chords}]</span>
                )}
                {word.lyrics}
              </span>
            ))}
          </p>
        ))}
      </div>
      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 rounded-full p-4 text-xl"
        onClick={toggleScroll}
      >
        {scrolling ? 'Stop' : 'Auto'}
      </button>
      {user.isAdmin && (
        <button
          className="fixed bottom-6 left-6 bg-red-600 hover:bg-red-700 rounded-full p-4 text-xl"
          onClick={handleQuit}
        >
          Quit
        </button>
      )}
    </div>
  );
} 