import axios from 'axios';
import { useAuth } from '../contexts/AuthContext.jsx';

export const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export const createApi = (token) => {
  const instance = axios.create({ baseURL: `${apiBase}/api` });
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return instance;
}; 