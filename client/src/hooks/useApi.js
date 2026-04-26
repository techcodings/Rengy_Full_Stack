import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { immediate = true, params = {} } = options;

  const fetchData = useCallback(async (overrideParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data: response } = await API.get(url, { params: { ...params, ...overrideParams } });
      setData(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (immediate) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [immediate]);

  return { data, loading, error, refetch: fetchData };
}
