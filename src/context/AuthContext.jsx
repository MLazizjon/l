import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useData } from './DataContext';
import { PARTNERS, PARTNER_TYPES, normalize, denormalize } from '../data/partners';

const SESSION_KEY = 'yukcrm_session';
const PARTNER_SESSION_KEY = 'yukcrm_partner_session';
const LAST_PARTNER_LOGIN = 'yukcrm_partner_last_login';
const DRIVER_SESSION_KEY = 'yukcrm_driver_session';
const LAST_DRIVER_LOGIN = 'yukcrm_driver_last_login';

const read = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* */ } };
const readPartnerSession = () => {
  try { return JSON.parse(read(PARTNER_SESSION_KEY)) || null; } catch { return null; }
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const data = useData();
  const { users, drivers, create } = data;
  const [userId, setUserId] = useState(() => read(SESSION_KEY));
  const [partnerSession, setPartnerSession] = useState(readPartnerSession);
  const [driverId, setDriverId] = useState(() => read(DRIVER_SESSION_KEY));

  // O'chirilgan hisob bo'lsa — sessiya avtomatik tugaydi (admin o'chirsa, tizimdan chiqib ketadi)
  const user = users.find((u) => u.id === userId) || null;
  const partner = useMemo(() => {
    if (!partnerSession || !PARTNERS[partnerSession.type]) return null;
    const raw = data[PARTNERS[partnerSession.type].collection].find((x) => x.id === partnerSession.id);
    // Admin loginni olib tashlasa ham kabinet yopiladi
    return raw && raw.username ? normalize(partnerSession.type, raw) : null;
  }, [partnerSession, data]);
  // Haydovchi o'chirilsa yoki logini olib tashlansa — kabinet yopiladi
  const driver = useMemo(
    () => drivers.find((d) => d.id === driverId && d.username) || null,
    [drivers, driverId]
  );

  /* ---------- Xodimlar (admin, direktor, dispetcher) ---------- */
  const login = useCallback(
    (username, password) => {
      const found = users.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
      );
      if (!found) return false;
      setUserId(found.id);
      write(SESSION_KEY, found.id);
      return found;
    },
    [users]
  );

  const logout = useCallback(() => {
    setUserId(null);
    write(SESSION_KEY, null);
  }, []);

  /* ---------- Hamkorlar (zavod, broker, logistika kompaniyasi) ---------- */
  // Login uch jadvalning hammasida qidiriladi — hamkor turini tanlash shart emas
  const findPartnersByLogin = useCallback(
    (username) => {
      const q = username.trim().toLowerCase();
      if (!q) return [];
      return PARTNER_TYPES.flatMap((type) =>
        data[PARTNERS[type].collection]
          .filter((p) => p.username && p.username.toLowerCase() === q)
          .map((p) => normalize(type, p))
      );
    },
    [data]
  );

  const findDriverByLogin = useCallback(
    (username) => {
      const q = username.trim().toLowerCase();
      return q ? drivers.find((d) => d.username && d.username.toLowerCase() === q) || null : null;
    },
    [drivers]
  );

  // Login butun tizimda yagona: xodimlar, hamkorlar va haydovchilar
  const loginTaken = useCallback(
    (username) =>
      findPartnersByLogin(username).length > 0 ||
      !!findDriverByLogin(username) ||
      users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase()),
    [findPartnersByLogin, findDriverByLogin, users]
  );

  const startPartnerSession = (type, id, username) => {
    const s = { type, id };
    setPartnerSession(s);
    write(PARTNER_SESSION_KEY, JSON.stringify(s));
    write(LAST_PARTNER_LOGIN, username);
  };

  // Natija: { ok } yoki { error: 'not_found' | 'wrong_password' | 'inactive' }
  const partnerLogin = useCallback(
    (username, password) => {
      const found = findPartnersByLogin(username);
      if (!found.length) return { error: 'not_found' };
      const match = found.find((p) => p.password === password);
      if (!match) return { error: 'wrong_password' };
      if (match.status === 'Nofaol') return { error: 'inactive' };
      startPartnerSession(match.type, match.id, match.username);
      return { ok: true };
    },
    [findPartnersByLogin]
  );

  const partnerRegister = useCallback(
    (type, form) => {
      if (loginTaken(form.username)) return { error: 'taken' };
      const cfg = PARTNERS[type];
      const id = create(cfg.collection, {
        ...denormalize(type, { ...form, status: cfg.defaultStatus }),
        selfRegistered: true,
        createdAt: new Date().toISOString(),
      });
      startPartnerSession(type, id, form.username.trim());
      return { ok: true };
    },
    [create, loginTaken]
  );

  const partnerLogout = useCallback(() => {
    setPartnerSession(null);
    write(PARTNER_SESSION_KEY, null);
  }, []);

  /* ---------- Haydovchilar ---------- */
  const startDriverSession = (id, username) => {
    setDriverId(id);
    write(DRIVER_SESSION_KEY, id);
    write(LAST_DRIVER_LOGIN, username);
  };

  // Natija: { ok } yoki { error: 'not_found' | 'wrong_password' }
  const driverLogin = useCallback(
    (username, password) => {
      const found = findDriverByLogin(username);
      if (!found) return { error: 'not_found' };
      if (found.password !== password) return { error: 'wrong_password' };
      startDriverSession(found.id, found.username);
      return { ok: true };
    },
    [findDriverByLogin]
  );

  // O'zi ro'yxatdan o'tgan haydovchi — admin ro'yxatida alohida ko'rinadi
  const driverRegister = useCallback(
    (form) => {
      if (loginTaken(form.username)) return { error: 'taken' };
      const now = new Date().toISOString();
      const id = create('drivers', {
        name: form.name.trim(),
        phone: form.phone.trim(),
        truck: form.truck.trim(),
        plate: form.plate.trim().toUpperCase(),
        truckType: form.truckType,
        experience: form.experience,
        city: form.location.trim(),
        location: form.location.trim(),
        locationAt: now,
        status: 'Faol',
        username: form.username.trim(),
        password: form.password,
        selfRegistered: true,
        createdAt: now,
      });
      startDriverSession(id, form.username.trim());
      return { ok: true };
    },
    [create, loginTaken]
  );

  const driverLogout = useCallback(() => {
    setDriverId(null);
    write(DRIVER_SESSION_KEY, null);
  }, []);

  const value = useMemo(() => {
    const role = user?.role;
    return {
      user,
      role,
      isAdmin: role === 'admin',
      isDirector: role === 'director',
      // Admin va direktor bir xil boshqaradi: qo'shish, tahrirlash, o'chirish
      canManage: role === 'admin' || role === 'director',
      canSeeAll: role === 'admin' || role === 'director',
      login,
      logout,
      partner,
      partnerLogin,
      partnerRegister,
      partnerLogout,
      findPartnersByLogin,
      loginTaken,
      lastPartnerLogin: read(LAST_PARTNER_LOGIN) || '',
      driver,
      driverLogin,
      driverRegister,
      driverLogout,
      findDriverByLogin,
      lastDriverLogin: read(LAST_DRIVER_LOGIN) || '',
    };
  }, [user, login, logout, partner, partnerLogin, partnerRegister, partnerLogout, findPartnersByLogin, loginTaken,
    driver, driverLogin, driverRegister, driverLogout, findDriverByLogin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export const homePath = (user) => {
  if (!user) return '/login';
  return user.role === 'director' ? '/dashboard' : '/yuklar';
};
