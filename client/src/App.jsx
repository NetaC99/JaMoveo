import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { SocketProvider } from './contexts/SocketContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AdminSignup from './pages/AdminSignup.jsx';
import PlayerMain from './pages/PlayerMain.jsx';
import AdminMain from './pages/AdminMain.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import LivePage from './pages/LivePage.jsx';

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/admin-signup" element={<AdminSignup />} />

          {/* Player flow */}
          <Route
            path="/player"
            element={
              <PrivateRoute>
                <PlayerMain />
              </PrivateRoute>
            }
          />

          {/* Admin flow */}
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminMain />
                </AdminRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <ResultsPage />
                </AdminRoute>
              </PrivateRoute>
            }
          />

          {/* Live page for everyone */}
          <Route
            path="/live"
            element={
              <PrivateRoute>
                <LivePage />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/player" replace />} />
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
} 