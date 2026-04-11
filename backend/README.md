# 🔧 Students Research Lab — Backend API

A **Node.js/Express** REST API powering the Students Research Lab platform. Serves as the data layer between the **React frontend** and the **Neon PostgreSQL** database, using **Prisma ORM v7** for type-safe database access and **Cloudinary** for media management.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running Locally](#-running-locally)
- [API Endpoints](#-api-endpoints)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Docker Deployment](#-docker-deployment)
- [Troubleshooting](#-troubleshooting)

---

## Overview

The backend handles:

- **Admin Authentication** — JWT-based login for protected admin routes
- **Leaderboard Aggregation** — Rankings by debate scores, attendance, and hours with tie-breaking logic
- **Researcher Profiles** — Student details joined with research project memberships
- **Content Management** — Admin CRUD for sessions, activities, achievements, timeline, papers, and scores
- **File Uploads** — Multipart image/video uploads stored to Cloudinary
- **CORS Gateway** — Secure cross-origin access to allowed frontend origins

---

## 🛠 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | 20+ (Alpine in Docker) |
| **Framework** | Express.js | 5.2.1 |
| **ORM** | Prisma Client JS | 7.7.0 |
| **DB Adapter** | @prisma/adapter-pg | 7.7.0 |
| **Database** | Neon PostgreSQL (via `pg`) | — |
| **Auth** | jsonwebtoken | 9.0.3 |
| **Media** | Cloudinary SDK | 2.9.0 |
| **Uploads** | Multer | 2.1.1 |
| **CORS** | cors | 2.8.6 |
| **Environment** | dotenv / dotenvx | 17.4.1 |
| **Dev Server** | Nodemon | 3.1.14 |
| **Container** | Docker (Alpine Linux) | — |

---

## 📦 Prerequisites

- **Node.js** ≥ 20.x and **npm** ≥ 10.x
- A **Neon PostgreSQL** project ([neon.tech](https://neon.tech))
- A **Cloudinary** account ([cloudinary.com](https://cloudinary.com))
- **Docker** (optional, for containerized deployment)

```bash
node --version   # v20.x or higher
npm --version    # 10.x or higher
```

---

## 🚀 Installation

```bash
# Navigate to backend directory
cd StudentsResearchLab/backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Neon PostgreSQL connection string
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require&channel_binding=require"

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin credentials
ADMIN_EMAIL=adminsrl@gmail.com
JWT_SECRET=your_long_random_secret_here
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string (with SSL) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_EMAIL` | Email used for admin login |
| `JWT_SECRET` | Secret for signing JWT tokens |

> ⚠️ **Never commit `.env` to version control.** It is excluded via `.gitignore`.

---

## 🗄 Database Setup

The project uses **Prisma Migrations** against a **Neon PostgreSQL** database.

### Key Tables (defined in `prisma/schema.prisma`)

| Table | Description |
|-------|-------------|
| `students_details` | Student profiles (enrollment, department, batch, photo) |
| `leaderboard_stats` | Aggregated monthly performance records |
| `srl_sessions` | Session dates |
| `session_content` | Session metadata, media URLs, and links |
| `achievement_content` | Lab achievements and milestone records |
| `activities` | Activity entries with images |
| `publications` | Research papers (journal/conference) |
| `research_papers` | Legacy paper records with authors |
| `research_projects` | Research project details |
| `research_project_members` | Many-to-many: students ↔ projects |
| `join_us` | Prospective member application submissions |
| `member_cv_profiles` | Student CV data (hackathons, patents, projects) |
| `timeline_entries` | Lab journey timeline steps |
| `debate_scores` | Monthly debate point records |

### Apply Migrations

```bash
# Run pending migrations against the database
npx prisma migrate deploy

# Or push schema without migration history (dev only)
npx prisma db push
```

### Verify Connection

```bash
npm run dev
curl http://127.0.0.1:8000/api/health
```

Expected response:
```json
{ "status": "✅ ok", "allowed_origins": [...] }
```

---

## 🏃 Running Locally

### Development (with auto-reload)

```bash
npm run dev
```

Server starts on `http://127.0.0.1:8000` with Nodemon watching for file changes.

### Production Mode

```bash
npm start
```

---

## 📡 API Endpoints

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server status |
| GET | `/api/health` | Health check + allowed origins |

---

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sessions` | All lab sessions |
| GET | `/api/timeline` | Timeline entries |
| GET | `/api/publications` | Research publications |
| GET | `/api/papers` | Research papers with authors |
| GET | `/api/achievements` | Achievement entries |
| GET | `/api/activities` | Activity feed |
| GET | `/api/leaderboard` | All-time leaderboard rankings |
| GET | `/api/leaderboard/monthly` | Monthly rankings (`?period=Jan 2026`) |
| GET | `/api/leaderboard/top-hours` | Top contributors by hours |
| GET | `/api/batch-stats` | Per-batch performance statistics |
| GET | `/api/researchers` | Researcher profiles with project info |
| GET | `/api/cv/:enrollment_no` | Student CV profile data |
| POST | `/api/join_us` | Submit a membership application |

---

### Admin Endpoints (JWT Required)

Authenticate first via `/api/admin/login`, then pass the token as `Authorization: Bearer <token>`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login — returns JWT |
| GET / POST / PUT / DELETE | `/api/admin/students` | Manage student records |
| GET / POST / PUT / DELETE | `/api/admin/activities` | Manage activity entries |
| GET / POST / PUT / DELETE | `/api/admin/scores` | Manage debate scores |
| GET / POST / PUT / DELETE | `/api/admin/attendance` | Manage attendance records |
| GET / POST / PUT / DELETE | `/api/admin/timeline` | Manage timeline entries |
| GET / POST / PUT / DELETE | `/api/admin/research` | Manage research projects |

---

## 📜 Available Scripts

Run from the `backend/` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Nodemon (auto-reload) |
| `npm start` | Start production server |
| `npm run build` | Generate Prisma client (`prisma generate`) |
| `npm run db:pull` | Sync Prisma schema from existing DB |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run prisma:studio` | Open Prisma Studio GUI |

---

## 📂 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma            # Data models and database structure
│   ├── migrations/              # Prisma migration history
│   ├── seed.js                  # Main seeder script
│   ├── seed-v2.js               # Alternate seeder
│   └── exported_data.json       # Seed data source
│
├── src/
│   ├── index.js                 # Express app: CORS, routes, error handler
│   ├── config/
│   │   └── prisma.js            # PrismaClient + PrismaPg adapter setup
│   ├── routes/
│   │   ├── sessions.js          # GET /api/sessions
│   │   ├── timeline.js          # GET /api/timeline
│   │   ├── join_us.js           # POST /api/join_us
│   │   ├── publications.js      # GET /api/publications
│   │   ├── papers.js            # GET /api/papers
│   │   ├── cv.js                # GET /api/cv/:enrollment_no
│   │   ├── activities.js        # GET /api/activities
│   │   ├── leaderboard.js       # Leaderboard logic + aggregation
│   │   ├── batch_stats.js       # Batch performance stats
│   │   ├── achievements.js      # GET /api/achievements
│   │   ├── researchers.js       # GET /api/researchers
│   │   ├── admin.js             # POST /api/admin/login (JWT issue)
│   │   ├── adminStudents.js     # Admin student CRUD
│   │   ├── adminActivities.js   # Admin activity CRUD
│   │   ├── adminScores.js       # Admin score CRUD
│   │   ├── adminAttendance.js   # Admin attendance CRUD
│   │   ├── adminTimeline.js     # Admin timeline CRUD
│   │   └── adminResearch.js     # Admin research project CRUD
│   ├── middleware/              # JWT auth middleware
│   └── utils/                  # Helper functions
│
├── migrations/                  # Legacy SQL migration files
├── assets/                      # CSV source data files
├── prisma.config.ts             # Prisma v7 config (DATABASE_URL)
├── .env                         # Local environment variables
├── .dockerignore
├── .gitignore
├── Dockerfile
├── package.json
└── README.md
```

---

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t srl-backend:latest .
```

### Run Container

```bash
docker run -p 8000:8000 \
  -e DATABASE_URL="postgresql://..." \
  -e CLOUDINARY_CLOUD_NAME=... \
  -e CLOUDINARY_API_KEY=... \
  -e CLOUDINARY_API_SECRET=... \
  -e ADMIN_EMAIL=... \
  -e JWT_SECRET=... \
  srl-backend:latest
```

### With Docker Compose (from project root)

```bash
docker compose up --build backend
```

> 💡 The Dockerfile passes a dummy `DATABASE_URL` during `prisma generate` at build time. The real URL is injected via environment variables at container runtime.

---

## 🔐 CORS Configuration

The following origins are allowed by default (`src/index.js`):

```
http://localhost:5173
http://localhost:5174
http://localhost:5175
http://localhost:3000
http://127.0.0.1:5173 / 5174 / 5175 / 3000
https://students-research-lab-srl.vercel.app
```

To add a new frontend origin, edit `ALLOWED_ORIGINS` in `src/index.js` and restart.

---

## 🐛 Troubleshooting

### `Cannot find module '.prisma/client/default'`

Prisma client was not generated. Run:

```bash
npx prisma generate
```

In Docker, this happens because `prisma.config.ts` (Prisma v7) requires `DATABASE_URL` at generate time. The Dockerfile handles this with a dummy URL at build time.

### Port 8000 Already in Use

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :8000
kill -9 <PID>
```

### Prisma Migration Errors

```bash
# Check current migration status
npx prisma migrate status

# Reset dev database (caution: destructive)
npx prisma migrate reset
```

### CORS Error from Frontend

1. Ensure frontend runs on one of the `ALLOWED_ORIGINS`
2. Confirm `VITE_API_BASE_URL` in `frontend/.env` matches the backend URL
3. Restart backend after changing CORS config

---

## 📄 License

Private — for use within the Students Research Lab at KSV University.
