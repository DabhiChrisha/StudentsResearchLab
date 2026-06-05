import { useEffect } from "react";
import { API_BASE_URL } from "../config/apiConfig";
import { clearAllCache } from "./useFetch";

const LIVE_EVENTS = [
  "publication_approved",
  "publication_changed",
  "publication_rejected",
  "activity_changed",
  "achievement_changed",
  "session_changed",
  "leaderboard_changed",
  "student_changed",
];

/**
 * One site-wide SSE connection: clears fetch cache and notifies pages to refetch.
 */
export function useSiteLiveUpdates() {
  useEffect(() => {
    const base = (API_BASE_URL || "").replace(/\/+$/, "");
    const url = base ? `${base}/api/events` : "/api/events";
    const es = new EventSource(url);

    const onEvent = (event) => {
      clearAllCache();
      let payload = {};
      try {
        payload = JSON.parse(event.data);
      } catch {
        /* ignore */
      }
      window.dispatchEvent(
        new CustomEvent("srl:live-update", {
          detail: { type: event.type, ...payload },
        }),
      );
    };

    LIVE_EVENTS.forEach((name) => es.addEventListener(name, onEvent));
    es.onerror = (event) => {
      console.error('SSE connection error', event);
    };

    return () => es.close();
  }, []);
}
