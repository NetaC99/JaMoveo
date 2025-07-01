import React, { createContext, useContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const tok = sessionStorage.getItem('token');
    return tok ? jwtDecode(tok) : null;
  });

  const login = (tok) => {
    sessionStorage.setItem('token', tok);
    setToken(tok);
    setUser(jwtDecode(tok));
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // clean the session when window is closed or refreshed
  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem('token');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 