import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import songRoutes from './routes/songs.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import Song from './models/Song.js';

dotenv.config();

await connectDB();

// load song JSON files from server/songs directory
const loadSongs = async () => {
  try {
    const songsDir = path.resolve('songs');
    if (!fs.existsSync(songsDir)) return;
    const files = fs.readdirSync(songsDir).filter((f) => f.toLowerCase().endsWith('.json'));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(songsDir, file), 'utf-8');
      const parsed = JSON.parse(raw);
      let lines, artist = 'Unknown', image = '';
      if (Array.isArray(parsed)) {
        lines = parsed;
      } else {
        lines = parsed.lines;
        artist = parsed.artist || 'Unknown';
        image = parsed.image || '';
      }
      const title = path.parse(file).name.replace(/_/g, ' ');// hey_jude -> hey jude
      await Song.findOneAndUpdate(
        { title },
        { title, artist, image, lines },
        { upsert: true }
      );
    }
    console.log(`Loaded ${files.length} song files`);
  } catch (err) {
    console.error('Failed loading songs', err);
  }
};

await loadSongs();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('JaMoveo API running'));

app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let currentSong = null;

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('No token'));
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  console.log('User connected', socket.user.username);
  // send current song if exists
  if (currentSong) {
    socket.emit('currentSong', currentSong);
  }

  socket.on('songSelected', (songInfo) => {
    // only admin can send this
    if (!socket.user.isAdmin) return;
    currentSong = songInfo; // { id, title, artist }
    console.log('Song selected', songInfo.title);
    io.emit('currentSong', currentSong);
  });

  socket.on('quitSession', () => {
    if (!socket.user.isAdmin) return;
    currentSong = null;
    io.emit('quit');
  });

  socket.on('requestCurrent', () => {
    if (currentSong) socket.emit('currentSong', currentSong);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.user.username);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 