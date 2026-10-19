# YukCRM — logistika CRM (React + styled-components)

Til: **O'zbekcha / Русский / English** — UZ · RU · EN tugmasi. Mavzu: **light / dark** — oy/quyosh tugmasi.

## Ishga tushirish

```bash
npm install
npm start
```

## Rollar

| Rol        | Login       | Parol    | Nima qila oladi |
|------------|-------------|----------|-----------------|
| Admin      | admin       | admin123 | Hamma yuklar, zavod/broker/kompaniya yuklari alohida, qo'shish-tahrirlash-o'chirish, foydalanuvchilar va loginlar, ko'rinish sozlamalari |
| Direktor   | direktor    | dir123   | Admin bilan bir xil + Dashboard, Hisobot, Xodimlar statistikasi |
| Dispetcher | dispetcher  | user123  | Kelgan yuklar (faqat ruxsat berilgan manbalar), Zavodlar, Brokerlar, Logistika kompaniyalari, Haydovchilar, Telegram |

## Hamkorlar kabineti — bitta havola: `/kabinet`

Zavodlar, brokerlar va logistika kompaniyalari shu havola orqali o'zi login/parol yaratadi
(yoki admin yaratib beradi) va o'z kabinetidan yuk joylaydi.
Demo: `zarafshon / 123456` (zavod), `tezyuk / 123456` (broker), `silkroad / 123456` (kompaniya).

## Haydovchi kabineti — havola: `/haydovchi`

Haydovchilar zavod va brokerlar kabi o'zi ro'yxatdan o'tadi (ism, telefon, mashina, davlat raqami,
hozirgi joyi, login/parol) yoki admin bergan login bilan kiradi. Kabinetda:
- **Hozirgi joyi** va **qayerga yuk olmoqchi** ekanini yangilaydi (qachon yangilangani ko'rinadi);
- holatini tanlaydi: **Bo'shman — yuk olaman** yoki **Dam olyapman** (reysda bo'lsa "Yo'lda" — dispetcher boshqaradi);
- o'z reyslarini, yuklash/yetib borish sanalarini va o'ziga to'lovni ko'radi;
- ma'lumotlari va parolini o'zgartiradi.

Admin **Haydovchilar** bo'limida ikki ro'yxat: **Doimiy haydovchilar** (admin qo'shgan) va
**O'zi qo'shilgan haydovchilar** (kabinet orqali). O'zi qo'shilganini bir bosishda doimiyga o'tkazish mumkin.
Haydovchi loginlari **Foydalanuvchilar va loginlar → Haydovchilar** tabida ham ko'rinadi.
Demo: `otabek / 123456`.

**Bazaga:** SQL Editor'da `src/supabase/yangilanish_v3.sql` ni bir marta ishga tushiring.

Yuk formasi — majburiy: nomi, turi, og'irlik, qayerdan, qayerga, narx, telefon;
ixtiyoriy: hajm (m³), mashina turi, yuklash sanasi, izoh.

## Yukning yo'li

1. Hamkor kabinetidan yoki admin yuk qo'shadi (admin istalgan hamkor nomidan yoki o'z nomidan).
2. Dispetcher **Yopish** bosadi va hamma ma'lumotni majburiy kiritadi: haydovchi (ro'yxatdan
   yoki yangi), masofa, yuklash va yetib borish sanasi, yuk narxi, haydovchiga to'lov.
3. Hamkor kabinetida haydovchi ma'lumoti ko'rinadi; admin/direktor hammasini ko'radi.
4. Admin **Ko'rinish sozlamalari**da zavod, broker, kompaniya yoki admin yuklarini bir bosishda
   dispetcherlardan yashira oladi.
5. **Foydalanuvchilar va loginlar** bo'limida hamma login/parollar ko'rinadi; hisob o'chirilsa,
   egasi tizimdan darhol chiqib ketadi.

## Telegram'dan avtomatik yuk olish

Kanal/guruhga tushgan yuk e'loni → bot → Supabase Edge Function (`supabase/functions/telegram-webhook`)
→ `yuklar` jadvali (manba: telegram) → saytda darhol ko'rinadi.

1. @BotFather → /newbot → tokenni oling.
2. Botni har bir kanal/guruhga **admin** qiling; saytda Telegram → "Kanal va guruhlar"ga kanalni `@username` bilan qo'shing.
3. Bir marta: `supabase functions deploy telegram-webhook --no-verify-jwt`
   va `supabase secrets set TELEGRAM_SECRET=maxfiy_soz`
4. Saytda Telegram → "Ulash va sinov" → token + maxfiy so'z → "Webhookni ulash".

"Ulash va sinov"da istalgan e'lon matnini qo'yib, tizim undan nimani ajratishini tekshirish mumkin.
Eslatma: bot faqat o'zi admin bo'lgan kanal/guruh xabarlarini ko'radi.

## Supabase

**Mavjud bazani yangilash:** SQL Editor'da `src/supabase/yangilanish_v2.sql`, keyin `src/supabase/yangilanish_v3.sql` ni ishga tushiring
(yangi jadval/ustunlarni qo'shadi, ma'lumotlar o'chmaydi). Yangi bo'sh baza uchun — `yukcrm_supabase.sql`.

Ma'lumotlar Supabase'da saqlanadi (loyiha: **logist**).

1. Supabase → SQL Editor → `src/supabase/yukcrm_supabase.sql` faylini to'liq ishga tushiring.
   **Yangi versiyaga o'tishda ham qayta ishga tushiring** — mavjud ma'lumotlar saqlanadi, yangi jadval/ustunlar qo'shiladi.
2. `npm install` → `npm start`.

- `src/supabase/supabase.js` — Supabase ulanishi (URL va publishable key).
- `src/supabase/jadvallar.js` — ilova nomlari ↔ o'zbekcha jadval/ustun nomlari.
- `src/context/DataContext.jsx` — yuklash, qo'shish, tahrirlash, o'chirish va realtime.
