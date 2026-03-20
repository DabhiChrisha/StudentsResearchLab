import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for consistent and reliable Supabase data fetching with retry and timeout logic.
 */
export const useSupabaseQuery = (fetchFn, dependencies = [], maxRetries = 3, retryInterval = 3000) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);

    // Stable reference to fetchFn to prevent infinite loops if fetchFn is not memoized
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
            console.warn(`Fetch attempt ${currentRetry + 1} failed:`, err.message);
            
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

    // Effect for handling initial fetch and dependency changes
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);
        setRetryCount(0);
        executeFetch(isMounted, 0);
        return () => { isMounted = false; };
    }, dependencies);

    // Effect for handling retries
    useEffect(() => {
        if (retryCount === 0) return;
        let isMounted = true;
        executeFetch(isMounted, retryCount);
        return () => { isMounted = false; };
    }, [retryCount]);

    const manualRetry = () => {
        setRetryCount(0);
        setLoading(true);
        setError(null);
        executeFetch(true, 0);
    };

    return { data, loading, error, retry: manualRetry };
};

/**
 * Global fetch wrapper with timeout
 */
export const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(id);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timed out after ' + timeout + 'ms');
        }
        throw error;
    }
};
