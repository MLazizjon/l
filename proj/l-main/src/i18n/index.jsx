import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import ru from './ru';
import en from './en';

/* Uch tilli tizim: o'zbek (asosiy), rus va ingliz.
   Kalit — o'zbekcha matnning o'zi: t("Kelgan yuklar") → "Входящие грузы".
   Lug'atda topilmasa, o'zbekcha matn ko'rsatiladi. */

export const LANGS = [
  { value: 'uz', label: 'UZ', name: "O'zbekcha" },
  { value: 'ru', label: 'RU', name: 'Русский' },
  { value: 'en', label: 'EN', name: 'English' },
];

const DICTS = { ru, en };
const KEY = 'yukcrm_lang';

const readLang = () => {
  try {
    const v = localStorage.getItem(KEY);
    return LANGS.some((l) => l.value === v) ? v : 'uz';
  } catch {
    return 'uz';
  }
};

let current = readLang();

/* Har qanday joyda (komponent, helper, konstanta) ishlatsa bo'ladi.
   {name} ko'rinishidagi joylar vars bilan almashtiriladi. */
export const t = (text, vars) => {
  if (text === undefined || text === null || text === '') return text;
  const dict = DICTS[current];
  let out = (dict && dict[text]) || text;
  if (vars) Object.entries(vars).forEach(([k, v]) => { out = out.split(`{${k}}`).join(v ?? ''); });
  return out;
};

export const getLang = () => current;

const LangContext = createContext({ lang: current, setLang: () => {} });

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(current);

  const setLang = useCallback((next) => {
    current = next;
    try { localStorage.setItem(KEY, next); } catch { /* */ }
    document.documentElement.lang = next;
    setLangState(next);
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

/* Til o'zgarganda komponent qayta chiziladi */
export const useLang = () => useContext(LangContext);

const Seg = styled.div`
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  border-radius: 11px;
  background: ${({ $dark, theme }) => ($dark ? 'rgba(255,255,255,0.08)' : theme.colors.grayBg)};
  border: 1px solid ${({ $dark, theme }) => ($dark ? 'rgba(255,255,255,0.1)' : theme.colors.border)};
  button {
    height: 28px;
    min-width: 34px;
    padding: 0 8px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: ${({ $dark, theme }) => ($dark ? 'rgba(255,255,255,0.6)' : theme.colors.gray)};
    transition: all 0.15s;
  }
  button[aria-pressed='true'] {
    background: ${({ $dark, theme }) => ($dark ? theme.colors.primary : '#fff')};
    color: ${({ $dark, theme }) => ($dark ? '#fff' : theme.colors.ink)};
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }
`;

export function LangSwitcher({ dark }) {
  const { lang, setLang } = useLang();
  return (
    <Seg $dark={dark} role="group" aria-label="Til / Язык / Language">
      {LANGS.map((l) => (
        <button key={l.value} type="button" title={l.name} aria-pressed={lang === l.value} onClick={() => setLang(l.value)}>
          {l.label}
        </button>
      ))}
    </Seg>
  );
}
