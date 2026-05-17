const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

router.post('/create', auth, async (req, res) => {
  const user_id = req.user.user_id;
  console.log("CREATE - user_id:", user_id); // ← cek di terminal

  try {
    let code;
    for (let i = 0; i < 5; i++) {
      code = generateCode();
      const exists = await pool.query(
        'SELECT 1 FROM watch_party_sessions WHERE session_code = $1', [code]
      );
      if (exists.rows.length === 0) break;
    }

    await pool.query(
      'INSERT INTO watch_party_sessions (session_code, created_by) VALUES ($1, $2)',
      [code, user_id]
    );

    await pool.query(
      `INSERT INTO watch_party_members (session_code, user_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [code, user_id]
    );

    console.log("CREATE - inserted member:", user_id, "to session:", code); // ← cek

    res.json({ session_code: code });
  } catch (err) {
    console.error("CREATE ERROR:", err.message); // ← cek error
    res.status(500).json({ error: err.message });
  }
});

router.post('/join', auth, async (req, res) => {
  const { session_code } = req.body;
  const code = session_code?.toUpperCase();
  const user_id = req.user.user_id;
  console.log("JOIN - user_id:", user_id, "code:", code); // ← cek

  try {
    const session = await pool.query(
      'SELECT * FROM watch_party_sessions WHERE session_code = $1', [code]
    );
    if (session.rows.length === 0)
      return res.status(404).json({ error: 'Session not found' });

    await pool.query(
      `INSERT INTO watch_party_members (session_code, user_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [code, user_id]
    );

    console.log("JOIN - inserted member:", user_id, "to session:", code); // ← cek

    const members = await pool.query(
      `SELECT u.username FROM watch_party_members wpm
       JOIN users u ON u.user_id = wpm.user_id
       WHERE wpm.session_code = $1`,
      [code]
    );

    res.json({
      session_code: code,
      members: members.rows.map(r => r.username),
      shared_genres: ['Action', 'Drama', 'Comedy'],
    });
  } catch (err) {
    console.error("JOIN ERROR:", err.message); // ← cek error
    res.status(500).json({ error: err.message });
  }
});

router.get('/:code/members', auth, async (req, res) => {
  const code = req.params.code?.toUpperCase();
  try {
    const result = await pool.query(
      `SELECT u.username FROM watch_party_members wpm
       JOIN users u ON u.user_id = wpm.user_id
       WHERE wpm.session_code = $1`,
      [code]
    );
    res.json({ members: result.rows.map(r => r.username) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;