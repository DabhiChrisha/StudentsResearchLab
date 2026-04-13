# 🎓 Students Research Lab — Frontend

A modern, animated React web application for the **Students Research Lab (SRL)** at KSV University. Showcases researchers, sessions, publications, leaderboards, and achievements — with a fully admin-managed backend.

> 🌐 **Live:** [students-research-lab-srl.vercel.app](https://students-research-lab-srl.vercel.app)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running Locally](#-running-locally)
- [Building for Production](#-building-for-production)
- [Folder Structure](#-folder-structure)
- [Pages & Routes](#-pages--routes)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## Overview

The SRL frontend is a **React 19 + Vite** single-page application that:

- Displays researcher profiles with individual student CV pages
- Tracks student performance via an interactive leaderboard (monthly & all-time)
- Showcases research sessions, publications, achievements, and activities
- Provides an application form for prospective lab members
- Features a rich animated UI with preloader, page transitions, and particle effects
- Pings the backend on startup every 14 minutes to keep the server warm

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.3.x |
| **Styling** | Tailwind CSS | 3.4.19 |
| **Styling Utils** | clsx + tailwind-merge | Latest |
| **Animations** | Framer Motion | 12.34.3 |
| **Routing** | React Router DOM | 7.13.0 |
| **Icons** | Lucide React | 0.575.0 |
| **Carousel** | Swiper | 12.1.2 |
| **Particles** | @tsparticles/react + slim | 3.x |
| **Effects** | Canvas Confetti | 1.9.4 |
| **Globe** | cobe | 0.6.5 |
| **Data** | XLSX (Excel import/export) | 0.18.5 |
| **Linting** | ESLint | 9.39.1 |
| **CSS Processing** | PostCSS + Autoprefixer | Latest |

---

## 📦 Prerequisites

- **Node.js** ≥ 20.x
- **npm** ≥ 10.x
- Backend API running (see [backend README](../backend/README.md))

```bash
node --version  # v20.x or higher
npm --version   # 10.x or higher
```

---

## 🚀 Installation

```bash
# Clone and navigate to frontend
git clone https://github.com/DabhiChrisha/StudentsResearchLab.git
cd StudentsResearchLab/frontend

# Install dependencies
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Backend API base URL
VITE_API_BASE_URL=http://127.0.0.1:8000
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL of the Express backend | `http://127.0.0.1:8000` (dev) or production URL |

> ⚠️ Vite only exposes variables prefixed with `VITE_` to the browser bundle.  
> ⚠️ For production, update this in your Vercel project's environment variable settings.

---

## 🏃 Running Locally

### Start Development Server

```bash
npm run dev
```

App starts at: `http://localhost:5173` (or `5174` if 5173 is in use)

> Make sure the backend is also running at `http://127.0.0.1:8000` for API calls to work.

### Run Backend Simultaneously

```bash
# From the project root (uses concurrently)
npm run dev

# Or separately:
# Terminal 1 (backend)
cd backend && npm run dev

# Terminal 2 (frontend)
cd frontend && npm run dev
```

---

## 🏗 Building for Production

```bash
npm run build
```

Output goes to `frontend/dist/`. The build:
- Tree-shakes and minifies all JavaScript and CSS
- Applies code splitting for vendor libraries
- Generates hashed filenames for cache busting

### Preview Production Build Locally

```bash
npm run preview
```

Preview at: `http://localhost:4173`

---

## 📂 Folder Structure

```
frontend/
├── public/                       # Static assets (served from root /)
│   └── SRL.svg                   # Lab logo / favicon fallback
│
├── src/
│   ├── App.jsx                   # Root component — routing, keep-alive ping
│   ├── main.jsx                  # React DOM entry point
│   ├── index.css                 # Global CSS styles
│   ├── App.css                   # App-level CSS
│   │
│   ├── components/               # Reusable UI components
│   │   ├── Navbar.jsx            # Transparent sticky navigation bar
│   │   ├── Footer.jsx            # Site footer
│   │   ├── MobileDock.jsx        # Mobile bottom navigation dock
│   │   ├── AnimatedPreloader.jsx # Full-screen animated loading screen
│   │   ├── PageTransitionWrapper.jsx # Framer Motion page transitions
│   │   ├── ScrollToTop.jsx       # Scroll to top on route change
│   │   ├── ErrorBoundary.jsx     # React error boundary with fallback UI
│   │   └── HeadSRL.jsx           # Page metadata / SEO title manager
│   │
│   ├── pages/                    # Route-level page components
│   │   ├── Home.jsx              # Landing page with hero & sections
│   │   ├── Sessions.jsx          # Lab sessions carousel
│   │   ├── Achievements.jsx      # Achievements showcase
│   │   ├── Activities.jsx        # Activity feed
│   │   ├── Publications.jsx      # Research publications library
│   │   ├── Researchers.jsx       # Member directory with search/filter
│   │   ├── LeaderBoard.jsx       # Performance leaderboard (monthly/all-time)
│   │   ├── JoinUs.jsx            # Membership application form
│   │   ├── JoinUsSuccess.jsx     # Post-submission success page
│   │   ├── Appointment.jsx       # Appointment booking page
│   │   ├── OrganizationDetails.jsx # Partner institute details
│   │   ├── StudentCV.jsx         # Individual student CV page
│   │   └── AddPublication.jsx    # Submit a new publication
│   │
│   ├── config/
│   │   └── apiConfig.js          # API_BASE_URL and request header config
│   │
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility/helper functions
│   ├── data/                     # Static JSON data (institutes, etc.)
│   └── assets/                   # Bundled assets (icons, images)
│
├── dist/                         # Production build output (git-ignored)
├── node_modules/                 # Dependencies (git-ignored)
├── .env                          # Local environment variables (git-ignored)
├── .gitignore
├── index.html                    # Vite HTML template
├── package.json
├── vite.config.js                # Vite build config, proxy, code splitting
├── tailwind.config.js            # Tailwind theme customization
├── postcss.config.js             # PostCSS plugins
├── eslint.config.js              # ESLint rules
└── vercel.json                   # Vercel SPA routing (catch-all rewrite)
```

---

## 🗺 Pages & Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, about, timeline, objectives, institutes |
| `/sessions` | Sessions | All lab sessions with media and details |
| `/achievements` | Achievements | Lab milestones and award highlights |
| `/activities` | Activities | Activity log with images |
| `/publications` | Publications | Research papers by category and year |
| `/researchers` | Researchers | Student profiles with search and filter |
| `/leaderboard` | LeaderBoard | Rankings (debate score, attendance, hours) |
| `/join` | JoinUs | Membership application form |
| `/join/success` | JoinUsSuccess | Confirmation after form submission |
| `/appointment` | Appointment | Schedule a lab appointment |
| `/organization/:orgId` | OrganizationDetails | Partner institute details |
| `/cv/:studentId` | StudentCV | Individual student CV / portfolio |
| `/add-publication` | AddPublication | Form to submit a new research paper |
| `*` | Home | All unknown routes redirect to home |

---

## 📜 Available Scripts

Run from the `frontend/` directory:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint on all source files |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set **Root Directory** to `frontend/`
4. Add environment variable: `VITE_API_BASE_URL=<your-backend-url>`
5. Vercel auto-deploys on every push to `main`

The included `vercel.json` configures a catch-all rewrite so React Router handles all routes client-side.

### Manual / Other Hosts

```bash
# Build output
npm run build

# Serve dist/ with any static host (Nginx, Netlify, Cloudflare Pages)
```

> Set `VITE_API_BASE_URL` to the deployed backend URL before building.

---

## 🔗 Backend API Integration

The frontend communicates with the backend (configured in `src/config/apiConfig.js`) for:

| Endpoint | Used By |
|----------|---------|
| `GET /api/sessions` | Sessions page |
| `GET /api/achievements` | Achievements page |
| `GET /api/activities` | Activities page |
| `GET /api/publications` | Publications page |
| `GET /api/papers` | Publications page |
| `GET /api/researchers` | Researchers page |
| `GET /api/leaderboard` | LeaderBoard (all-time) |
| `GET /api/leaderboard/monthly` | LeaderBoard (monthly) |
| `GET /api/leaderboard/top-hours` | LeaderBoard (hours tab) |
| `GET /api/batch-stats` | LeaderBoard stats section |
| `GET /api/timeline` | Home page timeline |
| `GET /api/cv/:enrollment_no` | StudentCV page |
| `POST /api/join_us` | JoinUs form submission |
| `GET /api/health` | App startup keep-alive ping |

See [backend README](../backend/README.md) for full API documentation.

---

## 🐛 Troubleshooting

### Port 5173 Already in Use

```bash
npm run dev -- --port 3000
```

### Environment Variables Not Loading

- Confirm `.env` exists in `frontend/` (not the project root)
- Only `VITE_*` prefixed variables are exposed by Vite
- Restart the dev server after editing `.env`

### Backend API Not Responding

- Verify backend is running at `http://127.0.0.1:8000`
- Check `VITE_API_BASE_URL` in `frontend/.env`
- Check browser DevTools console for CORS or network errors

### Build Fails

```bash
# Clear Vite cache and rebuild
rm -rf node_modules/.vite
npm run build
```

---

## 📄 License

Private — for use within the Students Research Lab at KSV University.
