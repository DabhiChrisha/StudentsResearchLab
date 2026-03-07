# 🔬 Students Research Lab (SRL)

A modern, full-stack web platform built for a university research lab to showcase its researchers, track attendance and performance, manage sessions, and engage students — all powered by **React 19**, **FastAPI**, and **Supabase**.

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
| **FastAPI** | High-performance Python API framework |
| **Uvicorn** | ASGI server for running the FastAPI application |
| **HTTPX** | Async HTTP client for proxying requests to Supabase |
| **Python Dotenv** | Environment variable management from `.env` files |

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
| **Docker Compose** | Multi-service orchestration (frontend + backend) |
| **Nginx** | Production web server and reverse proxy |
| **ESLint** | JavaScript/React code linting and quality enforcement |
| **PostCSS + Autoprefixer** | CSS processing and cross-browser compatibility |

---

## 🏗 Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│   React SPA     │──────▶│  FastAPI Proxy   │──────▶│    Supabase     │
│   (Vite)        │  API  │  (Uvicorn)      │ REST  │  (PostgreSQL)   │
│                 │◀──────│                 │◀──────│                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
     Frontend                  Backend                   Database
```

**How it works:**

1. **React Frontend** — Renders the UI and sends API requests to the FastAPI backend.
2. **FastAPI Backend** — Acts as a secure proxy layer. It receives requests from the frontend, attaches Supabase credentials (API key), and forwards them to Supabase's PostgREST API. This keeps secrets off the client.
3. **Supabase** — Hosts the PostgreSQL database with tables for students, attendance, debate scores, and SRL sessions. Handles auth and file storage.

**In Docker:** Nginx serves the React SPA and reverse-proxies `/api/` requests to the FastAPI container — no CORS issues, single entry point on port `3000`.

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
├── backend/                        # Python FastAPI backend
│   ├── main.py                     # API routes and Supabase proxy logic
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Backend container image
│   └── .dockerignore
│
├── frontend/                       # React + Vite application
│   ├── public/                     # Static assets (images, logos)
│   │   ├── Achievements/
│   │   ├── Founders/
│   │   ├── Sessions/
│   │   ├── students/               # Student profile photos
│   │   └── SRL.svg                 # Lab logo
│   │
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── AnimatedPreloader.*
│   │   │   ├── GradientText.jsx
│   │   │   ├── SpotlightCard.jsx
│   │   │   ├── ui/                 # Base UI primitives
│   │   │   └── react-bits/         # Custom React utilities
│   │   │
│   │   ├── data/                   # Static data
│   │   │   ├── organizationData.js
│   │   │   └── srlStudents.json
│   │   │
│   │   ├── lib/
│   │   │   └── supabaseClient.js   # Supabase client initialization
│   │   │
│   │   ├── pages/                  # Route-level page components
│   │   │   ├── Home.jsx
│   │   │   ├── Researchers.jsx
│   │   │   ├── LeaderBoard.jsx
│   │   │   ├── Sessions.jsx
│   │   │   ├── Achievements.jsx
│   │   │   └── ... (6 more pages)
│   │   │
│   │   ├── App.jsx                 # Root component with routing
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Global styles
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── eslint.config.js
│
├── Dockerfile                      # Frontend multi-stage build (Nginx)
├── docker-compose.yml              # Multi-service orchestration
├── nginx.conf                      # Nginx reverse proxy config
├── .dockerignore                   # Root Docker context filter
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x and **npm** ≥ 9.x
- **Python** ≥ 3.9
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
pip install -r requirements.txt
cd ..
```

---

## 🔐 Environment Variables

The project uses environment variables to securely connect to Supabase. We provide `.env.example` files to help you get started.

1. **Frontend Setup:** Copy `frontend/.env.example` to `frontend/.env` and fill in your Supabase project URL and Anon Key.
2. **Backend Setup:** Copy `backend/.env.example` to `backend/.env` and fill in your Supabase project URL and Service Role Key.

> ⚠️ **Never commit `.env` files to version control.** They are already ignored via `.gitignore`.

---

## 🚀 Run Without Docker (Recommended for Local Development)

This is the fastest, simplest way to run the stack while developing.

### Prerequisites
- **Node.js**: v20 (see `.nvmrc`)
- **Python**: v3.11 (see `backend/.python-version`)

### Terminal 1 — Backend (FastAPI)

Run the API on port `8000`:

```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
> The API will be available at `http://localhost:8000`.

### Terminal 2 — Frontend (React+Vite)

Run the web app on port `5173`:

```bash
cd frontend
npm install
npm run dev
```
> The app will be available at `http://localhost:5173`. By default, it will automatically route API requests to `http://localhost:8000` assuming you left `VITE_API_BASE_URL` commented out in your `.env` file.

---

## 🐳 Run With Docker (Optional)

Docker is great for testing the exact production build locally or running everything with zero dependencies other than Docker Desktop.

### Quick Start

```bash
# 1. Ensure you created the frontend and backend .env files as described above.

# 2. Build and start all services
docker compose up --build

# 3. Open the app
#    → http://localhost:3000
```

### Architecture in Docker
- **frontend (`srl-frontend`)**: Nginx serves the React SPA on port `3000` and reverse-proxies `/api/` requests to the backend.
- **backend (`srl-backend`)**: FastAPI proxies to Supabase. This container is entirely hidden from your local host network for security.

### Docker Commands & Troubleshooting

| Goal | Command / Solution |
|---|---|
| Run in background | `docker compose up --build -d` |
| View active logs | `docker compose logs -f` |
| Stop all services | `docker compose down` |
| Port 3000 collision | Change `"3000:80"` to `"3001:80"` in `docker-compose.yml` |
| API isn't connecting | Ensure `docker compose logs backend` shows no Python errors and your `.env` keys are valid. |

---

## 🌐 Deployment

### With Docker (Recommended)

Deploy the Docker Compose stack to any container hosting platform:

| Platform | Method |
|---|---|
| **AWS ECS / EC2** | Push images to ECR, deploy with ECS or docker-compose on EC2 |
| **DigitalOcean App Platform** | Connect repo with Dockerfile detection |
| **Railway** | Connect repo → auto-detects docker-compose |
| **Render** | Deploy each service separately with Dockerfiles |

### Without Docker

| Component | Platform | Method |
|---|---|---|
| **Frontend** | Vercel / Netlify | Connect repo → auto-deploys `frontend/` |
| **Backend** | Render / Railway | Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT` |

> 💡 Set environment variables on your hosting platform for both frontend and backend.

---

## 📄 License

This project is private and intended for educational use within the Students Research Lab.

---

<p align="center">
  Built with ❤️ by the <strong>Students Research Lab</strong> team
</p>
