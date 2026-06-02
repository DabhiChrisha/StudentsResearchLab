/**
 * Centralized API configuration.
 *
 * In production, VITE_API_BASE_URL should be set to the deployed backend URL.
 * Falls back to localhost for local development.
 * Vercel deployment: Set VITE_API_BASE_URL in the project settings.
 */

/**
 * Default headers for every API request.
 * Includes the ngrok bypass header so the interstitial warning page is skipped
 * when the backend is tunnelled through ngrok.
 */
export const API_HEADERS = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
if (import.meta.env.PROD && !rawApiBaseUrl) {
  throw new Error(
    'Missing VITE_API_BASE_URL in production. Set VITE_API_BASE_URL to the deployed backend URL in Vercel environment variables.',
  );
}

export const API_BASE_URL = rawApiBaseUrl;
