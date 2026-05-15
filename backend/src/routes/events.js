const express = require('express');
const { addClient, removeClient } = require('../utils/sseManager');

const router = express.Router();

/**
 * GET /api/events
 *
 * Long-lived Server-Sent Events stream shared by the public website and the
 * admin portal.  No auth required — the channel only carries lightweight
 * notification payloads; each consumer re-fetches real data through its own
 * authenticated endpoints.
 *
 * Events emitted on this stream:
 *   publication_pending   — user submitted a publication (admin listens)
 *   publication_approved  — admin approved a publication (public site listens)
 *   publication_changed   — publication created/updated/deleted by admin (public site listens)
 *   publication_rejected  — admin rejected a publication (admin listens)
 *   activity_changed      — activity created/updated/deleted
 *   achievement_changed   — achievement created/updated/deleted
 *   session_changed       — session created/updated/deleted
 *   leaderboard_changed   — scores or attendance updated
 *   student_changed       — student created/updated/deleted (incl. after join request approval)
 *   join_request_pending  — new join-us form submitted (admin portal listens)
 *   join_request_changed  — join-us form submitted or admin updated/deleted a request
 */
router.get('/api/events', (req, res) => {
  // SSE mandatory headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // Disable proxy/nginx buffering so events reach the client immediately
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Confirm connection to the client
  res.write(': connected\n\n');

  // Heartbeat every 25 s — keeps the connection alive through proxies that
  // close idle streams and gives EventSource a cheap liveness signal.
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
    }
  }, 25_000);

  addClient(res);

  req.on('close', () => {
    clearInterval(heartbeat);
    removeClient(res);
  });
});

module.exports = router;
