import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import seed from '../data/seed';
import { uid } from '../utils/helpers';

const STORAGE_KEY = 'yukcrm_data_v1';
const DataContext = createContext(null);

const load = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...seed, ...JSON.parse(saved) } : seed;
  } catch {
    return seed;
  }
};

export function DataProvider({ children }) {
  const [data, setData] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* xotira to'lgan bo'lsa jim o'tamiz */
    }
  }, [data]);

  const create = useCallback((collection, item) => {
    setData((d) => ({ ...d, [collection]: [{ ...item, id: uid() }, ...d[collection]] }));
  }, []);

  const update = useCallback((collection, id, patch) => {
    setData((d) => ({
      ...d,
      [collection]: d[collection].map((x) => (x.id === id ? { ...x, ...patch, id } : x)),
    }));
  }, []);

  const remove = useCallback((collection, id) => {
    setData((d) => ({ ...d, [collection]: d[collection].filter((x) => x.id !== id) }));
  }, []);

  const resetData = useCallback(() => setData(seed), []);

  const value = useMemo(
    () => ({ ...data, create, update, remove, resetData }),
    [data, create, update, remove, resetData]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
