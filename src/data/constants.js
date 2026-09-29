export const CITIES = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Andijon', "Farg'ona", 'Namangan',
  'Navoiy', 'Qarshi', 'Termiz', 'Urganch', 'Nukus', 'Jizzax', 'Guliston',
];

export const DRIVER_STATUS = ['Faol', "Yo'lda", 'Dam olishda'];
export const CARGO_STATUS = ['Kutilmoqda', "Yo'lda", 'Yetkazildi', 'Bekor qilindi'];
export const BROKER_STATUS = ['Faol', 'Nofaol'];
export const FACTORY_STATUS = ['Hamkor', 'Muzokarada', 'Nofaol'];
export const TG_TYPES = ['Guruh', 'Kanal', 'Bot'];
export const TG_STATUS = ['Ulangan', "O'chirilgan"];
export const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'user', label: 'Foydalanuvchi' },
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
