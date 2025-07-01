import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createApi } from '../utils/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const instruments = ['drums', 'guitar', 'bass', 'saxophone', 'keyboards', 'vocals'];

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [instrument, setInstrument] = useState('guitar');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const api = createApi();
      const { data } = await api.post('/auth/signup', { username, password, instrument });
      login(data.token);
      navigate('/player');
    } catch (err) {
      console.error(err);
      setError('Signup failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow w-80">
        <h1 className="text-2xl mb-4 text-center">Signup</h1>
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
        <select
          className="w-full p-2 mb-3 text-black"
          value={instrument}
          onChange={(e) => setInstrument(e.target.value)}
        >
          {instruments.map((inst) => (
            <option key={inst} value={inst}>
              {inst}
            </option>
          ))}
        </select>
        <button className="bg-green-500 hover:bg-green-600 w-full py-2">Signup</button>
        <div className="mt-4 text-center text-sm">
          Have an account? <Link to="/login" className="text-blue-400 underline">Login</Link>
        </div>
      </form>
    </div>
  );
} 