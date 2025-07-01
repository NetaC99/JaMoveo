import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Song from './models/Song.js';
import connectDB from './config/db.js';

dotenv.config({ path: '.env' });

const songsDir = path.resolve('songs'); // server/songs

// Read all json files in songs directory
const files = fs
  .readdirSync(songsDir)
  .filter((f) => f.toLowerCase().endsWith('.json'));

(async () => {
  try {
    await connectDB();
    for (const file of files) {
      const filePath = path.join(songsDir, file);
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw);
      let lines, artist = 'Unknown', image = '';
      if (Array.isArray(parsed)) {
        lines = parsed;
      } else {
        lines = parsed.lines;
        artist = parsed.artist || 'Unknown';
        image = parsed.image || '';
      }
      const title = path.parse(file).name.replace(/_/g, ' ');
      await Song.findOneAndUpdate(
        { title },
        {
          title,
          artist,
          image,
          lines,
        },
        { upsert: true, new: true }
      );
      console.log(`Seeded ${title}`);
    }
    console.log('Seeding done');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})(); 