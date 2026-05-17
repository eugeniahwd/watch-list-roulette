const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// GET /api/history
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM watch_history WHERE user_id = $1 ORDER BY watched_at DESC',
      [req.user.user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/history
router.post('/', auth, async (req, res) => {
  const { tmdb_id, media_type = 'movie', rating = 0 } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO watch_history (user_id, tmdb_id, media_type, rating) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.user_id, tmdb_id, media_type, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/history/:tmdb_id
router.delete('/:tmdb_id', auth, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM watch_history WHERE user_id = $1 AND tmdb_id = $2',
      [req.user.user_id, req.params.tmdb_id]
    );
    res.json({ message: 'Dihapus dari history' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;