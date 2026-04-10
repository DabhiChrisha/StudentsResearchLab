/**
 * Centralized API configuration.
 *
 * In production, VITE_API_BASE_URL should be set to the deployed backend URL.
 * Falls back to localhost for local development.
 * Vercel deployment: Set VITE_API_BASE_URL in the project settings.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Default headers for every API request.
 * Includes the ngrok bypass header so the interstitial warning page is skipped
 * when the backend is tunnelled through ngrok.
 */
export const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};
