// src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  activities: `${API_BASE_URL}/api/activities`,
  leaderboard: `${API_BASE_URL}/api/leaderboard`,
  leaderboardMonthly: `${API_BASE_URL}/api/leaderboard/monthly`,
  leaderboardTopHours: `${API_BASE_URL}/api/leaderboard/top-hours`,
};

export default API_BASE_URL;
