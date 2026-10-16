/* Ilova ichidagi nomlar (inglizcha) <-> Supabase jadval va ustunlari (o'zbekcha).
   Sahifalar eski nomlar bilan ishlayveradi, tarjimani shu fayl qiladi. */

export const TABLES = {
  users: 'foydalanuvchilar',
  drivers: 'haydovchilar',
  brokers: 'brokerlar',
  factories: 'zavodlar',
  telegram: 'telegram_guruhlar',
  cargo: 'yuklar',
  companies: 'logistika_kompaniyalari',
  settings: 'sozlamalar',
};

// ilova maydoni -> jadval ustuni
const FIELDS = {
  users: { id: 'id', name: 'ism', username: 'login', password: 'parol', role: 'rol' },
  drivers: {
    id: 'id', name: 'ism', phone: 'telefon', truck: 'mashina', plate: 'raqam', city: 'shahar',
    experience: 'tajriba', status: 'holat',
  },
  brokers: {
    id: 'id', name: 'ism', company: 'kompaniya', phone: 'telefon', commission: 'komissiya', status: 'holat',
    city: 'shahar', username: 'login', password: 'parol', selfRegistered: 'ozi_royxatdan', createdAt: 'yaratilgan',
  },
  companies: {
    id: 'id', name: 'nomi', contact: 'masul_shaxs', phone: 'telefon', city: 'shahar', status: 'holat',
    username: 'login', password: 'parol', selfRegistered: 'ozi_royxatdan', createdAt: 'yaratilgan',
  },
  settings: { id: 'id', value: 'qiymat' },
  factories: {
    id: 'id', name: 'nomi', city: 'shahar', product: 'mahsulot', contact: 'masul_shaxs', phone: 'telefon',
    status: 'holat', username: 'login', password: 'parol', selfRegistered: 'ozi_royxatdan', createdAt: 'yaratilgan',
  },
  telegram: {
    id: 'id', name: 'nomi', username: 'username', type: 'turi', members: 'azolar', status: 'holat', note: 'izoh',
  },
  cargo: {
    id: 'id', title: 'nomi', source: 'manba', factoryId: 'zavod_id', brokerId: 'broker_id', from: 'qayerdan',
    to: 'qayerga', weight: 'ogirlik', price: 'narx', truckType: 'mashina_turi', phone: 'telefon', note: 'izoh',
    status: 'holat', date: 'sana', createdAt: 'yaratilgan', driverId: 'haydovchi_id', closedBy: 'yopgan_xodim_id',
    closedAt: 'yopilgan_vaqt', loadDate: 'yuklash_sanasi', deliveredAt: 'yetkazilgan_sana',
    companyId: 'kompaniya_id', cargoType: 'yuk_turi', volume: 'hajm', addedBy: 'qoshgan',
  },
};

// cargo.trip ichidagi maydonlar
const TRIP = {
  distance: 'masofa_km', loadDate: 'yuklash_sanasi', eta: 'yetib_borish', driverPay: 'haydovchi_tolovi', note: 'yol_izohi',
};

// Ba'zi qiymatlar bazada o'zbekcha saqlanadi
const VALUE_MAP = {
  'users.role': { director: 'direktor', user: 'dispetcher' },
  'cargo.source': { factory: 'zavod', company: 'kompaniya' },
};
const toDbValue = (col, key, v) => VALUE_MAP[`${col}.${key}`]?.[v] ?? v;
const fromDbValue = (col, key, v) => {
  const map = VALUE_MAP[`${col}.${key}`];
  if (!map) return v;
  const found = Object.entries(map).find(([, dbv]) => dbv === v);
  return found ? found[0] : v;
};

/* Bazadan kelgan qatorni ilova obyektiga aylantiradi */
export const fromDb = (collection, row) => {
  const fields = FIELDS[collection];
  const item = {};
  Object.entries(fields).forEach(([key, column]) => {
    const v = row[column];
    item[key] = v === null || v === undefined ? '' : fromDbValue(collection, key, v);
  });
  if (collection === 'cargo' && (row.yopgan_xodim_id || row.haydovchi_tolovi !== null)) {
    item.trip = {};
    Object.entries(TRIP).forEach(([key, column]) => {
      item.trip[key] = row[column] === null || row[column] === undefined ? '' : row[column];
    });
  }
  return item;
};

/* Ilova obyektini (yoki uning bir qismini) bazaga yoziladigan ko'rinishga aylantiradi.
   Bo'sh satrlar NULL bo'ladi — sana, raqam va bog'lanish ustunlari xato bermasligi uchun. */
export const toDb = (collection, item, { omitEmpty = false } = {}) => {
  const fields = FIELDS[collection];
  const row = {};
  Object.entries(item).forEach(([key, v]) => {
    if (key === 'trip' && collection === 'cargo') {
      Object.entries(v || {}).forEach(([tk, tv]) => {
        if (TRIP[tk]) row[TRIP[tk]] = tv === '' ? null : tv;
      });
      return;
    }
    const column = fields[key];
    if (!column) return; // jadvalda yo'q maydon — tashlab ketamiz
    row[column] = v === '' || v === undefined ? null : toDbValue(collection, key, v);
  });
  // Yangi qator qo'shishda bo'sh ustunlarni yubormaymiz — bazadagi default qiymat ishlaydi
  if (omitEmpty) Object.keys(row).forEach((k) => row[k] === null && delete row[k]);
  return row;
};
