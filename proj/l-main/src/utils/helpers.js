import { t } from '../i18n';

export const uid = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export const fmtNumber = (n) =>
  String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');

export const money = (n) => `${fmtNumber(n)} ${t("so'm")}`;

export const shortMoney = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e9) return `${(v / 1e9).toFixed(1).replace('.0', '')} ${t('mlrd')}`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace('.0', '')} ${t('mln')}`;
  if (v >= 1e3) return `${Math.round(v / 1e3)} ${t('ming')}`;
  return String(v);
};

export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();

export const fmtDate = (d) => {
  if (!d) return '—';
  const [y, m, day] = String(d).slice(0, 10).split('-');
  return `${day}.${m}.${y}`;
};

export const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun', 'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek'];
export const monthName = (i) => t(MONTHS[i]);

export const matches = (item, query, keys) => {
  if (!query) return true;
  const q = query.toLowerCase().trim();
  return keys.some((k) => String(item[k] ?? '').toLowerCase().includes(q));
};

export const today = () => new Date().toISOString().slice(0, 10);

export const downloadCSV = (filename, rows) => {
  const csv = rows
    .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(';'))
    .join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const fmtDateTime = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return fmtDate(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

/* Yopilgan yukdan qolgan foyda: mijoz to'lovi − haydovchiga to'lov */
export const profitOf = (c) =>
  c.trip ? (Number(c.price) || 0) - (Number(c.trip.driverPay) || 0) : 0;

/* Yuklar ro'yxati bo'yicha qisqa statistika (bekor qilinganlar hisobga olinmaydi) */
export const cargoStats = (list) => {
  const live = list.filter((c) => c.status !== 'Bekor qilindi');
  const monthKey = new Date().toISOString().slice(0, 7);
  return {
    count: live.length,
    sum: live.reduce((s, c) => s + (Number(c.price) || 0), 0),
    profit: live.reduce((s, c) => s + profitOf(c), 0),
    tons: live.reduce((s, c) => s + (Number(c.weight) || 0), 0),
    km: live.reduce((s, c) => s + (Number(c.trip?.distance) || 0), 0),
    onRoad: live.filter((c) => c.status === "Yo'lda").length,
    delivered: live.filter((c) => c.status === 'Yetkazildi').length,
    month: live.filter((c) => (c.closedAt || c.date || '').slice(0, 7) === monthKey).length,
  };
};

/* Oxirgi n oy bo'yicha guruhlash: [{ key, label, count, sum }] */
export const lastMonths = (list, n = 6, dateOf = (c) => c.closedAt || c.date) => {
  const now = new Date();
  const out = [];
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const items = list.filter((c) => (dateOf(c) || '').slice(0, 7) === key && c.status !== 'Bekor qilindi');
    out.push({ key, label: monthName(d.getMonth()), count: items.length, sum: items.reduce((s, c) => s + (Number(c.price) || 0), 0) });
  }
  return out;
};

/* Telefon havolasi uchun: bo'shliqlarsiz */
export const telHref = (phone = '') => `tel:${String(phone).replace(/[^\d+]/g, '')}`;
