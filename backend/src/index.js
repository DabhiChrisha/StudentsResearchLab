const express = require("express");
const cors = require("cors");

// Import routes
const studentsRouter = require("./routes/students");
const attendanceRouter = require("./routes/attendance");
const sessionsRouter = require("./routes/sessions");
const scoresRouter = require("./routes/scores");
const timelineRouter = require("./routes/timeline");
const joinUsRouter = require("./routes/join_us");
const publicationsRouter = require("./routes/publications");
const cvRouter = require("./routes/cv");
const papersRouter = require("./routes/papers");
const activitiesRouter = require("./routes/activities");
const leaderboardRouter = require("./routes/leaderboard");
const batchStatsRouter = require("./routes/batch_stats");
const metricsRouter = require("./routes/metrics");
const achievementsRouter = require("./routes/achievements");

const app = express();

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  "https://students-research-lab-srl.vercel.app",
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
app.use("/api", studentsRouter);
app.use("/api", attendanceRouter);
app.use("/api", sessionsRouter);
app.use("/api", scoresRouter);
app.use("/api", timelineRouter);
app.use("/api", joinUsRouter);
app.use("/api", publicationsRouter);
app.use("/api", cvRouter);
app.use("/api", papersRouter);
app.use("/api", activitiesRouter);
app.use("/api", leaderboardRouter);
app.use("/api", batchStatsRouter);
app.use("/api", metricsRouter);
app.use("/api", achievementsRouter);

// Global error handler — must be after all routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error", detail: err.message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
