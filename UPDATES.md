# Updates — April 2026

## Backend

### Bug Fixes
- Fixed Express global error handler position (was registered before routes, making `next(err)` calls unreachable)
- Fixed hardcoded Render URL in `App.jsx` keep-alive ping — now uses `API_BASE_URL` from config
- Fixed `ErrorBoundary` blocking navigation after an error — added `key={location.pathname}` to force remount on route change; updated message/hint props to remove the misleading "rest of the page is still working fine" text

### New Routes
- `GET /api/publications` — serves publications from DB with search and category filter
- `GET /api/sessions` — serves session content from `session_content` table
- `GET /api/achievements` — serves achievement content from `achievement_content` table
- `GET /api/leaderboard` — rewritten to query `leaderboard_stats` (All Time)
- `GET /api/leaderboard/monthly` — period-aware, supports `?month=&year=` params with fallback
- `GET /api/leaderboard/top-hours` — hours-sorted, falls back to latest period with data
- `GET /api/papers` — implemented stub (was returning empty); queries `publications.enrollment_nos` with regex exact match, falls back to legacy `paper_authors` join

---

## Database

### New Tables
| Table | Rows | Description |
|---|---|---|
| `session_content` | 6 | Full session data (title, description, media, LinkedIn, category) |
| `achievement_content` | 16 | All achievements (14 existing + 2 new from CSV) |
| `leaderboard_stats` | 190 | Pre-aggregated per student per period (38 × 5 periods) |

### Seeded / Updated
- **`publications`** — added `enrollment_nos` and `year` columns; seeded 23 total entries from CSV
- **`srl_sessions`** — added 6 session attendance dates
- **`activities`** — inserted 2 new entries: IndiaAI Impact Summit 2026, Bridging Theory & Practice
- **`attendance`** and **`debate_scores`** — truncated (data was incorrect; replaced by `leaderboard_stats`)

### Data Fixes
- Rudr Jayeshkumar Halvadiya enrollment corrected in `leaderboard_stats`: `24BECE0094` → `24BECE30094`
- Patel Hency Mukesh (`24BECE30225`) added to `students_details`
- Leaderboard period renamed: `Nov-Dec 2025` → `Dec 2025`

### Migration Files (in `backend/migrations/`)
- `seed_sessions.sql`
- `seed_activities.sql`
- `seed_achievements.sql`
- `seed_leaderboard.sql`

---

## Frontend

### Pages Rewritten (hardcoded → API-driven)
- **`Publications.jsx`** — fetches from `/api/publications`; category filter, skeleton loading
- **`Sessions.jsx`** — fetches from `/api/sessions`; skeleton loading, image carousel preserved
- **`Achievements.jsx`** — fetches from `/api/achievements`; Swiper + confetti + modal UI preserved

### LeaderBoard.jsx
- Period dropdown to switch between Dec 2025 / Jan 2026 / Feb 2026 / Mar 2026 (for Monthly and Hours tabs)
- Search bar filters table by name or enrollment number in real-time
- All 5 columns sortable (Rank, Name, Sessions Attended, Hours Dedicated, Total Score) with asc/desc toggle
- Fixed table search glitch caused by duplicate `key={enrollment}` and `whileInView once:true` — changed to `key={name}` + `animate`

### Home.jsx
- Impact Metrics updated to 6 precise stats: Paper Publications (6), Poster Presentations (4), Case Study Publication (1), Paper Acceptance (3), Chapter Acceptance (2), Awards Won (1)

---

## Cleanup
- Deleted 9 junk/artifact files: `dev_output.txt`, `lint_output.txt`, `monthly.json`, `conflicts.txt`, `status.txt`, `test.py`, `src/config/api.js` (dead code), `backend/.python-version`, `public/index.html` (duplicate)
