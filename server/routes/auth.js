import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      instrument: user.instrument,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
};

router.post('/signup', async (req, res) => {
  try {
    const { username, password, instrument } = req.body;
    if (!username || !password || !instrument) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const user = await User.create({
      username,
      passwordHash: password,
      instrument,
      isAdmin: false,
    });
    const token = generateToken(user);
    res.status(201).json({ token, username: user.username, instrument: user.instrument, isAdmin: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/admin-signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing fields' });
    }
    const exists = await User.findOne({ isAdmin: true });
    if (exists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }
    const user = await User.create({
      username,
      passwordHash: password,
      instrument: 'vocals', // default instrument for admin
      isAdmin: true,
    });
    const token = generateToken(user);
    res.status(201).json({ token, username: user.username, instrument: user.instrument, isAdmin: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.matchPassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, username: user.username, instrument: user.instrument, isAdmin: user.isAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 