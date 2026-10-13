import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client.js';

/** Loads `path` from the API and reloads whenever the path changes. Pass null to skip. */
export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: Boolean(path), error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!path) return undefined;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    api(path)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));
    return () => {
      alive = false;
    };
  }, [path, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback((data) => setState((s) => ({ ...s, data })), []);
  return { ...state, reload, setData };
}
