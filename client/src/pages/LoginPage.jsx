import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createApi } from '../utils/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = createApi();
      const { data } = await api.post('/auth/login', { username, password });
      login(data.token);
      if (data.isAdmin) navigate('/admin');
      else navigate('/player');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow w-80">
        <h1 className="text-2xl mb-4 text-center">Login</h1>
        {error && <p className="text-red-400 mb-2">{error}</p>}
        <input
          className="w-full p-2 mb-3 text-black"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 text-black"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 hover:bg-blue-600 w-full py-2">Login</button>
        <div className="mt-4 text-center text-sm">
          No account? <Link to="/signup" className="text-blue-400 underline">Signup</Link>
        </div>
      </form>
    </div>
  );
} 