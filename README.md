# 🔬 Students Research Lab (SRL)

A modern, full-stack web platform built for a university research lab to showcase its researchers, track attendance and performance, manage sessions, and engage students — all powered by **React 19**, **Node.js/Express**, and **Supabase**.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Docker](#-docker)
- [Deployment](#-deployment)

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | Core UI framework with functional components and hooks |
| **Vite 7** | Lightning-fast dev server and optimized production builds |
| **React Router 7** | Client-side routing and navigation |
| **Tailwind CSS 3** | Utility-first CSS framework for responsive design |
| **Framer Motion** | Declarative animations and page transitions |
| **Lucide React** | Modern, customizable icon library |
| **Swiper** | Touch-friendly carousels and sliders |
| **Canvas Confetti** | Celebratory confetti effects (leaderboard, achievements) |
| **clsx + tailwind-merge** | Conditional and conflict-free class name merging |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime (v20+) |
| **Express.js** | Lightweight HTTP server and API framework |
| **Supabase JS** | Client for querying the Supabase PostgreSQL database |
| **dotenv** | Environment variable management from `.env` files |
| **Nodemon** | Auto-reloading development server |

### Database / BaaS

| Technology | Purpose |
|---|---|
| **Supabase** | Backend-as-a-Service built on PostgreSQL |
| PostgreSQL (via Supabase) | Relational database for all application data |
| Supabase Auth | User authentication and access control |
| Supabase Storage | File and image storage for public assets |

### Dev Tooling & Infrastructure

| Technology | Purpose |
|---|---|
| **Docker** | Containerization for consistent dev/prod environments |
| **ESLint** | JavaScript/React code linting and quality enforcement |
| **PostCSS + Autoprefixer** | CSS processing and cross-browser compatibility |

---

## 🏗 Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│   React SPA     │──────▶│  Express.js API  │──────▶│    Supabase     │
│   (Vite)        │  API  │  (Node.js)      │ REST  │  (PostgreSQL)   │
│                 │◀──────│                 │◀──────│                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
     Frontend                  Backend                   Database
```

**How it works:**

1. **React Frontend** — Renders the UI and sends API requests to the Express backend.
2. **Express Backend** — Handles complex data aggregation (leaderboard rankings, attendance calculations, tie-breaking logic) and serves optimized responses to the frontend. Keeps Supabase credentials off the client.
3. **Supabase** — Hosts the PostgreSQL database with tables for students, attendance, debate scores, sessions, publications, and achievements.

---

## ✨ Key Features

- **🏠 Home & Landing** — Animated hero section, about section, objectives, and timeline
- **👥 Researchers Directory** — Searchable researcher profiles with student CV pages
- **🏆 Leaderboard** — Ranked podium display with debate scores and attendance metrics
- **📅 Sessions** — Carousel-based view of all research lab sessions
- **🏅 Achievements** — Showcase of lab accomplishments and milestones
- **📊 Attendance Tracking** — Per-student attendance percentage and SRL session attendance
- **📝 Join Us** — Application form for prospective members with success confirmation
- **📆 Appointment Booking** — Schedule consultations with the lab
- **🏛 Organization Details** — Detailed pages for partner organizations
- **🎨 Premium UI** — Animated preloader, page transitions, gradient text effects, spotlight cards, and confetti celebrations
- **📱 Fully Responsive** — Mobile-first design with Tailwind CSS

---

## 📁 Folder Structure

```
StudentsResearchLab/
├── backend/                        # Node.js/Express backend
│   ├── src/
│   │   ├── index.js                # Express app entry point, CORS & route setup
│   │   ├── supabase.js             # Supabase client initialization
│   │   └── routes/                 # API route handlers
│   │       ├── leaderboard.js
│   │       ├── students.js
│   │       ├── publications.js
│   │       ├── achievements.js
│   │       ├── sessions.js
│   │       ├── attendance.js
│   │       ├── scores.js
│   │       ├── join_us.js
│   │       ├── metrics.js
│   │       └── ...
│   ├── migrations/                 # SQL migration files
│   ├── assets/                     # CSV data files
│   ├── scripts/                    # Utility scripts
│   ├── package.json
│   ├── Dockerfile
│   └── README_NEW.md
│
├── frontend/                       # React + Vite application
│   ├── public/                     # Static assets (images, logos)
│   │   ├── Achievements/
│   │   ├── Sessions/
│   │   ├── students/               # Student profile photos
│   │   └── SRL.svg                 # Lab logo
│   │
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   └── ...
│   │   │
│   │   ├── config/
│   │   │   └── apiConfig.js        # API endpoint configuration
│   │   │
│   │   ├── lib/                    # Utility functions & Supabase client
│   │   │
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── Home.jsx
│   │   │   ├── Researchers.jsx
│   │   │   ├── LeaderBoard.jsx
│   │   │   ├── Sessions.jsx
│   │   │   ├── Achievements.jsx
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── README_NEW.md
│
├── docker-compose.yml              # Multi-service orchestration
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x and **npm** ≥ 10.x
- **Docker** and **Docker Compose** (for containerized setup)
- A **Supabase** project ([supabase.com](https://supabase.com))

### 1. Clone the Repository

```bash
git clone https://github.com/DabhiChrisha/StudentsResearchLab.git
cd StudentsResearchLab
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cd ..
```

### 3. Backend Setup

```bash
cd backend
npm install
cd ..
```

---

## 🔐 Environment Variables

### Frontend — `frontend/.env`

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Backend — `backend/.env`

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
PORT=8000
NODE_ENV=development
```

> ⚠️ **Never commit `.env` files to version control.** They are already ignored via `.gitignore`.

---

## 🏃 Running Locally

### Terminal 1 — Backend (Express)

```bash
cd backend
npm run dev
```

> API will be available at `http://127.0.0.1:8000`.

### Terminal 2 — Frontend (React + Vite)

```bash
cd frontend
npm run dev
```

> App will be available at `http://localhost:5173`.

---

## 🐳 Run With Docker (Optional)

Docker is great for testing the production build locally or running everything with zero local dependencies.

### Quick Start

```bash
# 1. Ensure frontend and backend .env files are created as above.

# 2. Build and start all services
docker compose up --build

# 3. Open the app
#    → http://localhost:3000
```

### Docker Commands

| Goal | Command |
|---|---|
| Run in background | `docker compose up --build -d` |
| View active logs | `docker compose logs -f` |
| Stop all services | `docker compose down` |

---

## 🌐 Deployment

### Frontend — Vercel (Recommended)

1. Connect the repository to Vercel
2. Set root directory to `frontend/`
3. Set environment variables in the Vercel dashboard
4. Vercel auto-deploys on push to `main`

### Backend — Any Node.js Host (Render, Railway, etc.)

**Start command:**
```bash
npm start
```

**Environment variables to set:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `NODE_ENV=production`

> 💡 After deploying the backend, update `VITE_API_BASE_URL` in the frontend environment to point to the production backend URL.

---

## 📄 License

This project is private and intended for educational use within the Students Research Lab.

---

<p align="center">
  Built with ❤️ by the <strong>Students Research Lab</strong> team
</p>
