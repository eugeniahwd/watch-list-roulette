const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { genres, platforms, pref_mood } = req.body;
  const user_id = req.user.user_id;

  try {
    if (pref_mood) {
      await pool.query(
        'UPDATE users SET pref_mood = $1 WHERE user_id = $2',
        [pref_mood, user_id]
      );
    }

    await pool.query('DELETE FROM user_genres WHERE user_id = $1', [user_id]);
    await pool.query('DELETE FROM user_platforms WHERE user_id = $1', [user_id]);

    if (genres?.length > 0) {
      const genreValues = genres.map((g, i) => `($1, $${i + 2})`).join(', ');
      await pool.query(
        `INSERT INTO user_genres (user_id, genre) VALUES ${genreValues}`,
        [user_id, ...genres]
      );
    }

    if (platforms?.length > 0) {
      const platValues = platforms.map((p, i) => `($1, $${i + 2})`).join(', ');
      await pool.query(
        `INSERT INTO user_platforms (user_id, platform) VALUES ${platValues}`,
        [user_id, ...platforms]
      );
    }

    res.json({ message: 'Preferensi berhasil disimpan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;