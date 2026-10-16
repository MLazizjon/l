import { Factory, Handshake, Building2 } from 'lucide-react';
import { FACTORY_STATUS, BROKER_STATUS, COMPANY_STATUS } from './constants';

/* Yuk beruvchi hamkorlarning uch turi. Hammasi bir xil ishlaydi:
   o'z kabinetiga login/parol bilan kiradi va yuk joylaydi. */
export const PARTNERS = {
  factory: {
    type: 'factory',
    collection: 'factories',
    fk: 'factoryId',
    icon: Factory,
    one: 'Zavod',
    many: 'Zavodlar',
    cargo: 'Zavod yuklari',
    path: '/zavodlar',
    statuses: FACTORY_STATUS,
    defaultStatus: 'Hamkor',
  },
  broker: {
    type: 'broker',
    collection: 'brokers',
    fk: 'brokerId',
    icon: Handshake,
    one: 'Broker',
    many: 'Brokerlar',
    cargo: 'Broker yuklari',
    path: '/brokerlar',
    statuses: BROKER_STATUS,
    defaultStatus: 'Faol',
  },
  company: {
    type: 'company',
    collection: 'companies',
    fk: 'companyId',
    icon: Building2,
    one: 'Logistika kompaniyasi',
    many: 'Logistika kompaniyalari',
    cargo: 'Kompaniya yuklari',
    path: '/kompaniyalar',
    statuses: COMPANY_STATUS,
    defaultStatus: 'Faol',
  },
};

export const PARTNER_TYPES = Object.keys(PARTNERS);

/* Uch xil jadvalni bitta ko'rinishga keltiradi:
   { id, type, name, contact, phone, city, status, username, password, product, commission } */
export const normalize = (type, p) => {
  if (!p) return null;
  const base = {
    id: p.id,
    type,
    phone: p.phone,
    city: p.city,
    status: p.status,
    username: p.username,
    password: p.password,
    selfRegistered: p.selfRegistered,
    createdAt: p.createdAt,
  };
  if (type === 'broker') return { ...base, name: p.company || p.name, contact: p.name, commission: p.commission };
  if (type === 'factory') return { ...base, name: p.name, contact: p.contact, product: p.product };
  return { ...base, name: p.name, contact: p.contact };
};

/* Formadagi umumiy maydonlarni jadval maydonlariga qaytaradi */
export const denormalize = (type, f) => {
  const base = {
    phone: (f.phone || '').trim(),
    city: f.city,
    status: f.status,
    username: (f.username || '').trim(),
    password: f.password || '',
  };
  if (type === 'broker') {
    return { ...base, company: f.name.trim(), name: (f.contact || '').trim() || f.name.trim(), commission: f.commission ?? '' };
  }
  if (type === 'factory') return { ...base, name: f.name.trim(), contact: (f.contact || '').trim(), product: (f.product || '').trim() };
  return { ...base, name: f.name.trim(), contact: (f.contact || '').trim() };
};

/* Yukning egasi (hamkor) — { type, partner } yoki null */
export const ownerOf = (cargoItem, data) => {
  const src = cargoItem.source || (cargoItem.brokerId ? 'broker' : 'factory');
  const cfg = PARTNERS[src];
  if (!cfg) return null;
  const raw = (data[cfg.collection] || []).find((x) => x.id === cargoItem[cfg.fk]);
  return raw ? normalize(src, raw) : null;
};
