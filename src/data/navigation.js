import {
  LayoutDashboard, Package, Truck, Handshake, Factory, Send, BarChart3, Users,
} from 'lucide-react';

/* adminOnly: true — faqat admin ko'radi */
export const NAV = [
  {
    section: 'Asosiy',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, adminOnly: true },
      { path: '/hisobot', label: 'Hisobot', icon: BarChart3, adminOnly: true },
    ],
  },
  {
    section: 'Logistika',
    items: [
      // { path: '/yuklar', label: 'Yuklar', icon: Package },
      { path: '/haydovchilar', label: 'Haydovchilar', icon: Truck },
      { path: '/brokerlar', label: 'Brokerlar', icon: Handshake },
      { path: '/zavodlar', label: 'Zavodlar', icon: Factory },
      // { path: '/telegram', label: 'Telegram', icon: Send },
    ],
  },
  {
    section: 'Tizim',
    items: [{ path: '/foydalanuvchilar', label: 'Foydalanuvchilar', icon: Users, adminOnly: true }],
  },
];

export const findNavItem = (pathname) =>
  NAV.flatMap((s) => s.items).find((i) => pathname.startsWith(i.path));
