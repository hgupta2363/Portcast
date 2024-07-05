import { useState, useEffect, useRef } from "react";

interface UseDataLoaderResult<T> {
  data: T | null;
  loading: boolean;
  error: string;
  reloadCallback: () => Promise<void>;
}

/**
 * This customm hooks is used to load data. 
 * @param fetchApiCal, api callback 
 * @param isAutoRefresh, true if you want auto refresh else false.
 * @param refreshTime, refresh data time interval. 
 * @param page, current page. 
 * @returns, loaded data, loading info or error. 
 */
const useDataLoader = <T>(
  fetchApiCall: (s: AbortSignal) => Promise<T>,
  isAutoRefresh = false,
  refreshTime = 10000,
  page = 1,
): UseDataLoaderResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchData = async (isRefresh = false) => {
    try {
      // abort previous request
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      console.log(isRefresh);
      if (!isRefresh) {
        setLoading(true);
      }
      controllerRef.current = new AbortController();
      const signal = controllerRef.current.signal;
      const responseData = await fetchApiCall(signal);
      setData(responseData);
      setError("");
      setLoading(false);
      if (isAutoRefresh && !refreshTimer.current) {
        refreshTimer.current = setInterval(() => {
          fetchData(true);
        }, refreshTime);
      }
    } catch (err: any) {
      setError(err?.messege || "unknown Error");
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      if (refreshTimer.current) {
        clearInterval(refreshTimer.current ?? 0);
        refreshTimer.current = null;
      }
    };
  }, [page]);
  return { data: data, loading, error, reloadCallback: fetchData };
};

export default useDataLoader;
