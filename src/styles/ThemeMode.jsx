import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Sun, Moon } from 'lucide-react';
import { lightTheme, darkTheme } from './theme';
import { t } from '../i18n';

const KEY = 'yukcrm_theme';

const initial = () => {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch { /* */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const ModeContext = createContext({ mode: 'light', toggle: () => {} });

/* Light / dark rejim — tanlov brauzerda eslab qolinadi */
export function ThemeModeProvider({ children }) {
  const [mode, setMode] = useState(initial);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#0A0F1B' : '#2563EB');
  }, [mode]);

  const toggle = useCallback(() => {
    setMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch { /* */ }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ mode, toggle }), [mode, toggle]);
  return (
    <ModeContext.Provider value={value}>
      <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>{children}</ThemeProvider>
    </ModeContext.Provider>
  );
}

export const useThemeMode = () => useContext(ModeContext);

const Btn = styled.button`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 11px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.ink};
  transition: all 0.2s;
  svg { width: 17px; height: 17px; transition: transform 0.35s; }
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; color: ${({ theme }) => theme.colors.primary}; }
  &:hover svg { transform: rotate(25deg); }
`;

export function ThemeToggle() {
  const { mode, toggle } = useThemeMode();
  const label = mode === 'dark' ? t("Yorug' rejim") : t("Qorong'i rejim");
  return (
    <Btn type="button" onClick={toggle} title={label} aria-label={label}>
      {mode === 'dark' ? <Sun /> : <Moon />}
    </Btn>
  );
}
