require("./config/env");
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const { startCredentialScheduler } = require("./lib/credentialScheduler");

// Import routes
const sessionsRouter = require("./routes/sessions");
const timelineRouter = require("./routes/timeline");
const joinUsRouter = require("./routes/join_us");
const publicationsRouter = require("./routes/publications");
const cvRouter = require("./routes/cv");
const papersRouter = require("./routes/papers");
const activitiesRouter = require("./routes/activities");
const leaderboardRouter = require("./routes/leaderboard");
const batchStatsRouter = require("./routes/batch_stats");
const achievementsRouter = require("./routes/achievements");
const researchersRouter = require("./routes/researchers");
const metricsRouter = require("./routes/metrics");

// Import admin routes
const adminAuthRouter = require("./routes/admin");
const adminStudentsRouter = require("./routes/adminStudents");
const adminActivitiesRouter = require("./routes/adminActivities");
const adminScoresRouter = require("./routes/adminScores");
const adminAttendanceRouter = require("./routes/adminAttendance");
const adminTimelineRouter = require("./routes/adminTimeline");
const adminResearchRouter = require("./routes/adminResearch");
const adminResearchProjectsRouter = require("./routes/adminResearchProjects");
const adminPublicationsRouter = require("./routes/adminPublications");
const adminAchievementsRouter = require("./routes/adminAchievements");
const adminSessionsRouter = require("./routes/adminSessions");
const adminSessionScoresRouter = require("./routes/adminSessionScores");
const adminMemberCVRouter = require("./routes/adminMemberCV");
const userScoresRouter = require("./routes/userScores");
const imageUploadRouter = require("./routes/imageUpload");
const publisherLogosRouter    = require("./routes/publisherLogos");
const adminSymbolsRouter      = require("./routes/adminSymbols");
const publicationSymbolRouter = require("./routes/publicationSymbol");
const eventsRouter            = require("./routes/events");
const sessionsUploadRouter   = require("./routes/sessionsUpload");
const authRouter             = require("./routes/authRoutes");

const app = express();

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
  "http://127.0.0.1:3000",
  "https://students-research-lab-srl.vercel.app",
  "https://students-research-lab-admin-portal.vercel.app",
  "https://srl.mmpsrpc.in",
  "https://api-srl.mmpsrpc.in",
  "authentic-carolin-presurgical.ngrok-free.dev",
  "https://admin-srl.mmpsrpc.in"
];
const ALLOWED_ORIGIN_SET = new Set(ALLOWED_ORIGINS.map((origin) => origin.replace(/\/$/, "")));

app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser clients like curl/Postman often omit Origin entirely.
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, "");
      if (ALLOWED_ORIGIN_SET.has(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    credentials: true,
    optionsSuccessStatus: 204,
  }),
);

// Gzip/Brotli compression — cuts JSON payload size 60-80% (never compress SSE streams)
app.use(
  compression({
    threshold: 1024,
    filter: (req, res) => {
      if (req.path === "/api/events") return false;
      return compression.filter(req, res);
    },
  }),
);

app.use(express.json());

// Cache strategy:
// - Public read-only endpoints: 30s fresh + 5min stale-while-revalidate.
//   This eliminates redundant DB hits on repeat navigations while keeping
//   data fresh enough for a lab website updated a few times per day.
// - /api/activities and /api/researchers are intentionally excluded from
//   public caching because they are updated by the admin portal and the
//   main website must reflect new content immediately.
// - All admin/mutation endpoints: no-store (always fresh).
const PUBLIC_CACHEABLE = [
  '/api/leaderboard',
  '/api/publications',
  '/api/sessions',
  '/api/achievements',
  '/api/timeline',
  '/api/papers',
  '/api/cv/',
  '/api/batch-stats',
];

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  const isPublicGet = req.method === 'GET' &&
    PUBLIC_CACHEABLE.some(prefix => req.path.startsWith(prefix));
  res.setHeader(
    'Cache-Control',
    isPublicGet
      ? 'public, max-age=30, stale-while-revalidate=300, stale-if-error=600'
      : 'no-store',
  );
  next();
});

app.get("/", (req, res) => {
  res.json({ status: "StudentsResearchLab Node.js backend running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Register routes
app.use(sessionsRouter);
app.use(timelineRouter);
app.use(joinUsRouter);
app.use(publicationsRouter);
app.use(cvRouter);
app.use(papersRouter);
app.use(activitiesRouter);
app.use(leaderboardRouter);
app.use(batchStatsRouter);
app.use(achievementsRouter);
app.use(researchersRouter);
app.use(metricsRouter);

// Register admin routes
app.use(adminAuthRouter);
app.use(adminStudentsRouter);
app.use(adminActivitiesRouter);
app.use(adminScoresRouter);
app.use(adminAttendanceRouter);
app.use(adminTimelineRouter);
app.use(adminResearchRouter);
app.use(adminResearchProjectsRouter);
app.use(adminPublicationsRouter);
app.use(adminAchievementsRouter);
app.use(adminSessionsRouter);
app.use(adminSessionScoresRouter);
app.use(adminMemberCVRouter);
app.use(userScoresRouter);
app.use(imageUploadRouter);
app.use(publisherLogosRouter);
app.use(adminSymbolsRouter);
app.use(publicationSymbolRouter);
app.use(eventsRouter);
app.use(sessionsUploadRouter);
app.use(authRouter);

// Global error handler — must be after all routes
app.use((err, req, res, next) => {
  res.status(500).json({ error: "Internal Server Error", detail: "An unexpected error occurred. Please try again later." });
});

if (require.main === module) {
  const PORT = process.env.PORT || 8000;
  const server = app.listen(PORT, () => {});

  startCredentialScheduler();

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      process.exit(1); // exit so nodemon can retry on next rs / file change
    } else {
      process.exit(1);
    }
  });
}

module.exports = app;
