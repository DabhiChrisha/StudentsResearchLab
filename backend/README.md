# Students Research Lab (SRL) — Backend API

This directory contains the Python-based backend service for the Students Research Lab application. 

The backend is built using **FastAPI** and **HTTPX** to serve as a high-performance, asynchronous data-aggregation proxy between the frontend React application and the Supabase database.

---

## 🧐 Why does this backend exist?

Since the application uses Supabase, you might wonder why we don't just query the database directly from the frontend React app. While the frontend *does* fetch simple tables directly from Supabase, this dedicated backend handles the **heavy computational logic** that is too expensive or complex to run on the client side:

1. **Complex Data Aggregation & Tie-Breaking:**
   - Constructing the Leaderboards requires fetching thousands of rows across `attendance`, `debate_scores`, and `students_details`.
   - The backend specifically calculates metrics like total dynamic hours, counts valid Saturdays, cross-references dates with official `srl_sessions` tables to calculate precise percentage metrics, and handles complex tie-breaking sorting logic (e.g., Score > Attendance % > Total Hours).
2. **Reduced Payload Size:**
   - Instead of sending 5,000+ raw attendance tracking rows to the user's browser, the backend crunches that data securely and sends a single, lightweight JSON array containing exactly what the UI needs to render the podiums.
3. **Institutional DNS Bypass:**
   - Many university or institutional networks block Supabase domains. This backend includes a custom `socket.getaddrinfo` DNS patch targeting Cloudflare IPs (`104.18.38.10`) to bypass local network restrictions seamlessly during development.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) — for rapidly building robust asynchronous endpoints.
- **Server:** [Uvicorn](https://www.uvicorn.org/) — ASGI web server implementation.
- **Async Client:** [HTTPX](https://www.python-httpx.org/) — executing fast, non-blocking REST calls to Supabase.
- **Database Access:** Interacts with Supabase exclusively via its secure PostgREST REST APIs utilizing system authorization headers, meaning it avoids heavy SQL drivers and strictly utilizes JSON transport.

### 📂 Directory Structure

```text
backend/
├── main.py                    # The central FastAPI application and router aggregator
├── config.py                  # Environment parsing, CORS settings, and DNS bypass logic
├── requirements.txt           # Python application dependencies
├── Dockerfile                 # (Optional) Docker image configuration for cloud deployment
└── routes/                    # Modular API route handlers
    ├── leaderboard_routes.py  # Algorithms for Overall, Monthly, and Top-Hours leaderboards
    ├── attendance_routes.py   # Calculators for general and SRL-specific attendance percentages
    ├── scores_routes.py       # Debate point data retrieval endpoints
    ├── sessions_routes.py     # SRL sessions metadata endpoints
    └── students_routes.py     # Unified student profiles and metrics construction
```

---

## 🚀 Local Development Setup

Follow these steps to run the backend engine safely on your local machine.

### 1. Prerequisites
- Python 3.9 or higher
- `pip` package manager

### 2. Install Dependencies
It's highly recommended to use a virtual environment to prevent dependency conflicts.

```bash
# Navigate into the backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install the required packages
pip install -r requirements.txt
```

### 3. Environment Variables
You must provide the backend with Supabase credentials so it can authorize its REST queries.

Create a `.env` file in the root of the `backend/` directory:

```env
# backend/.env

# The URL of your Supabase project (e.g., https://xyz.supabase.co)
SUPABASE_URL=your_supabase_url_here

# The secret SERVICE_ROLE or ANON key for your Supabase project
SUPABASE_KEY=your_supabase_key_here

# Optional: Set the allowed frontend URL for CORS (defaults to localhost locally)
FRONTEND_URL=http://localhost:5173 
```

### 4. Run the Server
Start the Uvicorn development server with hot-reloading enabled:

```bash
uvicorn main:app --reload
```

The server will launch at `http://127.0.0.1:8000`.

---

## 📡 Core Endpoints & Usage

Once running, FastAPI automatically generates an interactive swagger documentation interface. You can explore and test all endpoints directly by visiting:
👉 **`http://127.0.0.1:8000/docs`**

### Summary of Key Routes:

- **`GET /api/leaderboard`**
  Calculates the all-time ranking. Combines `debate_scores` points, aggregates total hours logged, counts eligible Saturdays, and returns a strictly sorted array for the Podium features.

- **`GET /api/leaderboard/monthly?year=YYYY&month=M`**
  Isolates debate scores for the given month, overriding the total score calculations, and breaks ties based on the cumulative dataset.

- **`GET /api/leaderboard/top-hours`**
  Dynamically filters the current calendar month to evaluate purely who dedicated the most hours.

- **`GET /api/attendance/{enrollment_no}/srl_percentage`**
  A highly specific route that extracts all officially recorded `srl_sessions` dates and cross-references them against a single student's attendance dates to yield their exact SRL-participation percentage.

---

## ☁️ Deployment Notes

When deploying this application (e.g., to Render, Heroku, or a Docker container):

- The `is_cloud_deployment` flag inside `config.py` automatically detects host environments like Render or Vercel via process environment variables (`RENDER=true`).
- When a cloud environment is detected, the internal DNS overriding patch is safely disabled to prevent Server Name Indication (SNI) routing failures. 
- Ensure that you add `SUPABASE_URL` and `SUPABASE_KEY` to the environment secret configurations of your cloud provider.
