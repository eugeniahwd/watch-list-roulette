CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  pref_mood VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_genres (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  genre VARCHAR(50) NOT NULL
);

CREATE TABLE user_platforms (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL
);

CREATE TABLE watch_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  tmdb_id INTEGER NOT NULL,
  media_type VARCHAR(10),
  watched_at TIMESTAMP DEFAULT NOW(),
  rating INTEGER DEFAULT 0
);

CREATE TABLE watch_party_sessions (
  id SERIAL PRIMARY KEY,
  session_code VARCHAR(20) UNIQUE NOT NULL,
  created_by INTEGER REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  spin_result INTEGER
);

CREATE TABLE watch_party_members (
  id SERIAL PRIMARY KEY,
  session_code VARCHAR(20) REFERENCES watch_party_sessions(session_code),
  user_id INTEGER REFERENCES users(user_id),
  joined_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE watchlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id),
  tmdb_id INTEGER NOT NULL,
  media_type VARCHAR(10),
  status VARCHAR(20) DEFAULT 'to-watch',
  added_at TIMESTAMP DEFAULT NOW()
);