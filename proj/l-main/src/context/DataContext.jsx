import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw, DatabaseZap, X } from 'lucide-react';
import { supabase } from '../supabase/supabase';
import { TABLES, fromDb, toDb } from '../supabase/jadvallar';
import { uid } from '../utils/helpers';
import { Loader, LoaderBox, Toast, Button } from '../styles/ui';
import { t } from '../i18n';

const DataContext = createContext(null);
const EMPTY = { users: [], drivers: [], brokers: [], factories: [], telegram: [], cargo: [], companies: [], settings: [] };
const COLLECTIONS = Object.keys(TABLES);

/* Supabase xatosini o'zbekcha tushunarli matnga aylantiradi */
const humanError = (err) => {
  const m = err?.message || String(err);
  if (/relation .* does not exist|Could not find the table/i.test(m)) {
    return t("Supabase'da jadvallar topilmadi. yukcrm_supabase.sql faylini SQL Editor'da ishga tushiring.");
  }
  if (/Failed to fetch|NetworkError/i.test(m)) return t("Internet yoki Supabase bilan aloqa yo'q.");
  if (/duplicate key/i.test(m)) return t('Bunday login yoki yozuv allaqachon bor.');
  if (/row-level security/i.test(m)) return t("Ruxsat yo'q (RLS). SQL fayldagi policy'lar o'rnatilganini tekshiring.");
  return m;
};

const upsertLocal = (list, item) =>
  list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [item, ...list];

export function DataProvider({ children }) {
  const [data, setData] = useState(EMPTY);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  const showError = useCallback((err) => {
    setToast(humanError(err));
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 6000);
  }, []);

  /* ---------- Hamma jadvalni yuklash ---------- */
  const loadAll = useCallback(async () => {
    const results = await Promise.all(
      COLLECTIONS.map((c) => supabase.from(TABLES[c]).select('*').order('yaratilgan', { ascending: false }))
    );
    // v2 jadvallari (kompaniyalar, sozlamalar) hali yaratilmagan bo'lsa ham ilova ishlayveradi
    const OPTIONAL = ['companies', 'settings'];
    const failed = results.find((r, i) => r.error && !OPTIONAL.includes(COLLECTIONS[i]));
    if (failed) throw failed.error;
    if (results.some((r) => r.error)) {
      setToast(t("Bazani yangilash kerak: yukcrm_supabase.sql faylini SQL Editor'da qayta ishga tushiring."));
    }
    const next = {};
    COLLECTIONS.forEach((c, i) => { next[c] = (results[i].data || []).map((row) => fromDb(c, row)); });
    setData(next);
  }, []);

  const start = useCallback(async () => {
    setStatus('loading');
    try {
      await loadAll();
      setStatus('ready');
    } catch (err) {
      setLoadError(humanError(err));
      setStatus('error');
    }
  }, [loadAll]);

  useEffect(() => { start(); }, [start]);

  /* ---------- Realtime: boshqa kompyuterdagi o'zgarishlar darhol ko'rinadi ---------- */
  useEffect(() => {
    if (status !== 'ready') return undefined;
    const channel = supabase.channel('yukcrm-ozgarishlar');
    COLLECTIONS.forEach((c) => {
      channel.on('postgres_changes', { event: '*', schema: 'public', table: TABLES[c] }, (payload) => {
        setData((d) => {
          if (payload.eventType === 'DELETE') {
            return { ...d, [c]: d[c].filter((x) => x.id !== payload.old.id) };
          }
          return { ...d, [c]: upsertLocal(d[c], fromDb(c, payload.new)) };
        });
      });
    });
    channel.subscribe();

    // Realtime yoqilmagan jadvallar uchun: oynaga qaytilganda yangilab olamiz
    const onFocus = () => loadAll().catch(() => {});
    window.addEventListener('focus', onFocus);
    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', onFocus);
    };
  }, [status, loadAll]);

  /* ---------- CRUD: ekranda darhol, bazada orqa fonda ---------- */
  // Yangi yozuv id sini qaytaradi (masalan, ro'yxatdan o'tgan zavodni darhol kiritish uchun)
  // createAsync — bazaga yozilishini kutadi (keyingi yozuv unga bog'lanadigan bo'lsa)
  const createAsync = useCallback((collection, item) => {
    const id = item.id || uid();
    const now = new Date().toISOString();
    const full = { createdAt: now, ...item, id };
    setData((d) => ({ ...d, [collection]: [full, ...d[collection].filter((x) => x.id !== id)] }));
    return supabase
      .from(TABLES[collection])
      .insert(toDb(collection, full, { omitEmpty: true }))
      .then(({ error }) => {
        if (error) {
          showError(error);
          setData((d) => ({ ...d, [collection]: d[collection].filter((x) => x.id !== id) }));
          return null;
        }
        return id;
      });
  }, [showError]);

  const create = useCallback((collection, item) => {
    const id = item.id || uid();
    createAsync(collection, { ...item, id });
    return id;
  }, [createAsync]);

  const update = useCallback((collection, id, patch) => {
    let before = null;
    setData((d) => ({
      ...d,
      [collection]: d[collection].map((x) => {
        if (x.id !== id) return x;
        before = x;
        return { ...x, ...patch, id };
      }),
    }));
    const row = toDb(collection, patch);
    delete row.id;
    supabase
      .from(TABLES[collection])
      .update(row)
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          showError(error);
          if (before) setData((d) => ({ ...d, [collection]: d[collection].map((x) => (x.id === id ? before : x)) }));
        }
      });
  }, [showError]);

  const remove = useCallback((collection, id) => {
    let removed = null;
    setData((d) => {
      removed = d[collection].find((x) => x.id === id);
      return { ...d, [collection]: d[collection].filter((x) => x.id !== id) };
    });
    supabase
      .from(TABLES[collection])
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) {
          showError(error);
          if (removed) setData((d) => ({ ...d, [collection]: [removed, ...d[collection]] }));
        }
      });
  }, [showError]);

  // Bazadan qaytadan o'qib olish
  const refresh = useCallback(() => loadAll().catch(showError), [loadAll, showError]);

  const value = useMemo(
    () => ({ ...data, create, createAsync, update, remove, refresh }),
    [data, create, createAsync, update, remove, refresh]
  );

  if (status === 'loading') {
    return (
      <LoaderBox>
        <Loader />
        <p>{t("Ma'lumotlar yuklanmoqda…")}</p>
      </LoaderBox>
    );
  }

  if (status === 'error') {
    return (
      <LoaderBox>
        <span className="err"><DatabaseZap /></span>
        <h2>{t("Bazaga ulanib bo'lmadi")}</h2>
        <p>{loadError}</p>
        <Button onClick={start}><RefreshCw /> {t('Qayta urinish')}</Button>
      </LoaderBox>
    );
  }

  return (
    <DataContext.Provider value={value}>
      {children}
      {toast && (
        <Toast role="alert">
          <span>{toast}</span>
          <button onClick={() => setToast('')} aria-label={t('Yopish')}><X /></button>
        </Toast>
      )}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
