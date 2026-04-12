const express = require("express");
const cors = require("cors");

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

// Import admin routes
const adminAuthRouter = require("./routes/admin");
const adminStudentsRouter = require("./routes/adminStudents");
const adminActivitiesRouter = require("./routes/adminActivities");
const adminScoresRouter = require("./routes/adminScores");
const adminAttendanceRouter = require("./routes/adminAttendance");
const adminTimelineRouter = require("./routes/adminTimeline");
const adminResearchRouter = require("./routes/adminResearch");
const adminAchievementsRouter = require("./routes/adminAchievements");
const imageUploadRouter = require("./routes/imageUpload");

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
  "https://students-research-lab-srl-admin.vercel.app",
  "https://students-research-lab-admin-portal.vercel.app",
];

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json()); // Parse JSON bodies

app.get("/", (req, res) => {
  res.json({ status: "StudentsResearchLab Node.js backend running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "✅ ok",
    allowed_origins: ALLOWED_ORIGINS,
  });
});

// Register routes
app.use("/api", sessionsRouter);
app.use("/api", timelineRouter);
app.use("/api", joinUsRouter);
app.use("/api", publicationsRouter);
app.use("/api", cvRouter);
app.use("/api", papersRouter);
app.use("/api", activitiesRouter);
app.use("/api", leaderboardRouter);
app.use("/api", batchStatsRouter);
app.use("/api", achievementsRouter);
app.use("/api", researchersRouter);

// Register admin routes
app.use("/api", adminAuthRouter);
app.use("/api", adminStudentsRouter);
app.use("/api", adminActivitiesRouter);
app.use("/api", adminScoresRouter);
app.use("/api", adminAttendanceRouter);
app.use("/api", adminTimelineRouter);
app.use("/api", adminResearchRouter);
app.use("/api", adminAchievementsRouter);
app.use("/api", imageUploadRouter);

// Global error handler — must be after all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", detail: err.message });
});

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please kill the process using it and try again.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});
