# Architecture & Data Flow Summary

## Overview
- **Main Website**: React frontend at `frontend/src/pages/` 
- **Admin Portal**: Separate project at `students-research-lab-admin-portal/src/pages/`
- **Backend**: Express.js API with Prisma ORM at `backend/src/`

---

## 1. MAIN WEBSITE PAGES & SECTIONS

### Frontend Pages (13 sections)
Located at: `frontend/src/pages/`

| Page | Purpose | Data Requirements |
|------|---------|-------------------|
| **Home.jsx** | Landing page | General site info |
| **Researchers.jsx** | Member profiles/directory | Leaderboard data, researcher profiles |
| **LeaderBoard.jsx** | Student rankings & performance | Overall rankings, monthly stats, hours tracked |
| **Publications.jsx** | Research papers & publications | Publication list, filters (year, type, category) |
| **Achievements.jsx** | Milestones & awards | Achievement records with images |
| **Activities.jsx** | Events & activities log | Activity history, photos, dates |
| **Sessions.jsx** | Workshop/seminar records | Session details, dates, attendance |
| **StudentCV.jsx** | Member CV/profile system | Student profiles, CV details, qualifications |
| **Appointment.jsx** | Meeting/appointment booking | Appointment scheduling data |
| **OrganizationDetails.jsx** | Lab info & structure | Organization overview |
| **JoinUs.jsx** | Recruitment/join form | Application submissions |
| **JoinUsSuccess.jsx** | Post-application confirmation | Success message |
| **Timeline.jsx** | Historical timeline view | Timeline entries, milestones |

---

## 2. ADMIN PORTAL PAGES & SECTIONS

### Admin Portal Pages (17 sections)
Located at: `students-research-lab-admin-portal/src/pages/`

| Page | Purpose | Data Requirements |
|------|---------|-------------------|
| **Dashboard.tsx** | Admin overview | Stats, metrics, quick access |
| **Students.tsx** | Student management | CRUD operations on student records |
| **Attendance.tsx** | Attendance tracking | Mark/view/manage attendance |
| **Activities.tsx** | Activity management | Create/edit/delete activities |
| **Achievements.tsx** | Achievement management | Manage achievement records & images |
| **Publications.tsx** | Publication management | CRUD for publications |
| **Sessions.tsx** (SRLSessions.tsx) | Session management | Workshop/seminar management |
| **Scores.tsx** | Score management | Manage student scoring |
| **Leadership.tsx** | Leadership tracking | Track leadership roles |
| **Timeline.tsx** | Timeline events | Manage historical timeline |
| **MemberCV.tsx** | CV/profile management | Edit member profiles |
| **Attendance.tsx** | Advanced attendance | Bulk operations, reports |
| **JoinRequests.tsx** | Recruitment applications | Review join requests |
| **GoogleSheetData.tsx** | Sheet integration | Google Sheets sync |
| **SheetSync.tsx** | Data synchronization | Sync external data |
| **Login.tsx** | Authentication | Admin login |
| **Index.tsx** | Navigation/root | Portal structure |
| **NotFound.tsx** | 404 handling | Error page |

---

## 3. BACKEND API ENDPOINTS

### Public Routes (No Auth Required)

#### Publications
```
GET  /api/publications               - List all approved publications
                                     Query params: search, event_type, year, category
```

#### Leaderboard
```
GET  /api/leaderboard                - Overall rankings
GET  /api/leaderboard/monthly        - Monthly rankings
GET  /api/leaderboard/top-hours      - Students by hours tracked
GET  /api/leaderboard/:period        - Rankings by period (e.g., "Apr 2026")
```

#### Student Data
```
GET  /api/researchers                - Public researcher profiles
GET  /api/cv                         - CV profiles (public)
GET  /api/students-details           - Student information
```

#### Content & Events
```
GET  /api/sessions                   - Workshop/seminar list
GET  /api/activities                 - Activity records
GET  /api/achievements               - Achievement records
GET  /api/timeline                   - Timeline events
GET  /api/papers                     - Research papers
GET  /api/join-us                    - Join requests info
```

#### Metadata
```
GET  /api/batch-stats                - Batch statistics
GET  /api/user-scores                - User score data
GET  /api/publisher-logos            - Publication logos
GET  /api/publication-symbols        - Publication metadata
```

#### Uploads
```
POST /api/activities/:id/photo       - Upload activity photo
POST /api/upload                     - General file upload
```

---

### Admin Protected Routes (Auth Required)

#### Authentication
```
POST /api/admin/login                - Admin login (public, returns token)
POST /api/admin/verify               - Verify admin token
```

#### Admin Student Management
```
GET  /api/admin/students             - List all students (authenticated users)
GET  /api/admin/students/:enrollmentNo - Single student detail
POST /api/admin/students             - Create student (admin only)
PUT  /api/admin/students/:enrollmentNo - Update student (admin only)
DELETE /api/admin/students/:enrollmentNo - Delete student (admin only)
```

#### Admin Activities
```
GET  /api/admin/activities           - List activities (authenticated)
POST /api/admin/activities           - Create activity (admin)
PUT  /api/admin/activities/:id       - Update activity (admin)
DELETE /api/admin/activities/:id     - Delete activity (admin)
```

#### Admin Achievements
```
GET  /api/admin/achievements         - List achievements (authenticated)
POST /api/admin/achievements         - Create achievement (admin)
PUT  /api/admin/achievements/:id     - Update achievement (admin)
DELETE /api/admin/achievements/:id   - Delete achievement (admin)
```

#### Admin Publications
```
GET  /api/admin/publication          - List publications (authenticated)
GET  /api/admin/publication/:id      - Single publication
GET  /api/admin/publications         - Alt endpoint (same as above)
GET  /api/admin/publications/:id     - Alt endpoint
POST /api/admin/publication          - Create publication (admin)
PUT  /api/admin/publication/:id      - Update publication (admin)
DELETE /api/admin/publication/:id    - Delete publication (admin)
```

#### Admin Attendance
```
GET  /api/admin/attendance           - List attendance (authenticated)
GET  /api/admin/attendance/student/:enrollmentNo - Student attendance
POST /api/admin/attendance           - Mark attendance (admin)
PUT  /api/admin/attendance/:id       - Update attendance (admin)
DELETE /api/admin/attendance/:id     - Delete attendance (admin)
```

#### Admin Sessions
```
GET  /api/admin/sessions             - List sessions (authenticated)
POST /api/admin/sessions             - Create session (admin)
PUT  /api/admin/sessions/:id         - Update session (admin)
DELETE /api/admin/sessions/:id       - Delete session (admin)
```

#### Admin Timeline
```
GET  /api/admin/timeline             - List timeline (authenticated)
POST /api/admin/timeline             - Create entry (admin)
PUT  /api/admin/timeline/:id         - Update entry (admin)
DELETE /api/admin/timeline/:id       - Delete entry (admin)
```

#### Admin Scores
```
GET  /api/admin/scores               - View scores (authenticated)
POST /api/admin/scores               - Create/update score (admin)
PUT  /api/admin/scores/:id           - Update score (admin)
DELETE /api/admin/scores/:id         - Delete score (admin)
```

#### Admin Member CV
```
GET  /api/admin/member-cv            - Get CV by enrollment (authenticated)
GET  /api/admin/member-cv/all        - List all CVs (admin)
PUT  /api/admin/member-cv            - Update CV (authenticated user's own)
```

#### Admin Research
```
GET  /api/admin/research             - List research items (authenticated)
POST /api/admin/research             - Create research (admin)
PUT  /api/admin/research/:id         - Update research (admin)
DELETE /api/admin/research/:id       - Delete research (admin)
```

#### Admin Research Projects
```
GET  /api/admin/research-projects    - List projects (authenticated)
POST /api/admin/research-projects    - Create project (admin)
PUT  /api/admin/research-projects/:id - Update project (admin)
DELETE /api/admin/research-projects/:id - Delete project (admin)
```

#### Admin Symbols
```
GET  /api/admin/symbols              - List symbols (authenticated)
POST /api/admin/symbols              - Create symbol (admin)
PUT  /api/admin/symbols/:id          - Update symbol (admin)
DELETE /api/admin/symbols/:id        - Delete symbol (admin)
```

#### Admin SRL Profiles
```
GET  /api/admin/srl-profiles         - List profiles (authenticated)
POST /api/admin/srl-profiles         - Create profile (admin)
PUT  /api/admin/srl-profiles/:id     - Update profile (admin)
DELETE /api/admin/srl-profiles/:id   - Delete profile (admin)
```

---

## 4. DATA FETCHING PATTERNS

### Frontend Architecture

#### API Configuration
**File**: `frontend/src/config/apiConfig.js`
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
export const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};
```

#### Primary Hook: `useFetch`
**File**: `frontend/src/hooks/useFetch.js`

**Features**:
- Generic data fetching with retry logic (default: 3 retries)
- Configurable retry interval (default: 3000ms)
- Built-in module-level response caching (stale-while-revalidate pattern)
- Cache TTL support (default: 30 seconds)
- Auto timeout support
- Survives React re-mounts and route navigations

**Usage Pattern**:
```javascript
const { data, loading, error, retry } = useFetch(
  async () => {
    const json = await fetchWithTimeout(`${API_BASE}/api/leaderboard`);
    return json;
  },
  [],  // dependencies
  3,   // maxRetries
  3000 // retryInterval
);
```

**Cache API**:
```javascript
getCachedResponse(key)        // Get cached data
setCachedResponse(key, data, ttl) // Set cache with TTL
invalidateCacheKey(key)       // Clear specific cache
clearAllCache()               // Clear all cache
```

#### Secondary Hook: `useSiteLiveUpdates`
**File**: `frontend/src/hooks/useSiteLiveUpdates.js`
- Likely handles real-time updates via Server-Sent Events (SSE)

#### Direct Fetch Pattern
Some pages use direct `fetch()` instead of `useFetch`:

**Example** (Publications.jsx):
```javascript
fetch(`${API_BASE_URL}/api/publications`, { headers: API_HEADERS })
  .then(res => res.json())
  .then(data => setData(data))
```

#### Hybrid Approach
Many components use both patterns:
```javascript
// Pattern 1: useFetch for read-only data
const { data: leaderboard } = useFetch(async () => {
  return fetchWithTimeout(`${API_BASE}/api/leaderboard`);
});

// Pattern 2: Direct fetch for writes/mutations
const handleSubmit = async (data) => {
  const res = await fetch(`${API_BASE}/api/join-us`, {
    method: 'POST',
    headers: API_HEADERS,
    body: JSON.stringify(data)
  });
};
```

### Data Fetching Flow

```
Frontend Component
    ↓
useFetch Hook (with retry & caching)
    ↓
fetchWithTimeout() wrapper
    ↓
Fetch API to /api/* endpoint
    ↓
Backend Route Handler
    ↓
Controller (Business Logic)
    ↓
Prisma ORM (Database Query)
    ↓
PostgreSQL Response
    ↓
Cached in Frontend (TTL: 30s)
```

### Common Cache Keys
```
'lb:overall'   - Leaderboard overall rankings (60s TTL)
'lb:monthly'   - Leaderboard monthly rankings (60s TTL)
'lb:hours'     - Leaderboard top hours (60s TTL)
```

---

## 5. AUTHENTICATION & AUTHORIZATION

### Admin Authentication
- **Login**: POST `/api/admin/login` → Returns JWT token
- **Verification**: POST `/api/admin/verify` → Validates token
- **Middleware**: `adminAuthMiddleware` for protected routes
- **Secondary Middleware**: `authenticatedUserMiddleware` for member viewing

### Authorization Levels
1. **Public**: No authentication (publications, leaderboard, etc.)
2. **Authenticated User**: Member accessing own CV data
3. **Admin**: Full CRUD on all resources

---

## 6. KEY CONTROLLERS (Backend Logic)

| Controller | Responsibilities |
|------------|------------------|
| `leaderboardController.js` | Ranking calculations, period filtering |
| `publicationsController.js` | Publication queries, filtering, search |
| `adminStudentsController.js` | Student CRUD operations |
| `adminAuthController.js` | Login, token verification |
| `attendanceController.js` | Attendance tracking |
| `cvController.js` | CV/profile management |
| `adminActivitiesController.js` | Activity management |
| `adminMemberCVController.js` | Member CV admin operations |

---

## 7. DATA STORAGE & MODELS

### Prisma Schema
**Location**: `backend/prisma/schema.prisma`

Key models inferred from controllers:
- `Student` - Student information
- `Publication` - Research publications
- `Activity` - Lab activities
- `Achievement` - Milestones & awards
- `Session` - Workshops/seminars
- `Timeline` - Historical entries
- `Attendance` - Attendance records
- `MemberCV` - Student CV profiles
- `ResearchProject` - Research projects

---

## 8. DEPLOYMENT

### Allowed Origins (CORS)
```
- http://localhost:5173, 5174, 5175
- http://127.0.0.1:5173, 5174, 5175
- http://localhost:3000
- https://students-research-lab-srl.vercel.app (main)
- https://students-research-lab-admin-portal.vercel.app (admin)
```

### Environment Variables
- `VITE_API_BASE_URL` - Backend API URL for frontend
- Database connection strings (backend)
- JWT secrets (admin auth)

---

## 9. TECH STACK

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18+ with Vite, Tailwind CSS, Framer Motion |
| **Admin Portal** | React/TypeScript with shadcn/ui |
| **Backend** | Express.js, Prisma ORM |
| **Database** | PostgreSQL (via Prisma) |
| **File Upload** | Cloudinary integration |
| **Auth** | JWT tokens |
| **Real-time** | Server-Sent Events (SSE) |

---

## 10. CACHING STRATEGY

### Frontend Caching
- **Type**: Stale-while-revalidate (SWR)
- **Scope**: Module-level (survives re-mounts)
- **Default TTL**: 30 seconds
- **Configurable**: Per-request with `cacheKey` and `cacheTtl`

### Backend Caching
- **Disabled for**: Leaderboard (must reflect edits immediately)
- **Database**: Direct Prisma queries

---

## 11. REAL-TIME UPDATES

### SSE Integration
- Hook: `useSiteLiveUpdates`
- Use case: Live data updates without polling
- Likely events: Leaderboard updates, new activities, etc.

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Frontend Pages | 13 |
| Admin Pages | 17 |
| API Routes | 30+ |
| Controllers | 31 |
| Hooks | 2 |
| Data Fetching Patterns | 3 (useFetch, direct fetch, hybrid) |

