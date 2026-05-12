const express = require('express');
const router = express.Router();
const axios = require('axios');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const GENRE_MAP = {
  Action: 28, Comedy: 35, Drama: 18, Horror: 27,
  Romance: 10749, Thriller: 53, Animation: 16,
  'Sci-Fi': 878, Documentary: 99, Fantasy: 14
};

router.get('/', authMiddleware, async (req, res) => {
  const user_id = req.user.user_id;

  try {
    const userResult = await pool.query(
      'SELECT pref_mood FROM users WHERE user_id = $1',
      [user_id]
    );
    const genreResult = await pool.query(
      'SELECT genre FROM user_genres WHERE user_id = $1',
      [user_id]
    );

    const pref_mood = userResult.rows[0]?.pref_mood || 'movie';
    const genres = genreResult.rows.map(r => r.genre);
    const genreIds = genres.map(g => GENRE_MAP[g]).filter(Boolean).join(',');
    const mediaType = pref_mood === 'series' ? 'tv' : 'movie';

    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/${mediaType}`,
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          with_genres: genreIds || undefined,
          sort_by: 'popularity.desc',
          language: 'id-ID',
          page: 1
        }
      }
    );

    res.json({
      media_type: mediaType,
      results: response.data.results.slice(0, 10)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;