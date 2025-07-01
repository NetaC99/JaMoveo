import express from 'express';
import Song from '../models/Song.js';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/songs/search?q=query
router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const regex = new RegExp(q, 'i');
  const songs = await Song.find({ title: regex }).limit(20);
  res.json(
    songs.map((s) => ({
      id: s._id,
      title: s.title,
      artist: s.artist,
      image: s.image,
    }))
  );
});

// GET /api/songs/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({});
  const song = await Song.findById(id);
  if (!song) return res.status(404).json({});
  res.json(song);
});

export default router; 