import styled, { css, keyframes } from 'styled-components';

/* Barcha sahifalar uchun umumiy styled-component bloklar.
   Bu yerda faqat styled elementlar — alohida React komponent yo'q. */

const c = (key) => ({ theme }) => theme.colors[key];

export const enter = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: none; }
`;

const pop = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(.98); }
  to   { opacity: 1; transform: none; }
`;

const fade = keyframes`from { opacity: 0; } to { opacity: 1; }`;

/* ---------- Sahifa sarlavhasi ---------- */
/* Diqqat: bu yerda transform ishlatilmaydi — aks holda ichidagi
   position: fixed modal oynalar butun ekranni qoplamay qoladi. */
export const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${fade} 0.3s ease;
`;

export const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: ${c('ink')};
`;

export const PageSub = styled.p`
  margin-top: 6px;
  color: ${c('gray')};
  font-size: 14px;
  max-width: 60ch;
`;

/* ---------- Tugmalar ---------- */
const variants = {
  primary: css`
    background: ${c('primary')};
    color: #fff;
    &:hover { background: ${c('primaryHover')}; }
  `,
  dark: css`
    background: ${c('black')};
    color: #fff;
    &:hover { background: ${({ theme }) => (theme.mode === 'dark' ? theme.colors.primary : theme.colors.ink)}; }
  `,
  ghost: css`
    background: ${c('white')};
    color: ${c('ink')};
    border: 1px solid ${c('border')};
    &:hover { border-color: ${c('primary')}; color: ${c('primary')}; }
  `,
  danger: css`
    background: ${c('danger')};
    color: #fff;
    &:hover { filter: brightness(0.94); }
  `,
};

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ $size }) => ($size === 'lg' ? '48px' : '40px')};
  padding: 0 ${({ $size }) => ($size === 'lg' ? '22px' : '16px')};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  transition: background 0.18s, color 0.18s, border-color 0.18s, transform 0.1s;
  ${({ $variant = 'primary' }) => variants[$variant]}
  ${({ $block }) => $block && 'width: 100%;'}
  &:active { transform: translateY(1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  svg { width: 18px; height: 18px; }
`;

export const IconButton = styled.button`
  width: 34px;
  height: 34px;
  display: inline-grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${c('gray')};
  transition: background 0.15s, color 0.15s;
  svg { width: 17px; height: 17px; }
  &:hover {
    background: ${({ $danger, theme }) => ($danger ? theme.colors.dangerSoft : theme.colors.primarySoft)};
    color: ${({ $danger, theme }) => ($danger ? theme.colors.danger : theme.colors.primary)};
  }
`;

/* ---------- Karta va panel ---------- */
export const Card = styled.section`
  background: ${c('white')};
  border: 1px solid ${c('border')};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  ${({ $pad }) => $pad !== false && 'padding: 20px;'}
`;

export const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  h3 { font-size: 16px; font-weight: 700; letter-spacing: -0.01em; }
  span { color: ${c('gray')}; font-size: 13px; }
`;

/* ---------- Statistika qatori (filtr sifatida ham ishlaydi) ---------- */
export const Chips = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const Chip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.border)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primarySoft : theme.colors.white)};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.gray)};
  font-weight: 500;
  transition: all 0.15s;
  b {
    font-size: 16px;
    font-weight: 800;
    color: ${({ $active, theme }) => ($active ? theme.colors.primary : theme.colors.ink)};
  }
  &:hover { border-color: ${c('primary')}; }
`;

/* ---------- Asboblar paneli ---------- */
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid ${c('border')};
  flex-wrap: wrap;
`;

export const Search = styled.label`
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${c('bg')};
  border: 1px solid transparent;
  color: ${c('grayLight')};
  transition: border-color 0.15s, background 0.15s;
  &:focus-within { border-color: ${c('primary')}; background: ${c('white')}; }
  svg { width: 17px; height: 17px; flex-shrink: 0; }
  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: ${c('ink')};
    &::placeholder { color: ${c('grayLight')}; }
  }
`;

export const Select = styled.select`
  height: 40px;
  padding: 0 34px 0 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${c('border')};
  background: ${c('white')}
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")
    no-repeat right 12px center;
  appearance: none;
  outline: none;
  cursor: pointer;
  &:focus { border-color: ${c('primary')}; }
`;

/* ---------- Jadval ---------- */
export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: ${({ $min }) => $min || '760px'};

  th {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: ${c('grayLight')};
    padding: 12px 16px;
    background: ${c('primaryFaint')};
    border-bottom: 1px solid ${c('border')};
    white-space: nowrap;
  }
  td {
    padding: 14px 16px;
    border-bottom: 1px solid ${c('border')};
    vertical-align: middle;
  }
  tbody tr { transition: background 0.12s; }
  tbody tr:hover { background: ${c('primaryFaint')}; }
  tbody tr:last-child td { border-bottom: none; }
`;

export const Person = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  strong { display: block; font-weight: 600; color: ${c('ink')}; }
  small { display: block; color: ${c('gray')}; font-size: 12.5px; }
`;

export const Avatar = styled.span`
  width: ${({ $size }) => $size || 38}px;
  height: ${({ $size }) => $size || 38}px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: ${({ $square }) => ($square ? '10px' : '50%')};
  background: ${({ $dark, theme }) => ($dark ? theme.colors.black : theme.colors.primarySoft)};
  color: ${({ $dark, theme }) => ($dark ? '#fff' : theme.colors.primary)};
  font-weight: 700;
  font-size: 13px;
  svg { width: 18px; height: 18px; }
`;

export const Muted = styled.span`
  color: ${c('gray')};
`;

export const Actions = styled.div`
  display: flex;
  gap: 2px;
  justify-content: flex-end;
`;

/* ---------- Status belgisi ---------- */
const tones = {
  blue: css`background: ${c('primarySoft')}; color: ${c('primary')};`,
  dark: css`background: ${c('black')}; color: #fff;`,
  gray: css`background: ${c('grayBg')}; color: ${c('gray')};`,
  danger: css`background: ${c('dangerSoft')}; color: ${c('danger')};`,
};

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 12.5px;
  font-weight: 600;
  white-space: nowrap;
  ${({ $tone = 'gray' }) => tones[$tone]}
  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.85;
  }
`;

/* ---------- Bo'sh holat ---------- */
export const Empty = styled.div`
  padding: 56px 20px;
  text-align: center;
  color: ${c('gray')};
  svg { width: 36px; height: 36px; color: ${c('grayLight')}; margin-bottom: 10px; }
  h4 { color: ${c('ink')}; font-size: 15px; margin-bottom: 4px; }
  ${({ $boxed, theme }) => $boxed && `background: ${theme.colors.white}; border: 1px solid ${theme.colors.border}; border-radius: 18px;`}
`;

/* ---------- Modal oyna (sahifa ichida ishlatiladi) ---------- */
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(12, 27, 46, 0.42);
  backdrop-filter: blur(4px);
  animation: ${fade} 0.18s ease;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: ${({ $w }) => $w || '560px'};
  max-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  background: ${c('white')};
  border-radius: 20px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  animation: ${pop} 0.22s cubic-bezier(0.2, 0.9, 0.3, 1.2);
`;

export const ModalHead = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 24px 0;
  h2 { font-size: 19px; font-weight: 800; letter-spacing: -0.02em; }
  p { color: ${c('gray')}; margin-top: 2px; }
`;

export const ModalBody = styled.div`
  padding: 20px 24px;
  overflow-y: auto;
`;

export const ModalFoot = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid ${c('border')};
`;

/* ---------- Forma ---------- */
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 16px;
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: 1fr; }
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  ${({ $full }) => $full && 'grid-column: 1 / -1;'}
  > span { font-size: 13px; font-weight: 600; color: ${c('ink')}; }
`;

const inputBase = css`
  width: 100%;
  padding: 0 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${c('border')};
  background: ${c('white')};
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  &:focus {
    border-color: ${c('primary')};
    box-shadow: 0 0 0 4px ${c('primarySoft')};
  }
  &::placeholder { color: ${c('grayLight')}; }
`;

export const Input = styled.input`
  ${inputBase}
  height: 42px;
`;

export const Textarea = styled.textarea`
  ${inputBase}
  padding: 10px 12px;
  min-height: 90px;
  resize: vertical;
`;

export const FormSelect = styled(Select)`
  width: 100%;
  height: 42px;
`;

/* ---------- O'chirishni tasdiqlash ---------- */
export const ConfirmBox = styled.div`
  padding: 28px 24px 8px;
  text-align: center;
  > div {
    width: 52px;
    height: 52px;
    margin: 0 auto 14px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: ${c('dangerSoft')};
    color: ${c('danger')};
  }
  h2 { font-size: 18px; font-weight: 800; }
  p { color: ${c('gray')}; margin-top: 6px; }
`;

/* ---------- Yuklanish / bazaga ulanish holati ---------- */
const spin = keyframes`to { transform: rotate(360deg); }`;

export const LoaderBox = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px;
  text-align: center;
  background: ${c('bg')};
  h2 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
  p { color: ${c('gray')}; max-width: 46ch; }
  .err {
    width: 56px;
    height: 56px;
    display: grid;
    place-items: center;
    border-radius: 16px;
    background: ${c('dangerSoft')};
    color: ${c('danger')};
    svg { width: 26px; height: 26px; }
  }
`;

export const Loader = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 3px solid ${c('primarySoft')};
  border-top-color: ${c('primary')};
  animation: ${spin} 0.8s linear infinite;
`;

/* ---------- Xato xabari (pastki o'ng burchakda) ---------- */
export const Toast = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 200;
  max-width: 420px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${c('black')};
  color: #fff;
  box-shadow: ${({ theme }) => theme.shadow.lg};
  animation: ${enter} 0.25s ease;
  span { flex: 1; font-size: 13.5px; }
  button { color: #fff; opacity: 0.7; display: grid; svg { width: 16px; height: 16px; } }
  button:hover { opacity: 1; }
`;

/* ---------- Majburiy maydon belgisi ---------- */
export const Req = styled.i`
  font-style: normal;
  color: ${c('danger')};
  margin-left: 3px;
`;

export const Opt = styled.em`
  font-style: normal;
  font-weight: 500;
  font-size: 11.5px;
  color: ${c('grayLight')};
  margin-left: 6px;
`;

/* ---------- Segment tablar (manba, tur va h.k.) ---------- */
export const SegTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 5px;
  border-radius: 14px;
  background: ${c('white')};
  border: 1px solid ${c('border')};
  width: fit-content;
  max-width: 100%;
`;

export const SegTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13.5px;
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.gray)};
  background: ${({ $active, theme }) => ($active ? (theme.mode === 'dark' ? theme.colors.primary : theme.colors.ink) : 'transparent')};
  transition: all 0.15s;
  svg { width: 16px; height: 16px; }
  b {
    min-width: 22px;
    height: 20px;
    padding: 0 6px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    font-size: 11.5px;
    background: ${({ $active, theme }) => ($active ? (theme.mode === 'dark' ? 'rgba(255,255,255,0.22)' : theme.colors.primary) : theme.colors.grayBg)};
    color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.ink)};
  }
  &:hover { color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.ink)}; }
`;

/* ---------- Yoqish / o'chirish tugmasi ---------- */
export const Toggle = styled.button`
  position: relative;
  width: 46px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 999px;
  background: ${({ $on, theme }) => ($on ? theme.colors.success : theme.colors.border)};
  transition: background 0.2s;
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '23px' : '3px')};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: left 0.2s;
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

/* ---------- Ogohlantirish satri ---------- */
export const Notice = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 13px;
  background: ${({ $tone, theme }) => ($tone === 'danger' ? theme.colors.dangerSoft : theme.colors.primaryFaint)};
  color: ${({ $tone, theme }) => ($tone === 'danger' ? theme.colors.danger : theme.colors.ink)};
  border: 1px solid ${({ $tone, theme }) => ($tone === 'danger' ? theme.colors.dangerBorder : theme.colors.primarySoft)};
  svg { width: 17px; height: 17px; flex-shrink: 0; color: ${({ $tone, theme }) => ($tone === 'danger' ? theme.colors.danger : theme.colors.primary)}; }
`;
