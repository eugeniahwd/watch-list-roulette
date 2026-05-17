const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://filmroll-frontend.vercel.app',
    'https://filmroll-frontend-8bpz5ooik-putriayupms-projects.vercel.app'
  ]
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/onboarding', require('./routes/onboarding'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/watchlist', require('./routes/watchlist'));
app.use('/api/history', require('./routes/history'));
app.use('/api/watchparty', require('./routes/watchparty'));
app.use('/api/watch-party', require('./routes/watchparty'));

app.get('/', (req, res) => res.send('Watch-List Roulette Backend Running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));