import { t } from '../i18n';

export const CITIES = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Andijon', "Farg'ona", 'Namangan',
  'Navoiy', 'Qarshi', 'Termiz', 'Urganch', 'Nukus', 'Jizzax', 'Guliston',
  'Moskva', 'Olmaota', 'Bishkek', 'Dushanbe', 'Ashxobod', 'Novosibirsk', 'Yekaterinburg',
];

export const DRIVER_STATUS = ['Faol', "Yo'lda", 'Dam olishda'];
export const CARGO_STATUS = ['Kutilmoqda', "Yo'lda", 'Yetkazildi', 'Bekor qilindi'];
export const BROKER_STATUS = ['Faol', 'Nofaol'];
export const FACTORY_STATUS = ['Hamkor', 'Muzokarada', 'Nofaol'];
export const COMPANY_STATUS = ['Faol', 'Nofaol'];
export const TG_TYPES = ['Guruh', 'Kanal', 'Bot'];
export const TG_STATUS = ['Ulangan', "O'chirilgan"];
export const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'director', label: 'Direktor' },
  { value: 'user', label: 'Dispetcher' },
];

export const roleLabel = (role) => t(ROLES.find((r) => r.value === role)?.label || 'Foydalanuvchi');

/* Yuk manbasi: zavod, broker, logistika kompaniyasi yoki adminning o'zi */
export const CARGO_SOURCES = [
  { value: 'factory', label: 'Zavod yuklari' },
  { value: 'broker', label: 'Broker yuklari' },
  { value: 'company', label: 'Kompaniya yuklari' },
  { value: 'admin', label: 'Admin yuklari' },
];
export const sourceOf = (c) => c.source || (c.brokerId ? 'broker' : 'factory');
export const sourceLabel = (s) => t(CARGO_SOURCES.find((x) => x.value === s)?.label || s);

export const TRUCK_TYPES = ['Tent (fura)', 'Refrijerator', 'Bort', 'Konteyner', 'Sement tashuvchi', 'Isuzu / kichik', 'Tral', 'Sisterna'];

export const CARGO_TYPES = [
  'Qurilish materiallari', 'Oziq-ovqat', 'Sanoat mahsuloti', 'Metall', 'Tekstil', "Qishloq xo'jaligi",
  'Kimyoviy mahsulot', 'Mebel', 'Texnika / uskuna', 'Maishiy tovarlar', 'Boshqa',
];

const TONES = {
  Faol: 'blue',
  "Yo'lda": 'dark',
  'Dam olishda': 'gray',
  Kutilmoqda: 'gray',
  Yetkazildi: 'blue',
  'Bekor qilindi': 'danger',
  Nofaol: 'gray',
  Hamkor: 'blue',
  Muzokarada: 'dark',
  Ulangan: 'blue',
  "O'chirilgan": 'gray',
};

export const toneOf = (status) => TONES[status] || 'gray';
