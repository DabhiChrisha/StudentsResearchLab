# 🎓 Students Research Lab (SRL) — Frontend

A modern, interactive React web application showcasing university research lab members, tracking performance metrics, sessions, publications, and achievements. Built with **React 19**, **Vite**, **TailwindCSS**, and **Supabase**.

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
- [Available Scripts](#-available-scripts)
- [Key Features](#-key-features)
- [Deployment](#-deployment)

---

## Overview

The Students Research Lab frontend is a comprehensive web platform designed to:

- Display researcher profiles and accomplishments
- Track student leaderboards with real-time performance metrics
- Showcase research sessions, publications, and achievements
- Provide an interactive timeline of lab activities
- Enable student recruitment through an application form

The application communicates with:
- **Supabase** (PostgreSQL database) for data storage
- **Backend API** (Node.js/Express) running on `http://127.0.0.1:8000` for complex data aggregation

---

## 🛠 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.3.1 |
| **Styling** | TailwindCSS | 3.4.19 |
| **Styling Utils** | Tailwind Merge, clsx | Latest |
| **Database Client** | Supabase JS | 2.97.0 |
| **Animations** | Framer Motion | 12.34.3 |
| **Routing** | React Router DOM | 7.13.0 |
| **UI Icons** | Lucide React | 0.575.0 |
| **Carousel** | Swiper | 12.1.2 |
| **Effects** | tsParticles, Canvas Confetti | Latest |
| **Data Format** | XLSX (Excel support) | 0.18.5 |
| **Linting** | ESLint | 9.39.1 |
| **CSS Processing** | PostCSS, Autoprefixer | Latest |

---

## 📦 Prerequisites

Before you begin, make sure you have:

- **Node.js** version 18 or higher
- **npm** (comes with Node.js) or **yarn**
- Git installed on your system
- Access to Supabase project credentials

To check your Node version:
```bash
node --version
npm --version
```

---

## 🚀 Installation

1. **Clone the repository** (if not already done):
```bash
git clone <repository-url>
cd StudentsResearchLab/frontend
```

2. **Install dependencies:**
```bash
npm install
```

This will install all packages listed in `package.json`.

3. **Verify installation:**
```bash
npm list --depth=0
```

---

## 🔐 Environment Variables

Create a `.env` file in the `frontend/` directory with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Backend API Configuration
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcxyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key (public) | JWT token from Supabase dashboard |
| `VITE_API_BASE_URL` | Backend API endpoint | `http://127.0.0.1:8000` (dev) or production URL |

**⚠️ Important:** Variables starting with `VITE_` are exposed to the browser. Never put secrets like database passwords or private API keys here. Only use the anonymous/public key from Supabase.

---

## 🏃 Running Locally

### Development Server

Start the Vite development server:

```bash
npm run dev
```

The application will start at:
```
http://localhost:5173
```

The dev server includes:
- ✅ Hot Module Replacement (HMR) — automatic reload on code changes
- ✅ Fast refresh for React components
- ✅ Source maps for debugging

### With Backend Running

Make sure your backend is also running on `http://127.0.0.1:8000`:

```bash
# In a separate terminal, from backend/ directory
cd ../backend
npm run dev
```

Then access the full application at `http://localhost:5173`.

---

## 🏗 Building for Production

### Create an Optimized Build

```bash
npm run build
```

This command:
- Bundles all code and assets
- Minifies JavaScript and CSS
- Creates source maps (currently disabled in `vite.config.js`)
- Outputs to the `dist/` directory
- Applies code splitting for vendor libraries

Output directory: `frontend/dist/`

### Preview Production Build Locally

After building, preview the production version:

```bash
npm run preview
```

This starts a local server serving the built `dist/` directory at `http://localhost:4173`.

---

## 📂 Folder Structure

```
frontend/
├── src/
│   ├── components/              # React components
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── Publications.jsx
│   │   ├── Achievements.jsx
│   │   ├── Footer.jsx
│   │   └── ...more components
│   ├── pages/                   # Page components
│   │   ├── Home.jsx
│   │   ├── Leaderboard.jsx
│   │   └── ...
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions
│   ├── config/
│   │   └── apiConfig.js         # API endpoint configuration
│   ├── assets/                  # Images, icons, etc.
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Global styles
│   └── App.css                  # App-level styles
├── public/
│   ├── students/                # Student profile images
│   ├── Achievements/            # Achievement images
│   ├── Sessions/                # Session photos
│   └── SRL.svg                  # Logo and fallback images
├── dist/                        # Production build (generated)
├── node_modules/                # Dependencies (generated)
├── .env                         # Environment variables (local)
├── .gitignore                   # Git ignore rules
├── index.html                   # HTML entry point
├── package.json                 # Project metadata & scripts
├── package-lock.json            # Dependency lock file
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
├── postcss.config.js            # PostCSS configuration
├── eslint.config.js             # ESLint rules
└── vercel.json                  # Vercel deployment config
```

### Key Files Explained

- **src/main.jsx** — React entry point; registers global error handlers
- **src/App.jsx** — Root component; sets up routing
- **vite.config.js** — Vite build configuration with React plugin & code splitting
- **tailwind.config.js** — TailwindCSS theme customization
- **public/students/** — Static student profile images served as `/students/imagename.jpg`

---

## 📜 Available Scripts

Run these commands from the `frontend/` directory:

```bash
# Start development server on http://localhost:5173
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint to check code quality
npm run lint

# Also available via npm start (alias for dev)
npm start
```

### Script Details

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Hot-reload development server | Runs on localhost:5173 |
| `npm run build` | Optimize & bundle for production | Creates `dist/` folder |
| `npm run preview` | Test production build locally | Runs on localhost:4173 |
| `npm run lint` | Check code style & potential errors | Terminal output |

---

## ✨ Key Features

### Leaderboard System
- Real-time performance metrics
- Filters by time period (monthly, all-time)
- Sorting by debate score, hours contributed, attendance
- Student profile images and metadata

### Student Profiles
- Enrollment details
- Semester and division information
- Department and batch assignment
- Profile pictures and achievements

### Publications & Achievements
- Showcase research papers
- Display research posters
- Conference presentations
- Award recognition

### Interactive UI
- Particle effects and animations
- Responsive design for mobile/tablet/desktop
- Smooth transitions and hover effects
- Loading states and fallbacks

### Data Management
- Import/export Excel data
- Filter students by department
- Search functionality
- Dynamic data aggregation from backend

---

## 🌐 Deployment

### Vercel (Recommended)

The project includes `vercel.json` for Vercel deployment:

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel auto-deploys on push to main branch

### Other Platforms

**Build command:**
```bash
npm run build
```

**Start command:**
```bash
npm run preview
```

**Environment variables to set:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL` (use production backend URL)

---

## 🔗 Integration with Backend

The frontend expects a backend API running on `VITE_API_BASE_URL` with these endpoints:

```
GET  /api/leaderboard              — Get all-time leaderboard
GET  /api/leaderboard/monthly      — Get monthly rankings
GET  /api/leaderboard/top-hours    — Get top contributors by hours
GET  /api/students                 — Get student list
GET  /api/publications             — Get publications
GET  /api/achievements             — Get achievements
POST /api/join_us                  — Submit application form
```

See the [Backend README](../backend/README_NEW.md) for full API documentation.

---

## 🐛 Troubleshooting

### Issue: Port 5173 already in use
```bash
# Kill process using port 5173 or use different port
npm run dev -- --port 3000
```

### Issue: Environment variables not loading
- Ensure `.env` file exists in `frontend/` root
- Restart dev server after changing `.env`
- Vite only loads `VITE_*` prefixed variables

### Issue: Backend API connection error
- Verify backend is running on `http://127.0.0.1:8000`
- Check `VITE_API_BASE_URL` in `.env`
- Check browser console for CORS errors

### Issue: Supabase connection failing
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active in dashboard
- Ensure Row Level Security (RLS) policies allow anonymous access if needed

---

## 📝 License

<!-- Add your license here -->

---

## 👥 Contributing

<!-- Add contribution guidelines here -->

---

## 📞 Support

For issues or questions, contact the development team or create an issue in the repository.
