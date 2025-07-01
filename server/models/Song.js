import mongoose from 'mongoose';

const lineSchema = new mongoose.Schema(
  {
    lyrics: { type: String, required: true },
    chords: { type: String },
  },
  { _id: false }
);

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, text: true },
    artist: { type: String, default: 'Unknown' },
    image: { type: String },
    lines: [[lineSchema]], // array of array of line objects
  },
  { timestamps: true }
);

const Song = mongoose.model('Song', songSchema);

export default Song; 