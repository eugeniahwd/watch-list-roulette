# 🎬 FilmRoll — Watch-List Roulette

> **Stop scrolling. Start watching.**  
> FilmRoll adalah aplikasi web rekomendasi film yang membantu kamu memilih tontonan dengan cepat dan menyenangkan.

---

## About the Project

FilmRoll hadir sebagai solusi untuk masalah klasik: **sudah punya watchlist panjang, tapi tetap bingung mau nonton apa**. Dengan sistem roulette berbasis preferensi genre dan durasi waktu, FilmRoll membuat proses memilih film menjadi lebih cepat, personal, dan menyenangkan.

Data film diambil secara *real-time* dari **TMDB API** (The Movie Database), sementara data user, preferensi, watchlist, dan histori disimpan di database **PostgreSQL**.

---

## ✨ Features

| Fitur | Deskripsi |
|---|---|
| **Roulette** | Spin wheel berdasarkan genre pilihan untuk dapat rekomendasi random |
| **Time-Crunch** | Cari film sesuai durasi waktu yang tersedia (minimum 20 menit) |
| **Watch-Party** | Buat sesi nonton bareng dengan kode unik, spin film bareng teman |
| **Watchlist** | Simpan film yang ingin ditonton |
| **History** | Catat film yang sudah ditonton beserta rating personal |
| **Onboarding** | Personalisasi genre, platform, dan mood (film/series) |
| **Auth** | Register dan login menggunakan username + password |

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js](https://nextjs.org/) | React framework (App Router) |
| Tailwind CSS | Utility-first styling |
| TMDB API | Sumber data film (poster, rating, genre, durasi) |

### Backend
| Technology | Purpose |
|---|---|
| [Node.js](https://nodejs.org/) | Runtime environment |
| [Express.js](https://expressjs.com/) | Web framework |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Railway](https://railway.app/) | PostgreSQL hosting |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Password hashing |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) | JWT authentication |
| [axios](https://axios-http.com/) | HTTP client untuk TMDB |

---

## Database Schema

### Tabel `users`
| Column | Type | Description |
|---|---|---|
| user_id | SERIAL PRIMARY KEY | ID unik user |
| username | VARCHAR | Username (unik) |
| email | VARCHAR | Email (unik) |
| password_hash | VARCHAR | Password terenkripsi (bcrypt) |
| pref_mood | VARCHAR | Preferensi: `film` atau `series` |
| created_at | TIMESTAMP | Waktu registrasi |

### Tabel `user_genres`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | ID unik |
| user_id | INT (FK → users) | Referensi ke user |
| genre | VARCHAR | Nama genre favorit |

### Tabel `user_platforms`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | ID unik |
| user_id | INT (FK → users) | Referensi ke user |
| platform | VARCHAR | Platform streaming |

### Tabel `watchlist`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | ID unik |
| user_id | INT (FK → users) | Referensi ke user |
| tmdb_id | INT | ID film dari TMDB |
| media_type | VARCHAR | `movie` atau `tv` |
| status | VARCHAR | Status tontonan |
| added_at | TIMESTAMP | Waktu ditambahkan |

### Tabel `watch_history`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | ID unik |
| user_id | INT (FK → users) | Referensi ke user |
| tmdb_id | INT | ID film dari TMDB |
| media_type | VARCHAR | `movie` atau `tv` |
| rating | INT | Rating user (1-5) |
| watched_at | TIMESTAMP | Waktu ditonton |

### Tabel `watch_party_sessions`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | ID unik |
| session_code | VARCHAR | Kode sesi unik (6 karakter) |
| created_by | INT (FK → users) | User yang membuat sesi |
| spin_result | INT | tmdb_id hasil spin |
| created_at | TIMESTAMP | Waktu sesi dibuat |

### Tabel `watch_party_members`
| Column | Type | Description |
|---|---|---|
| id | SERIAL PRIMARY KEY | ID unik |
| session_code | VARCHAR (FK) | Kode sesi |
| user_id | INT (FK → users) | Member sesi |

---

## 📊Diagrams

### ERD (Entity Relationship Diagram)
> ![alt text](<ERD FilmRoll.png>)
---

### UML (Class Diagram)
> ![alt text](<UML FilmRoll.png>)


---

### Flowchart
> ![alt text](<Flowchart FilmRoll.png>)

---

## 📁 Project Structure

```
watch-list-roulette/
├── frontend/                   # Next.js App
│   ├── app/
│   │   ├── page.js             # Landing page
│   │   ├── login/page.js       # Login page
│   │   ├── register/page.js    # Register page
│   │   ├── onboarding/page.js  # Onboarding page
│   │   ├── dashboard/page.js   # Main dashboard
│   │   ├── roulette/page.js    # Roulette feature
│   │   ├── time-crunch/page.js # Time-Crunch feature
│   │   ├── watch-party/page.js # Watch-Party feature
│   │   ├── watchlist/page.js   # Watchlist page
│   │   ├── history/page.js     # Watch history page
│   │   ├── profile/page.js     # Profile page
│   │   └── movie/[id]/page.js  # Movie detail page
│   ├── components/
│   │   └── Navbar.js           # Shared navbar component
│   ├── .env.local              # Environment variables (tidak di-commit)
│   └── package.json
│
└── backend/                    # Express.js API
    ├── routes/
    │   ├── auth.js             # Register & Login
    │   ├── onboarding.js       # Simpan preferensi user
    │   ├── recommendations.js  # Rekomendasi dari TMDB
    │   ├── watchlist.js        # CRUD watchlist
    │   ├── history.js          # CRUD watch history
    │   └── watchParty.js       # Watch party session
    ├── middleware/
    │   └── auth.js             # JWT middleware
    ├── db/
    │   └── index.js            # PostgreSQL connection pool
    ├── .env                    # Environment variables (tidak di-commit)
    └── server.js               # Entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- PostgreSQL (atau akun Railway)

### 1. Clone the repository

```bash
git clone https://github.com/eugeniahwd/watch-list-roulette.git
cd watch-list-roulette
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env` di folder `backend/`:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
TMDB_API_KEY=your_tmdb_api_key
PORT=5000
```

Jalankan backend:
```bash
node server.js
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Buat file `.env.local` di folder `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

Jalankan frontend:
```bash
npm run dev
```

### 4. Buka di browser

```
http://localhost:3000
```

---

## Environment Variables

### Backend `.env`
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string dari Railway |
| `JWT_SECRET` | Secret key untuk signing JWT token |
| `TMDB_API_KEY` | API key dari [TMDB](https://www.themoviedb.org/settings/api) |
| `PORT` | Port server (default: 5000) |

### Frontend `.env.local`
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL backend (default: http://localhost:5000) |
| `NEXT_PUBLIC_TMDB_API_KEY` | API key dari TMDB |

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Registrasi user baru | ❌ |
| POST | `/api/auth/login` | Login user | ❌ |

### Onboarding
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/onboarding` | Simpan preferensi genre & platform | ✅ |
| GET | `/api/onboarding/check` | Cek apakah user sudah onboarding | ✅ |

### Watchlist
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/watchlist` | Ambil semua watchlist user | ✅ |
| POST | `/api/watchlist` | Tambah film ke watchlist | ✅ |
| DELETE | `/api/watchlist/:tmdb_id` | Hapus film dari watchlist | ✅ |

### History
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/history` | Ambil semua watch history user | ✅ |
| POST | `/api/history` | Tambah film ke history | ✅ |
| DELETE | `/api/history/:tmdb_id` | Hapus film dari history | ✅ |

### Watch Party
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/watch-party/create` | Buat sesi Watch-Party baru | ✅ |
| POST | `/api/watch-party/join` | Join sesi dengan kode | ✅ |
| GET | `/api/watch-party/:code/members` | Ambil daftar member sesi | ✅ |
| POST | `/api/watch-party/:code/spin` | Simpan hasil spin | ✅ |
| GET | `/api/watch-party/:code/state` | Ambil state sesi terkini | ✅ |

### Recommendations
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/recommendations` | Ambil rekomendasi berdasarkan preferensi | ✅ |

> ✅ = Requires JWT token in `Authorization: Bearer <token>` header

---

## Team

| Nama | NPM | Tugas |
|---|---|---|
| Eugenia Huwaida Imtinan| 2406421384 | Frontend (Dashboard, History), Project Lead |
| Nadia Izzati | 2406487033 | Frontend (Roulette, Watch-Party), API Watchlist & History |
| Kamila Salma Fathiyya | 2406487071 | Frontend (Time-Crunch), API Auth, Tabel Users |
| Putri Ayu Pembayun M | 2406422304 | Backend Setup, PostgreSQL, API Onboarding & Recommendations |

---

## License

This project is made for academic purposes — **Proyek Akhir Praktikum Sistem Basis Data 2025/2026**, Fakultas Teknik Universitas Indonesia.

---