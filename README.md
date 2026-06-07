# Students Research Lab

A full-stack web application for the Students Research Lab (SRL) at LDRP-ITR. The public-facing website presents the lab's research, publications, members, sessions, achievements, and activities, while a companion Express API serves all data from a Neon PostgreSQL database.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Cloudinary Setup](#cloudinary-setup)
- [Development Workflow](#development-workflow)
- [Build & Deployment](#build--deployment)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

The Students Research Lab website serves as the public presence of the SRL community. It exposes research publications, member CVs, lab sessions, leaderboards, achievements, and a join-us application form. All content is managed through the companion Admin Portal.

**Live URLs**

| Service | URL |
|---|---|
| Main Website | https://srl.mmpsrpc.in |
| Admin Portal | https://admin-srl.mmpsrpc.in |
| Backend API | https://api-srl.mmpsrpc.in |

---

## Features

### Public Website
- **Home** — Hero, lab objectives, about section, animated particle background
- **Researchers** — Member profiles with CV, research areas, and batch filtering
- **Student CV** — Individual researcher CV pages with papers, certifications, and patents
- **Sessions** — Lab session archive with media and attendance info
- **Publications** — Searchable and filterable research publications list
- **Add Publication** — Public form for members to submit publications for admin approval
- **Achievements** — Lab achievement gallery
- **Activities** — Activity feed with photo gallery and descriptions
- **Leaderboard** — All-time and monthly rankings (hours, debate scores, hackathons)
- **Organization Details** — Full member roster with batch and department breakdown
- **Join Us** — Multi-step application form for prospective members
- **Appointment** — Contact and appointment booking

### Backend API
- JWT-authenticated admin API for full CRUD on all content types
- Server-Sent Events (SSE) for real-time updates pushed to the admin portal
- Cloudinary integration with automatic WebP conversion for every image upload
- Scheduled credential generation for newly approved students
- OTP-based password reset delivered via SMTP email
- Rate limiting, CORS allowlist, Gzip/Brotli compression, and Helmet security headers
- Smart HTTP caching: 30s fresh + 5min stale-while-revalidate on public read endpoints

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 7 |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion v12 |
| Particles / 3-D globe | @tsparticles/react, cobe |
| Icons | Lucide React |
| HTTP client | Native `fetch` |
| Node requirement | ≥ 18.0.0 |

### Backend

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express 5 |
| ORM | Prisma 7 |
| Database adapter | @prisma/adapter-neon + @prisma/adapter-pg |
| Authentication | jsonwebtoken + bcryptjs |
| File uploads | Multer (memory storage) |
| Cloud storage | Cloudinary SDK v2 |
| Email | Nodemailer (SMTP) |
| Security | Helmet, express-rate-limit, CORS |
| Compression | compression (Gzip/Brotli) |
| Real-time | Server-Sent Events |

### Database

| Layer | Technology |
|---|---|
| Provider | Neon (serverless PostgreSQL) |
| ORM | Prisma 7 with pg adapter |
| Schema | `backend/prisma/schema.prisma` |
| Migrations | Prisma Migrate |
| Seeding | `backend/prisma/seed.js` |

---

## Repository Structure

```
StudentsResearchLab/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema (22 models)
│   │   ├── migrations/             # Prisma migration history
│   │   ├── seed.js                 # Database seed script
│   │   └── importSrlStudents.js    # Student bulk import utility
│   ├── src/
│   │   ├── index.js                # App entry point, route registration
│   │   ├── config/
│   │   │   ├── env.js              # Environment variable loader
│   │   │   └── prisma.js           # Prisma client singleton
│   │   ├── controllers/            # Route business logic (32 controllers)
│   │   ├── routes/                 # Express routers (33 route files)
│   │   ├── middleware/
│   │   │   ├── adminAuth.js        # JWT authentication middleware
│   │   │   └── multer.js           # File upload configuration
│   │   ├── utils/
│   │   │   ├── imageUpload.js      # Cloudinary upload + WebP conversion
│   │   │   ├── upload.js           # Disk-path upload helper
│   │   │   └── sseManager.js       # Server-Sent Events manager
│   │   └── lib/
│   │       ├── credentialScheduler.js
│   │       ├── prisma.js
│   │       ├── syncStudentFromJoinRequest.js
│   │       └── adminUtils.js
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── SRL.svg
│   │   └── SVKM.svg
│   ├── src/
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── main.jsx                # React DOM entry point
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── MobileDock.jsx
│   │   │   ├── JoinUsModal.jsx
│   │   │   ├── AnimatedPreloader.jsx
│   │   │   ├── PageTransitionWrapper.jsx
│   │   │   ├── ErrorBoundary.jsx
│   │   │   ├── LazySection.jsx
│   │   │   ├── HeadSRL.jsx
│   │   │   ├── react-bits/
│   │   │   ├── skeletons/
│   │   │   └── ui/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Researchers.jsx
│   │   │   ├── StudentCV.jsx
│   │   │   ├── Sessions.jsx
│   │   │   ├── Publications.jsx
│   │   │   ├── AddPublication.jsx
│   │   │   ├── Achievements.jsx
│   │   │   ├── Activities.jsx
│   │   │   ├── LeaderBoard.jsx
│   │   │   ├── OrganizationDetails.jsx
│   │   │   ├── JoinUs.jsx
│   │   │   ├── JoinUsSuccess.jsx
│   │   │   └── Appointment.jsx
│   │   ├── config/
│   │   │   └── apiConfig.js
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── data/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── package.json
│
├── nginx.conf
├── docker-compose.yml
├── Dockerfile
└── vercel.json
```

---

## Architecture

```
Browser
  │
  ├── React SPA (React 19, Vite 7, React Router v7)
  │     └── fetch() → /api/*
  │
  └── Express 5 API (Node.js)
        ├── Middleware: CORS allowlist, Helmet, compression, rate-limit
        ├── Public routes — no auth required
        ├── Admin routes — JWT Bearer token required
        ├── Prisma 7 ORM
        │     └── Neon PostgreSQL (serverless, pg adapter)
        ├── Cloudinary SDK v2 (image/video storage + WebP conversion)
        ├── Nodemailer SMTP (OTP resets, student credential delivery)
        └── SSE /api/events (real-time push to admin portal)
```

### Image Upload Pipeline

Every image uploaded through the API is converted to WebP before storage in Cloudinary. Videos and PDFs bypass conversion and are stored as-is.

```
Client uploads file  (JPEG / PNG / AVIF / BMP / TIFF / GIF / WebP)
  │
  └── Multer memory storage → req.file.buffer
        │
        └── uploadToCloudinary(buffer, folder, name, resourceType, mimeType)
              ├── image/convertible  →  Cloudinary upload_stream
              │                          format: "webp", quality: "auto:best"
              └── video / raw / PDF  →  Cloudinary upload, no conversion
```

### Cloudinary Folder Structure

```
srl/
├── activities/
├── events/
├── gallery/
├── researchers/
├── faculty/
├── logos/
├── certificates/
├── hero/
├── blogs/
├── news/
├── users/
└── uploads/
```

### Database Models (22 tables)

| Model | Purpose |
|---|---|
| `StudentsDetail` | Student profiles, credentials, admin flag |
| `MemberCvProfile` | CV data — papers, hackathons, certifications, patents |
| `SessionContent` | Session metadata, media URLs, LinkedIn link |
| `SrlSession` | Session date records |
| `AchievementContent` | Lab achievements with images |
| `Activity` | Activity entries with photos |
| `Publication` | Research publications with approval workflow |
| `publications` | Extended publication table (UUID, tags, categories) |
| `ResearchPaper` + `PaperAuthor` | Legacy papers with many-to-many authors |
| `Symbol` | Publisher logos for publications |
| `LeaderboardStat` | Aggregated monthly performance scores |
| `DebateScore` | Per-student monthly debate scores |
| `attendance` | Attendance records with hours logged |
| `session_attendee` | Session attendance tracking |
| `session_score` | Session-level scores |
| `JoinUs` | Prospective member applications |
| `timeline_entries` | Lab timeline steps |
| `password_reset_otps` | OTP tokens for password reset |
| `credential_jobs` | Scheduled student credential jobs |
| `patents` | Patent applications per student |
| `authorization` | Legacy authorization records |

---

## Environment Variables

### Backend — `backend/.env`

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://<user>:<password>@<host>/<dbname>?sslmode=require

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT
JWT_SECRET=your_long_random_secret_minimum_32_chars

# SMTP (Gmail App Password recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_app_password
EMAIL_FROM_ADDRESS=noreply@yourdomain.com

# Admin notification emails for join requests (comma-separated)
JOIN_REQUEST_ADMIN_NOTIFICATION_EMAILS=admin1@example.com,admin2@example.com

# Server
PORT=8000
NODE_ENV=development
```

### Frontend — `frontend/.env`

```env
# Backend API base URL
# Leave empty in development — Vite proxy handles /api/* → http://localhost:8000
VITE_BACKEND_URL=https://api-srl.mmpsrpc.in

# Set to "true" to bypass the Vite proxy and hit the backend URL directly
VITE_USE_DIRECT_API=false
```

---

## Installation & Setup

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 9
- A Neon PostgreSQL database (or any PostgreSQL instance)
- A Cloudinary account

### 1. Clone the repository

```bash
git clone <repo-url>
cd StudentsResearchLab
```

### 2. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure environment variables

```bash
# Create and fill backend env file
cp backend/.env.example backend/.env
# Edit backend/.env — set DATABASE_URL, Cloudinary keys, JWT_SECRET, SMTP config

# Create and fill frontend env file
cp frontend/.env.example frontend/.env
# Edit frontend/.env — set VITE_BACKEND_URL for production
```

---

## Database Setup

```bash
cd backend

# Generate the Prisma client
npm run db:generate
# or: npx prisma generate

# Apply all migrations to your database
npx prisma migrate deploy

# (Optional) Seed initial data
npm run db:seed

# (Optional) Open Prisma Studio — browser-based DB explorer
npx prisma studio
```

---

## Cloudinary Setup

1. Create an account at [cloudinary.com](https://cloudinary.com)
2. From the Cloudinary dashboard, copy your **Cloud Name**, **API Key**, and **API Secret**
3. Add those three values to `backend/.env`
4. Folder structure under `srl/` is created automatically on the first upload — no manual configuration needed

All images are converted to WebP on upload. Videos are stored in their original format.

---

## Development Workflow

```bash
# Terminal 1 — backend (auto-restarts on file changes)
cd backend
npm run dev
# → http://localhost:8000

# Terminal 2 — frontend (HMR enabled)
cd frontend
npm run dev
# → http://localhost:5173
# Vite proxies /api/* → http://localhost:8000 automatically
```

Both servers must run simultaneously for the full stack to work locally.

---

## Build & Deployment

### Frontend — Vercel

`frontend/vercel.json` configures a catch-all rewrite so React Router handles all client-side navigation.

```bash
cd frontend
npm run build       # outputs to frontend/dist/
```

Required Vercel environment variable:
```
VITE_BACKEND_URL = https://api-srl.mmpsrpc.in
```

### Backend — Render / Railway / any Node host

```bash
cd backend
npm run build       # runs prisma generate
npm start           # node src/index.js
```

Run migrations before starting the server for the first time:
```bash
npx prisma migrate deploy
```

Required environment variables: all variables from [Backend Environment Variables](#backend--backendenv).

### Docker (full stack)

```bash
# From the repository root
docker compose up --build
```

| Service | Port |
|---|---|
| Frontend (Nginx) | 5173 |
| Backend (Node.js) | 8000 |

---

## API Reference

All admin endpoints require `Authorization: Bearer <jwt>` obtained from `POST /api/admin/login`.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/login` | — | Issue JWT token |
| POST | `/api/auth/forgot-password` | — | Send OTP to email |
| POST | `/api/auth/verify-otp` | — | Verify OTP code |
| POST | `/api/auth/reset-password` | — | Reset password with valid OTP |

### Public Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/sessions` | All lab sessions |
| GET | `/api/timeline` | Lab timeline entries |
| GET | `/api/publications` | Research publications |
| GET | `/api/papers` | Research papers with authors |
| GET | `/api/activities` | Activity feed |
| GET | `/api/achievements` | Achievement entries |
| GET | `/api/researchers` | Researcher profiles |
| GET | `/api/leaderboard` | All-time rankings |
| GET | `/api/leaderboard/monthly` | Monthly rankings |
| GET | `/api/leaderboard/top-hours` | Top contributors by hours |
| GET | `/api/batch-stats` | Batch performance statistics |
| GET | `/api/metrics` | Lab impact metrics |
| GET | `/api/cv/:enrollment_no` | Individual student CV |
| POST | `/api/join_us` | Submit join application |
| GET | `/api/events` | SSE stream for real-time updates |

### Admin Endpoints (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| GET/POST/PUT/DELETE | `/api/admin/students` | Student CRUD |
| GET/POST/PUT/DELETE | `/api/admin/activities` | Activity CRUD |
| GET/POST/PUT/DELETE | `/api/admin/achievements` | Achievement CRUD |
| GET/POST/PUT/DELETE | `/api/admin/sessions` | Session CRUD |
| GET/POST/PUT/DELETE | `/api/admin/timeline` | Timeline CRUD |
| GET/POST/PUT/DELETE | `/api/admin/scores` | Score CRUD |
| GET/POST/PUT/DELETE | `/api/admin/attendance` | Attendance CRUD |
| GET/POST/PUT/DELETE | `/api/admin/research` | Research project CRUD |
| GET/POST/PUT/DELETE/PATCH | `/api/admin/publication` | Publication management |
| GET/PUT | `/api/admin/member-cv` | Member CV management |
| GET/POST/PUT/DELETE | `/api/admin/session-scores` | Session score CRUD |
| GET/PUT/DELETE | `/api/admin/join-requests` | Join request management |
| POST | `/api/admin/upload` | Upload image or video to Cloudinary |
| POST | `/api/admin/upload-certificate` | Upload certificate image |

---

## Troubleshooting

**`prisma generate` fails**
Ensure `DATABASE_URL` is set in `backend/.env` and the Neon database is reachable. Run `npx prisma db pull` to verify connectivity.

**CORS errors in the browser**
The backend allows origins: `localhost:5173`, `localhost:5174`, `localhost:5175`, `localhost:3000`, and the production domains. If you run the frontend on a different port, add it to the `ALLOWED_ORIGINS` array in `backend/src/index.js`.

**Cloudinary upload returns "Invalid image file"**
The MIME type is not in the accepted list. Supported types: `image/jpeg`, `image/jpg`, `image/png`, `image/gif`, `image/webp`, `image/avif`, `image/bmp`, `image/tiff`.

**SSE connection drops in development**
Do not set `VITE_USE_DIRECT_API=true` in `frontend/.env` during development. The Vite proxy is required for SSE to work without cross-origin issues.

**OTP emails not sending**
Use a Gmail App Password (not your account password) and confirm `SMTP_PORT=465`. Verify `SMTP_USER` and `SMTP_PASS` match the credentials in your Google account security settings.

**`EADDRINUSE` on port 8000**
Another process is using port 8000. Either stop that process or set `PORT=8001` in `backend/.env`.
our production backend URL.
> `VITE_API_BASE_URL` must be set at build time for Vercel so the frontend can call the deployed Render backend.

---

## 📄 License

This project is private and intended for use within the **Students Research Lab** at KSV University.

---

<p align="center">
  Built with ❤️ by the <strong>Students Research Lab</strong> team
</p>
our production backend URL.
> `VITE_API_BASE_URL` must be set at build time for Vercel so the frontend can call the deployed Render backend.

---

## 📄 License

This project is private and intended for use within the **Students Research Lab** at KSV University.

---

<p align="center">
  Built with ❤️ by the <strong>Students Research Lab</strong> team
</p>
