import {
  LayoutDashboard, Truck, Handshake, Factory, BarChart3, Users, Package, PackageCheck, Trophy,
  Building2, Send, Eye, PackagePlus, Boxes,
} from 'lucide-react';

/* roles — bu bo'limni qaysi rollar ko'radi (bo'lmasa — hamma).
   badge — menyu yonidagi son: 'open' (ochiq yuklar) yoki 'open:<manba>'.
   Admin va direktor bir xil boshqaradi, direktorda qo'shimcha statistika bor. */
const MANAGERS = ['admin', 'director'];
const DIRECTOR = ['director'];
const USER = ['user'];

export const NAV = [
  {
    section: 'Statistika',
    roles: DIRECTOR,
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/hisobot', label: 'Hisobot', icon: BarChart3 },
      { path: '/xodimlar', label: 'Xodimlar statistikasi', icon: Trophy },
    ],
  },
  {
    section: 'Yuklar',
    items: [
      { path: '/yuklar', label: 'Barcha yuklar', labels: { user: 'Kelgan yuklar' }, icon: Package, badge: 'open', end: true },
      { path: '/yuklar/admin', label: 'Admin yuklari', icon: PackagePlus, roles: MANAGERS, badge: 'open:admin' },
      { path: '/yopilgan', label: 'Yopilgan yuklar', icon: PackageCheck, roles: MANAGERS },
    ],
  },
  {
    section: 'Zavodlar',
    roles: MANAGERS,
    items: [
      { path: '/zavodlar', label: "Zavodlar ro'yxati", icon: Factory },
      { path: '/yuklar/factory', label: 'Zavod yuklari', icon: Boxes, badge: 'open:factory' },
    ],
  },
  {
    section: 'Brokerlar',
    roles: MANAGERS,
    items: [
      { path: '/brokerlar', label: "Brokerlar ro'yxati", icon: Handshake },
      { path: '/yuklar/broker', label: 'Broker yuklari', icon: Boxes, badge: 'open:broker' },
    ],
  },
  {
    section: 'Logistika kompaniyalari',
    roles: MANAGERS,
    items: [
      { path: '/kompaniyalar', label: "Kompaniyalar ro'yxati", icon: Building2 },
      { path: '/yuklar/company', label: 'Kompaniya yuklari', icon: Boxes, badge: 'open:company' },
    ],
  },
  {
    section: 'Hamkorlar',
    roles: USER,
    items: [
      { path: '/zavodlar', label: 'Zavodlar', icon: Factory },
      { path: '/brokerlar', label: 'Brokerlar', icon: Handshake },
      { path: '/kompaniyalar', label: 'Logistika kompaniyalari', icon: Building2 },
    ],
  },
  {
    section: 'Logistika',
    items: [
      { path: '/haydovchilar', label: 'Haydovchilar', icon: Truck },
      { path: '/telegram', label: 'Telegram', icon: Send },
    ],
  },
  {
    section: 'Boshqaruv',
    roles: MANAGERS,
    items: [
      { path: '/foydalanuvchilar', label: 'Foydalanuvchilar va loginlar', icon: Users },
      { path: '/korinish', label: "Ko'rinish sozlamalari", icon: Eye },
    ],
  },
];

export const canSee = (item, role) => !item.roles || item.roles.includes(role);
export const itemLabel = (item, role) => item.labels?.[role] || item.label;

// Eng uzun mos keladigan yo'l (masalan /yuklar/admin, /yuklar emas)
export const findNavItem = (pathname) =>
  NAV.flatMap((s) => s.items)
    .filter((i) => pathname === i.path || pathname.startsWith(`${i.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];
