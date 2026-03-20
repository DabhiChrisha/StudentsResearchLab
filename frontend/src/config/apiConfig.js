/**
 * Centralized API configuration.
 * 
 * In production, VITE_API_BASE_URL should be set to the deployed backend URL.
 * Falls back to the Render-hosted backend so production builds never hit localhost.
 * For local development, set VITE_API_BASE_URL=http://127.0.0.1:8000 in your .env file.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://studentsresearchlab-1.onrender.com';
