import { useCallback, useMemo } from 'react';
import { useData } from '../context/DataContext';

export const VISIBILITY_ID = 'korinish';

/* Admin qaysi manba yuklarini dispetcherlarga ko'rsatishini boshqaradi.
   Sozlama bo'lmasa — hammasi ko'rinadi. */
export default function useVisibility() {
  const { settings, cargo, create, update } = useData();
  const row = settings.find((s) => s.id === VISIBILITY_ID);
  const value = useMemo(() => (row && typeof row.value === 'object' ? row.value : {}), [row]);

  const isVisible = useCallback((src) => value[src] !== false, [value]);

  const setVisible = useCallback(
    (patch) => {
      const next = { ...value, ...patch };
      if (row) update('settings', VISIBILITY_ID, { value: next });
      else create('settings', { id: VISIBILITY_ID, value: next });
    },
    [row, value, create, update]
  );

  // Dispetcher ko'radigan yuklar
  const visibleCargo = useMemo(
    () => cargo.filter((c) => isVisible(c.source || (c.brokerId ? 'broker' : 'factory'))),
    [cargo, isVisible]
  );

  return { value, isVisible, setVisible, visibleCargo };
}
