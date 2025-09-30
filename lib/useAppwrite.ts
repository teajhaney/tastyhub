import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';

interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  fn: (params: P) => Promise<T>;
  params?: P;
  skip?: boolean;
}

interface UseAppwriteReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: (newParams?: P) => Promise<void>;
}

const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fn({ ...fetchParams });
        setData(result);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  // Create a stable key from params to avoid triggering fetches due to new object identities
  const paramsKey = useMemo(() => {
    try {
      return JSON.stringify(params ?? {});
    } catch {
      return '';
    }
  }, [params]);

  // Track last executed key to prevent double-invocations in React StrictMode
  const lastExecutedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (skip) return;
    if (lastExecutedKeyRef.current === paramsKey) return;
    lastExecutedKeyRef.current = paramsKey;
    fetchData(params);
  }, [fetchData, params, paramsKey, skip]);

  const refetch = useCallback(
    async (newParams?: P) => {
      await fetchData(newParams || params);
    },
    [fetchData, params]
  );

  return { data, loading, error, refetch };
};

export default useAppwrite;
