# 🔧 Students Research Lab (SRL) — Backend API

A **Node.js/Express** backend service for the Students Research Lab platform. This API serves as a high-performance data aggregation layer between the **React frontend** and **Supabase PostgreSQL database**, handling complex calculations, leaderboard rankings, and real-time metrics.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Why This Backend?](#why-this-backend)
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

The backend handles all complex business logic for the Students Research Lab platform:

- **Leaderboard Aggregation** — Calculates rankings based on debate scores, hours, and attendance
- **Data Merging** — Joins data from multiple Supabase tables (leaderboard_stats, students_details, sessions)
- **Performance Metrics** — Computes attendance percentages, total hours, and tie-breaking logic
- **API Gateway** — Serves optimized JSON responses to the React frontend
- **CORS Handling** — Manages cross-origin requests with proper security headers

---

## Why This Backend?

Given that the application uses **Supabase**, you might wonder why a dedicated backend is needed:

### ✅ Reasons for Backend

1. **Complex Data Aggregation**
   - Leaderboards require joining 1000s of rows across multiple tables
   - Complex tie-breaking logic (Score > Attendance % > Total Hours)
   - Percentage calculations tied to actual session dates
   - Reduced payload: sends 100 rows instead of 5,000 raw records

2. **Server-Side Computation**
   - Heavy calculations don't run in the user's browser
   - Confidential logic stays on the server
   - Can be optimized and cached

3. **Network Reliability**
   - Supabase domains may be blocked on institutional networks
   - Backend acts as a stable proxy
   - Can include DNS workarounds for network restrictions

4. **Security**
   - Additional layer for authentication/validation
   - More granular permission control
   - Can rate-limit and monitor API usage

---

## 🛠 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| **Runtime** | Node.js | 20+ (Alpine) |
| **Framework** | Express.js | 5.2.1 |
| **Database Client** | Supabase JS | 2.102.1 |
| **CORS** | cors | 2.8.6 |
| **Environment** | dotenv | 17.4.1 |
| **Development** | Nodemon | 3.1.14 |
| **Container** | Docker | Alpine Linux |

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** version 20 or higher
- **npm** (comes with Node.js)
- **Supabase account** with a project
- **Git** for version control
- **Docker** (optional, for containerized deployment)

To check your versions:
```bash
node --version    # Should be v20.x or higher
npm --version     # Should be 10.x or higher
```

---

## 🚀 Installation

1. **Navigate to the backend directory:**
```bash
cd StudentsResearchLab/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Verify installation:**
```bash
npm list --depth=0
```

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server Configuration
PORT=8000
NODE_ENV=development
```

### Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcxyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public key | JWT token from Supabase dashboard |
| `PORT` | Server port (optional, defaults to 8000) | `8000` |
| `NODE_ENV` | Environment mode | `development` or `production` |

**⚠️ Important:** The anonymous key (`VITE_SUPABASE_ANON_KEY`) is safe to expose as it's intended for client-side use. Never commit `.env` to version control.

---

## 🗄 Database Setup

### Prerequisites
- Supabase project already created
- Database tables initialized:
  - `leaderboard_stats` — Aggregated leaderboard data
  - `students_details` — Student profile information
  - `srl_sessions` — Session records
  - `activities` — Activity logs
  - `publications` — Research publications
  - `achievements` — Student achievements

### If Tables Don't Exist

Create `backend/migrations/` directory and run SQL migrations:

```bash
# Create migration file
touch backend/migrations/seed_students_details.sql

# Apply migration in Supabase SQL Editor
# Copy contents to https://app.supabase.com → SQL Editor → Run
```

### Verify Database Connection

Start the server and check the health endpoint:

```bash
npm run dev
```

Then test the connection:

```bash
curl http://127.0.0.1:8000/api/health
```

Expected response:
```json
{
  "status": "✅ ok",
  "allowed_origins": [...]
}
```

---

## 🏃 Running Locally

### Development Mode (Recommended)

```bash
npm run dev
```

This starts the server with **Nodemon**, which auto-restarts on file changes:
- Watches all files in `src/` directory
- Automatically restarts on save
- Server runs on `http://127.0.0.1:8000`

### Production Mode

```bash
npm start
```

Runs the server without auto-restart. Use this for testing the production build.

### With Frontend Running

You can run frontend and backend in parallel:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`
Backend:  `http://127.0.0.1:8000`

---

## 📡 API Endpoints

### Health Check

**GET** `/`  
**GET** `/api/health`

Returns server status and allowed origins.

```bash
curl http://127.0.0.1:8000/api/health
```

Response:
```json
{
  "status": "✅ ok",
  "allowed_origins": [
    "http://localhost:5173",
    "https://students-research-lab-srl.vercel.app"
  ]
}
```

---

### Leaderboard Endpoints

#### Get All-Time Leaderboard
**GET** `/api/leaderboard`

Returns all-time performance rankings.

```bash
curl http://127.0.0.1:8000/api/leaderboard
```

Response:
```json
[
  {
    "enrollment_no": "23BECE30532",
    "name": "Patel Krish Himanshu",
    "image": "/students/Patel Krish Himanshu.jpeg",
    "total_score": 95,
    "attendance_percentage": "85%",
    "total_hours": "42.5 Hrs",
    "dept": "CE",
    "semester": "6",
    "div": "A",
    "batch": "2023-2027"
  },
  ...
]
```

---

#### Get Monthly Leaderboard
**GET** `/api/leaderboard/monthly?period=Jan%202026`

Returns rankings for a specific month.

**Query Parameters:**
- `period` — Month and year (e.g., `Dec 2025`, `Jan 2026`)

```bash
curl "http://127.0.0.1:8000/api/leaderboard/monthly?period=Jan%202026"
```

---

#### Get Top Contributors by Hours
**GET** `/api/leaderboard/top-hours`

Returns students ranked by total hours contributed.

```bash
curl http://127.0.0.1:8000/api/leaderboard/top-hours
```

---

### Student Endpoints

#### Get All Students
**GET** `/api/students`

Returns list of all registered students.

```bash
curl http://127.0.0.1:8000/api/students
```

---

#### Get Student Details
**GET** `/api/students/:enrollment_no`

Returns details for a specific student.

```bash
curl http://127.0.0.1:8000/api/students/23BECE30532
```

---

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/publications` | Get all research publications |
| GET | `/api/achievements` | Get student achievements |
| GET | `/api/activities` | Get activity feed |
| GET | `/api/sessions` | Get all lab sessions |
| GET | `/api/attendance` | Get attendance records |
| GET | `/api/scores` | Get debate score records |
| POST | `/api/join_us` | Submit application form |
| GET | `/api/metrics` | Get lab metrics summary |

---

## 📜 Available Scripts

Run these commands from the `backend/` directory:

```bash
# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Database utilities (if using Prisma)
npm run db:pull      # Pull latest schema from database
npm run db:generate  # Generate Prisma client
```

### Script Details

| Command | Purpose | Output |
|---------|---------|--------|
| `npm run dev` | Hot-reload development server | Runs on 127.0.0.1:8000 |
| `npm start` | Runs server without auto-reload | Production-like mode |
| `npm run db:pull` | Sync Prisma schema | Updates schema.prisma |
| `npm run db:generate` | Generate Prisma client | Updates node_modules |

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── index.js                 # Main entry point
│   ├── supabase.js              # Supabase client initialization
│   ├── routes/                  # API route handlers
│   │   ├── leaderboard.js       # Leaderboard aggregation logic
│   │   ├── students.js          # Student endpoints
│   │   ├── publications.js      # Publications endpoints
│   │   ├── achievements.js      # Achievements endpoints
│   │   ├── activities.js        # Activities endpoints
│   │   ├── sessions.js          # Sessions endpoints
│   │   ├── attendance.js        # Attendance endpoints
│   │   ├── scores.js            # Score endpoints
│   │   ├── join_us.js           # Application form handler
│   │   ├── metrics.js           # Metrics endpoints
│   │   ├── timeline.js          # Timeline endpoints
│   │   ├── batch_stats.js       # Batch statistics
│   │   ├── cv.js                # CV/resume endpoints
│   │   └── papers.js            # Papers endpoints
│   └── config/                  # Configuration
│       └── apiConfig.js         # API base URL config
├── migrations/                  # Database migrations
│   ├── seed_students_details.sql
│   ├── seed_leaderboard.sql
│   ├── seed_sessions.sql
│   ├── seed_activities.sql
│   ├── seed_achievements.sql
│   └── seed_publications.js
├── assets/                      # CSV data files
│   ├── SRL Website - Leaderboards Data.csv
│   ├── SRL Website - Publications Data.csv
│   ├── SRL Website - Sessions Data.csv
│   └── ...
├── scripts/                     # Utility scripts
│   └── seed_publications.js
├── .env                         # Environment variables (local)
├── .dockerignore                # Docker ignore file
├── .gitignore                   # Git ignore rules
├── Dockerfile                   # Docker container config
├── package.json                 # Project metadata & scripts
├── package-lock.json            # Dependency lock file
└── README.md                    # This file
```

### Key Files

- **src/index.js** — Express app setup, route registration, CORS configuration
- **src/supabase.js** — Supabase client initialization
- **src/routes/leaderboard.js** — Complex leaderboard calculation logic
- **Dockerfile** — Container image for production deployment

---

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t srl-backend:latest .
```

### Run Container Locally

```bash
docker run -p 8000:8000 \
  -e VITE_SUPABASE_URL=https://your-project.supabase.co \
  -e VITE_SUPABASE_ANON_KEY=your-key-here \
  srl-backend:latest
```

### Docker Compose (Optional)

If you have a `docker-compose.yml` in the root directory:

```bash
docker-compose up backend
```

---

## 🔐 CORS Configuration

The backend allows requests from these origins:

```javascript
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://students-research-lab-srl.vercel.app",
];
```

To add a new origin:

1. Edit `src/index.js`
2. Add your domain to `ALLOWED_ORIGINS`
3. Restart the server

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 8000 already in use
```bash
# Use a different port
PORT=3001 npm run dev

# Or kill existing process
lsof -i :8000
kill -9 <PID>
```

### Issue: Supabase connection error
```
Error: Failed to connect to Supabase
```

Check:
- `.env` file exists with correct credentials
- `VITE_SUPABASE_URL` is the correct project URL
- `VITE_SUPABASE_ANON_KEY` is valid (from Supabase dashboard)
- Supabase project is active

### Issue: CORS error from frontend
```
Access to XMLHttpRequest blocked by CORS policy
```

Solution:
1. Ensure frontend is running on one of the `ALLOWED_ORIGINS`
2. Check `VITE_API_BASE_URL` in frontend `.env` matches backend URL
3. Restart backend after editing CORS configuration

### Issue: "nodemon: command not found"
```bash
# Install Nodemon globally or use npx
npx nodemon src/index.js

# Or reinstall locally
npm install --save-dev nodemon
```

---

## 📊 Database Connection

### Verify Supabase Tables Exist

Query these tables in Supabase SQL Editor:

```sql
-- Check for required tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Expected tables:**
```
leaderboard_stats
students_details
srl_sessions
activities
publications
achievements
```

### Create Missing Tables

If tables are missing, run migrations:

```sql
-- In Supabase SQL Editor, paste contents of:
-- backend/migrations/seed_students_details.sql
-- backend/migrations/seed_leaderboard.sql
-- etc.
```

---

## 🚀 Deployment to Production

### On Vercel

1. Connect repository to Vercel
2. Set environment variables in project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Configure backend URL in frontend `.env`

### On Other Platforms

**Build command:**
```bash
npm install
```

**Start command:**
```bash
npm start
```

**Environment variables:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `NODE_ENV=production`

---

## 📝 License

<!-- Add your license here -->

---

## 👥 Contributing

<!-- Add contribution guidelines here -->

---

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review server logs: `npm run dev`
3. Check Supabase dashboard for database status
4. Create an issue in the repository
