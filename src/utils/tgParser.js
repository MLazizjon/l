/* Telegram e'lon matnidan yuk ma'lumotlarini ajratib oladi.
   Xuddi shu mantiq supabase/functions/telegram-webhook/index.ts ichida ham bor —
   birini o'zgartirsangiz, ikkinchisini ham yangilang. */

const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu;
const WORD = "A-Za-zА-Яа-яЁёЎўҚқҒғҲҳʻʼ'’`\\.";

const TRUCKS = [
  [/(tent|тент|fura|фура)/i, 'Tent (fura)'],
  [/(ref|реф)/i, 'Refrijerator'],
  [/(bort|борт)/i, 'Bort'],
  [/(konteyner|контейнер)/i, 'Konteyner'],
  [/(isuzu|исузу|labo|damas)/i, 'Isuzu / kichik'],
  [/(tral|трал)/i, 'Tral'],
  [/(sistern|цистерн|benzovoz)/i, 'Sisterna'],
  [/(sement ?tash|цементовоз)/i, 'Sement tashuvchi'],
];

const num = (s) => Number(String(s).replace(/[\s ]/g, '').replace(',', '.')) || 0;
const clean = (s) => String(s || '').replace(EMOJI, ' ').replace(/[*_#|]/g, ' ').replace(/\s+/g, ' ').trim();
const cap = (s) => clean(s).replace(/^[\s\-–—:.,]+|[\s\-–—:.,]+$/g, '').slice(0, 40);

export function parseCargoText(raw) {
  const text = String(raw || '');
  const lines = text.split(/\r?\n/).map(clean).filter(Boolean);
  const flat = clean(text);
  const out = { title: '', from: '', to: '', weight: '', volume: '', price: '', phone: '', truckType: '', note: '' };

  // 1) Yo'nalish: "Qayerdan: X / Qayerga: Y" yoki "X - Y", "X → Y", "Xdan Yga"
  const lf = text.match(/(?:qayerdan|qaerdan|откуда|from|yuklash joyi|загрузка)\s*[:\-–]\s*([^\n]+)/i);
  const lt = text.match(/(?:qayerga|qaerga|куда|to|tushirish joyi|выгрузка)\s*[:\-–]\s*([^\n]+)/i);
  if (lf && lt) { out.from = cap(lf[1]); out.to = cap(lt[1]); }
  if (!out.from) {
    const arrow = new RegExp(`([${WORD} ]{2,40}?)\\s*(?:→|->|=>|—|–|-|>|➡)\\s*([${WORD} ]{2,40})`);
    const routeLine = text.split(/\r?\n/).find((l) => /(→|->|=>|➡|—|–| - |>)/.test(l) && !/\d{5,}/.test(l));
    const m = routeLine && routeLine.replace(/[→➡⇒⟶]️?/g, ' -> ').replace(EMOJI, ' ').match(arrow);
    if (m) { out.from = cap(m[1]); out.to = cap(m[2]); }
  }
  if (!out.from) {
    const m = flat.match(new RegExp(`([${WORD}]{3,})(?:dan|дан)\\s+([${WORD}]{3,})(?:ga|ka|qa|га)\\b`, 'i'));
    if (m) { out.from = cap(m[1]); out.to = cap(m[2]); }
  }

  // 2) Og'irlik va hajm
  const w = flat.match(/(\d+(?:[.,]\d+)?)\s*(?:tonna|tonn|тонн[а-я]*|тн|tn|t|т)(?![A-Za-zА-Яа-я])/i);
  if (w) out.weight = String(num(w[1]));
  const v = flat.match(/(\d+(?:[.,]\d+)?)\s*(?:m3|m³|м3|м³|kub|куб)/i);
  if (v) out.volume = String(num(v[1]));

  // 3) Narx (so'mda). Dollar bo'lsa — izohga yoziladi
  const pm = flat.match(/(?:narx[i]?|нарх|цена|ставка|оплата|price|to'?lov|tulov)\s*[:\-–]?\s*([\d\s.,]+)\s*(mln|млн|million|ming|тыс|k\b|\$|usd|долл?|so'?m|сум|sum)?/i)
    || flat.match(/([\d][\d\s.,]{2,})\s*(mln|млн|million|so'?m|сум|sum|\$|usd)/i);
  if (pm) {
    const unit = (pm[2] || '').toLowerCase();
    let val = num(pm[1]);
    if (/mln|млн|million/.test(unit)) val *= 1e6;
    else if (/ming|тыс|^k$/.test(unit)) val *= 1e3;
    if (/\$|usd|дол/.test(unit)) out.note = `Narx: ${num(pm[1])} $`;
    else if (val > 0) out.price = String(Math.round(val));
  }

  // 4) Telefon
  const ph = text.match(/(\+?998[\s\-()]*\d{2}[\s\-()]*\d{3}[\s\-()]*\d{2}[\s\-()]*\d{2})/) || text.match(/(\+\d[\d\s\-()]{8,}\d)/);
  if (ph) out.phone = ph[1].replace(/\s+/g, ' ').trim();

  // 5) Mashina turi
  const tr = TRUCKS.find(([re]) => re.test(flat));
  if (tr) out.truckType = tr[1];

  // 6) Yuk nomi: "Yuk: ..." yoki route/telefon bo'lmagan birinchi qator
  const lt2 = text.match(/(?:yuk|груз|cargo|mahsulot|товар)\s*[:\-–]\s*([^\n]+)/i);
  if (lt2) out.title = clean(lt2[1]).slice(0, 80);
  if (!out.title) {
    const first = lines.find((l) => l.length > 2 && !/\d{6,}/.test(l.replace(/\s/g, ''))
      && !(out.from && l.includes(out.from) && out.to && l.includes(out.to)));
    out.title = (first || '').slice(0, 80);
  }
  if (!out.title && out.from) out.title = `${out.from} → ${out.to}`;

  out.isCargo = Boolean(out.from && out.to);
  return out;
}
