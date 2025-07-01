import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext.jsx';

export default function PlayerMain() {
  const socket = useSocket();
  const navigate = useNavigate();
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    if (!socket) return;

    const handleSong = () => {
      navigate('/live');
    };

    const handleQuit = () => {
      setWaiting(true);
    };

    socket.on('currentSong', handleSong);
    socket.on('quit', handleQuit);

    return () => {
      socket.off('currentSong', handleSong);
      socket.off('quit', handleQuit);
    };
  }, [socket, navigate]);

  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-4xl">Waiting for next song...</h1>
    </div>
  );
} 