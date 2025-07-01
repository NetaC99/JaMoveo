import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext.jsx';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (token) {
      const s = io(import.meta.env.VITE_API_BASE || 'http://localhost:4000', {
        path: '/socket.io',
        transports: ['websocket'],
        auth: { token },
      });
      setSocket(s);
      return () => {
        s.disconnect();
        setSocket(null);
      };
    }
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext); 