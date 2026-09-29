# YukCRM — logistika CRM (React + styled-components)

## Ishga tushirish

```bash
npm install
npm start
```

Brauzerda http://localhost:3000 ochiladi.

| Rol   | Login  | Parol    | Nima qila oladi |
|-------|--------|----------|-----------------|
| Admin | admin  | admin123 | Dashboard, Hisobot, Foydalanuvchilar + hamma bo'limda qo'shish, tahrirlash, o'chirish |
| User  | user   | user123  | Yuklar, Haydovchilar, Brokerlar, Zavodlar, Telegram — faqat ko'rish |

Ma'lumotlar brauzerning localStorage'ida saqlanadi. Backend ulanganda
`src/context/DataContext.jsx` ichidagi `create / update / remove` funksiyalarini API so'rovlari bilan almashtirish kifoya.

## Papkalar tuzilishi

```
src/
├── components/          ← faqat umumiy qismlar
│   ├── Sidebar/  Sidebar.jsx, styles.js
│   └── Header/   Header.jsx,  styles.js
├── pages/               ← har bir bo'lim o'z papkasida
│   ├── Login/            Login.jsx,            styles.js
│   ├── Dashboard/        Dashboard.jsx,        styles.js
│   ├── Yuklar/           Yuklar.jsx,           styles.js
│   ├── Haydovchilar/     Haydovchilar.jsx,     styles.js
│   ├── Brokerlar/        Brokerlar.jsx,        styles.js
│   ├── Zavodlar/         Zavodlar.jsx,         styles.js
│   ├── Telegram/         Telegram.jsx,         styles.js
│   ├── Hisobot/          Hisobot.jsx,          styles.js
│   └── Foydalanuvchilar/ Foydalanuvchilar.jsx, styles.js
├── layout/              MainLayout.jsx, styles.js  (Sidebar + Header + sahifa)
├── context/             AuthContext.jsx (login, rol), DataContext.jsx (ma'lumotlar)
├── data/                seed.js (demo), constants.js (statuslar, shaharlar), navigation.js (menyu)
├── hooks/               useCrud.js (modal ochish/yopish mantiqi)
├── styles/              theme.js (ranglar), GlobalStyle.js, ui.js (umumiy styled bloklar)
├── utils/               helpers.js (formatlash, CSV eksport)
├── App.jsx              marshrutlar va rol himoyasi
└── index.js
```

Ranglar faqat `src/styles/theme.js` da — asosiy och ko'k rangni bitta joyda o'zgartirsangiz, butun sayt o'zgaradi.
