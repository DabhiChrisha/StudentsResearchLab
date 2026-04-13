# 🔬 Students Research Lab (SRL)

A modern, full-stack web platform for the **Students Research Lab** at KSV University — showcasing researchers, tracking performance, managing sessions, publishing research, and engaging students. Built with **React 19**, **Node.js/Express**, **Prisma ORM**, and **Neon PostgreSQL**.

> 🌐 **Live:** [students-research-lab-srl.vercel.app](https://students-research-lab-srl.vercel.app)

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
| **tsParticles** | Animated particle backgrounds |
| **Canvas Confetti** | Celebratory confetti effects (leaderboard, achievements) |
| **clsx + tailwind-merge** | Conditional and conflict-free class name merging |
| **XLSX** | Excel data import/export support |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js 20** | JavaScript runtime |
| **Express.js 5** | Lightweight HTTP server and REST API framework |
| **Prisma ORM v7** | Type-safe database client and schema management |
| **@prisma/adapter-pg** | PostgreSQL driver adapter for Prisma |
| **pg (node-postgres)** | PostgreSQL connection pooling |
| **jsonwebtoken** | JWT-based admin authentication |
| **Cloudinary** | Cloud media (image/video) storage and delivery |
| **Multer** | Multipart form-data handling for file uploads |
| **dotenv** | Environment variable management |
| **Nodemon** | Auto-reloading development server |

### Database & Hosting

| Technology | Purpose |
|---|---|
| **Neon PostgreSQL** | Serverless PostgreSQL (production database) |
| **Prisma Migrations** | Schema versioning and database migrations |
| **Vercel** | Frontend hosting with CI/CD from GitHub |
| **Render / Railway** | Backend hosting |
| **Docker** | Containerized backend deployment |
| **Cloudinary** | CDN-backed media asset storage |

---

## 🏗 Architecture

```
┌──────────────────┐       ┌──────────────────────┐       ┌───────────────────┐
│                  │       │                      │       │                   │
│   React SPA      │──────▶│   Express.js API     │──────▶│  Neon PostgreSQL  │
│   (Vite + Vercel)│  API  │   (Node.js)          │Prisma │  (Serverless DB)  │
│                  │◀──────│                      │◀──────│                   │
└──────────────────┘       └──────────────────────┘       └───────────────────┘
      Frontend                   Backend (Docker)                Database
```

**How it works:**

1. **React Frontend** — Renders the UI, sends API requests to the Express backend, and keeps the backend alive with periodic health-check pings.
2. **Express Backend** — Handles authentication, complex data aggregation (leaderboard rankings, attendance calculations), CRUD for admin operations, and file uploads to Cloudinary.
3. **Neon PostgreSQL** — Hosts all relational data. Managed through **Prisma ORM** with a defined schema and migration history.

---

## ✨ Key Features

- **🏠 Home & Landing** — Animated hero, particle effects, about section, interactive timeline, and institute showcase
- **👥 Researchers Directory** — Searchable profiles with individual student CV pages
- **🏆 Leaderboard** — Ranked performance display with debate scores, attendance, and hours metrics; monthly and all-time views
- **📅 Sessions** — Carousel-based view of all research lab sessions with media links
- **🏅 Achievements** — Showcase of lab accomplishments and milestones
- **📰 Publications** — Library of research papers (journal and conference) with filter by year and category
- **📊 Batch Stats** — Per-batch student statistics and performance comparison
- **📝 Join Us** — Multi-step application form for prospective members
- **📆 Appointment** — Book consultations with lab coordinators
- **🏛 Organization Details** — Detailed profiles for partner institutes
- **🛡 Admin Panel** — JWT-secured admin routes for managing students, activities, research, attendance, timeline, and scores
- **☁️ Cloudinary Media** — All images and videos served from Cloudinary CDN
- **🎨 Premium UI** — Animated preloader, page transitions, gradient text, glow effects, spotlight cards, and confetti

---

## 📁 Folder Structure

```
StudentsResearchLab/
├── backend/                         # Node.js / Express backend
│   ├── prisma/
│   │   ├── schema.prisma            # Prisma data models
│   │   ├── migrations/              # SQL migration history
│   │   └── seed.js                  # Database seeding scripts
│   ├── src/
│   │   ├── index.js                 # Server entry point, CORS & route registration
│   │   ├── config/
│   │   │   └── prisma.js            # Prisma client initialization (with pg adapter)
│   │   ├── routes/                  # Public API route handlers
│   │   │   ├── sessions.js
│   │   │   ├── timeline.js
│   │   │   ├── join_us.js
│   │   │   ├── publications.js
│   │   │   ├── cv.js
│   │   │   ├── papers.js
│   │   │   ├── activities.js
│   │   │   ├── leaderboard.js
│   │   │   ├── batch_stats.js
│   │   │   ├── achievements.js
│   │   │   └── researchers.js
│   │   ├── routes/                  # Admin-only API routes (JWT protected)
│   │   │   ├── admin.js             # Auth login
│   │   │   ├── adminStudents.js
│   │   │   ├── adminActivities.js
│   │   │   ├── adminScores.js
│   │   │   ├── adminAttendance.js
│   │   │   ├── adminTimeline.js
│   │   │   └── adminResearch.js
│   │   ├── middleware/              # Auth and validation middleware
│   │   └── utils/                  # Helper utilities
│   ├── migrations/                  # Legacy/standalone SQL files
│   ├── assets/                      # CSV data files used for seeding
│   ├── prisma.config.ts             # Prisma v7 config (datasource URL)
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
│
├── frontend/                        # React + Vite application
│   ├── public/                      # Static assets served from root
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MobileDock.jsx
│   │   │   ├── AnimatedPreloader.jsx
│   │   │   ├── PageTransitionWrapper.jsx
│   │   │   ├── ScrollToTop.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── pages/                   # Route-level page components
│   │   │   ├── Home.jsx
│   │   │   ├── Sessions.jsx
│   │   │   ├── Achievements.jsx
│   │   │   ├── Activities.jsx
│   │   │   ├── Publications.jsx
│   │   │   ├── Researchers.jsx
│   │   │   ├── LeaderBoard.jsx
│   │   │   ├── JoinUs.jsx
│   │   │   ├── JoinUsSuccess.jsx
│   │   │   ├── Appointment.jsx
│   │   │   ├── OrganizationDetails.jsx
│   │   │   ├── StudentCV.jsx
│   │   │   └── AddPublication.jsx
│   │   ├── config/
│   │   │   └── apiConfig.js         # API base URL and request headers
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── lib/                     # Utility functions
│   │   ├── data/                    # Static JSON data (institutes, etc.)
│   │   ├── App.jsx                  # Root component with routing
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── README.md
│
├── docker-compose.yml               # Multi-service orchestration
├── Dockerfile                       # Root Dockerfile (frontend nginx)
├── nginx.conf                       # Nginx reverse-proxy config
├── package.json                     # Workspace scripts (concurrently)
├── .gitignore
└── README.md                        ← You are here
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.x and **npm** ≥ 10.x
- **Docker** and **Docker Compose** (optional, for containerized setup)
- A **Neon PostgreSQL** connection string ([neon.tech](https://neon.tech))
- A **Cloudinary** account for media uploads ([cloudinary.com](https://cloudinary.com))

### 1. Clone the Repository

```bash
git clone https://github.com/DabhiChrisha/StudentsResearchLab.git
cd StudentsResearchLab
```

### 2. Install All Dependencies

```bash
# Install workspace-level dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend

# Install backend dependencies
npm install --prefix backend
```

### 3. Generate Prisma Client

```bash
cd backend
npx prisma generate
cd ..
```

---

## 🔐 Environment Variables

### Frontend — `frontend/.env`

```bash
# Backend API endpoint (local dev or deployed URL)
VITE_API_BASE_URL=http://127.0.0.1:8000
```

> ⚠️ For production, set `VITE_API_BASE_URL` to your deployed backend URL in your hosting dashboard (e.g., Vercel environment variables).

### Backend — `backend/.env`

```bash
# Neon PostgreSQL connection string
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin authentication
ADMIN_EMAIL=your_admin_email@example.com
JWT_SECRET=your_jwt_secret_here
```

> ⚠️ **Never commit `.env` files to version control.** They are already excluded via `.gitignore`.

---

## 🏃 Running Locally

### Option A — Run Both Together (Recommended)

From the project root, using the workspace script:

```bash
npm run dev
```

This starts both frontend and backend concurrently.

### Option B — Run Separately

**Terminal 1 — Backend (Express on port 8000):**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend (Vite on port 5173/5174):**

```bash
cd frontend
npm run dev
```

| Service | URL |
|---|---|
| Frontend | `http://localhost:5173` |
| Backend API | `http://127.0.0.1:8000` |
| API Health | `http://127.0.0.1:8000/api/health` |

---

## 🐳 Docker

Docker is recommended for deploying the backend or testing the production build.

### Quick Start

```bash
# Build and start backend container
docker compose up --build

# App runs at http://localhost:3000 (nginx proxy)
```

### Useful Commands

| Goal | Command |
|---|---|
| Start in background | `docker compose up --build -d` |
| View logs | `docker compose logs -f` |
| Stop all | `docker compose down` |
| Rebuild backend only | `docker compose up --build backend` |

> 💡 The `DATABASE_URL` and other secrets must be set in your environment or passed via `docker compose` env configuration.

---

## 🌐 Deployment

### Frontend — Vercel

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set **root directory** to `frontend/`
4. Set environment variable `VITE_API_BASE_URL` to your deployed backend URL
5. Vercel auto-deploys on push to `main`

### Backend — Render / Railway / any Node.js host

**Build command:**
```bash
npm install && npx prisma generate
```

**Start command:**
```bash
npm start
```

**Required environment variables:**
- `DATABASE_URL` — Neon PostgreSQL connection string
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `ADMIN_EMAIL`, `JWT_SECRET`

> After deploying the backend, update `VITE_API_BASE_URL` in Vercel to point to your production backend URL.

---

## 📄 License

This project is private and intended for use within the **Students Research Lab** at KSV University.

---

<p align="center">
  Built with ❤️ by the <strong>Students Research Lab</strong> team
</p>
