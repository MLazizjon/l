export const uid = () =>
  Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);

export const fmtNumber = (n) =>
  String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');

export const money = (n) => `${fmtNumber(n)}\u00A0so'm`;

export const shortMoney = (n) => {
  const v = Number(n) || 0;
  if (v >= 1e9) return `${(v / 1e9).toFixed(1).replace('.0', '')} mlrd`;
  if (v >= 1e6) return `${(v / 1e6).toFixed(1).replace('.0', '')} mln`;
  if (v >= 1e3) return `${Math.round(v / 1e3)} ming`;
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
