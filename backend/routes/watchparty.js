const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// POST /api/watch-party/create
router.post('/create', auth, async (req, res) => {
  const user_id = req.user.id;

  let code;
  for (let i = 0; i < 5; i++) {
    code = generateCode();
    const exists = await pool.query(
      'SELECT 1 FROM watch_party_sessions WHERE session_code = $1', [code]
    );
    if (exists.rows.length === 0) break;
  }

  try {
    await pool.query(
      'INSERT INTO watch_party_sessions (session_code, created_by) VALUES ($1, $2)',
      [code, user_id]
    );
    res.json({ session_code: code });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/watch-party/join
router.post('/join', auth, async (req, res) => {
  const { session_code } = req.body;
  const code = session_code?.toUpperCase();

  try {
    const session = await pool.query(
      'SELECT * FROM watch_party_sessions WHERE session_code = $1', [code]
    );
    if (session.rows.length === 0)
      return res.status(404).json({ error: 'Session not found' });

    res.json({
      session_code: code,
      members: ['You'],
      shared_genres: ['Action', 'Drama', 'Comedy'],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;