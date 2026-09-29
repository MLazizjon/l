import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useData } from './DataContext';

const SESSION_KEY = 'yukcrm_session';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { users } = useData();
  const [userId, setUserId] = useState(() => {
    try {
      return localStorage.getItem(SESSION_KEY);
    } catch {
      return null;
    }
  });

  // Foydalanuvchi o'chirilsa — sessiya avtomatik tugaydi
  const user = users.find((u) => u.id === userId) || null;

  const login = useCallback(
    (username, password) => {
      const found = users.find(
        (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
      );
      if (!found) return false;
      setUserId(found.id);
      try { localStorage.setItem(SESSION_KEY, found.id); } catch { /* */ }
      return found;
    },
    [users]
  );

  const logout = useCallback(() => {
    setUserId(null);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* */ }
  }, []);

  const value = useMemo(
    () => ({ user, isAdmin: user?.role === 'admin', login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
