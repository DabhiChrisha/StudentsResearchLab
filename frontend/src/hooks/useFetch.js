import { useState, useEffect, useCallback, useRef } from 'react';
import { API_HEADERS } from '../config/apiConfig';

// ── Module-level response cache (stale-while-revalidate) ─────────────────────
// Survives React re-mounts and route navigations within the same browser tab.
// Key: URL string   Value: { data, ts, ttl }
const _cache = new Map();

export function getCachedResponse(key) {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > entry.ttl) { _cache.delete(key); return null; }
  return entry.data;
}

export function setCachedResponse(key, data, ttl = 30_000) {
  _cache.set(key, { data, ts: Date.now(), ttl });
}

export function invalidateCacheKey(key) { _cache.delete(key); }
export function clearAllCache() { _cache.clear(); }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generic data fetching hook with retry, timeout, and optional client caching.
 *
 * @param {Function} fetchFn        Async function that returns the data.
 * @param {Array}    dependencies   Re-run when these change (like useEffect deps).
 * @param {number}   maxRetries     Times to retry on failure (default 3).
 * @param {number}   retryInterval  ms between retries (default 3000).
 */
export const useFetch = (fetchFn, dependencies = [], maxRetries = 3, retryInterval = 3000) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchFnRef = useRef(fetchFn);
    useEffect(() => {
        fetchFnRef.current = fetchFn;
    }, [fetchFn]);

    const executeFetch = useCallback(async (isMounted, currentRetry) => {
        try {
            const result = await fetchFnRef.current();
            if (isMounted) {
                setData(result);
                setError(null);
                setLoading(false);
            }
        } catch (err) {
            if (err.name === 'AbortError') return; // silently ignore cancellations

            if (currentRetry < maxRetries && isMounted) {
                setTimeout(() => {
                    if (isMounted) setRetryCount(prev => prev + 1);
                }, retryInterval);
            } else if (isMounted) {
                setError("Unable to load data. Please try again.");
                setLoading(false);
            }
        }
    }, [maxRetries, retryInterval]);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        setRetryCount(0);
        executeFetch(isMounted, 0);

        const onVisible = () => {
            if (document.visibilityState === 'visible' && isMounted) {
                setLoading(true);
                setError(null);
                executeFetch(isMounted, 0);
            }
        };
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            isMounted = false;
            document.removeEventListener('visibilitychange', onVisible);
        };
    }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (retryCount === 0) return;
        let isMounted = true;
        executeFetch(isMounted, retryCount);
        return () => { isMounted = false; };
    }, [retryCount, executeFetch]);

    const manualRetry = useCallback(() => {
        setRetryCount(0);
        setLoading(true);
        setError(null);
        executeFetch(true, 0);
    }, [executeFetch]);

    /** Refetch in background — no loading spinner (for SSE / live admin updates). */
    const refetchSilent = useCallback(async () => {
        try {
            await fetchFnRef.current();
        } catch (err) {
            if (err.name !== 'AbortError') {
            }
        }
    }, []);

    return { data, loading, error, retry: manualRetry, refetchSilent };
};

/**
 * fetch wrapper with timeout support.
 * Pass { cacheKey, cacheTtl } to enable stale-while-revalidate client cache.
 *
 * @example
 *   const data = await fetchWithTimeout('/api/leaderboard', {}, 8000, {
 *     cacheKey: 'leaderboard', cacheTtl: 60_000
 *   });
 */
export const fetchWithTimeout = async (url, options = {}, timeout = 10000, cacheOptions = {}) => {
    const { cacheKey, cacheTtl = 30_000 } = cacheOptions;

    // Return cached data immediately if still fresh
    if (cacheKey) {
        const hit = getCachedResponse(cacheKey);
        if (hit) return hit;
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            cache: 'no-store',
            ...options,
            headers: { ...API_HEADERS, ...(options.headers || {}) },
            signal: controller.signal,
        });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (cacheKey) setCachedResponse(cacheKey, data, cacheTtl);
        return data;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out after ' + timeout + 'ms');
        }
        throw error;
    }
};
