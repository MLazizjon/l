-- =====================================================================
--  YukCRM — YANGILANISH v3: HAYDOVCHI KABINETI
--  Supabase → SQL Editor → New query → hammasini qo'yib "Run".
--  Mavjud ma'lumotlar O'CHMAYDI. Qayta ishga tushirsa ham xato bermaydi.
--
--  - Haydovchi /haydovchi havolasi orqali o'zi ro'yxatdan o'tadi (ozi_royxatdan = true)
--  - Admin qo'shgan haydovchilar — doimiy (ozi_royxatdan = false)
--  - Haydovchi hozirgi joyi, yo'nalishi va holatini o'zi yangilaydi
-- =====================================================================

alter table haydovchilar add column if not exists mashina_turi    text;          -- Tent (fura), Refrijerator ...
alter table haydovchilar add column if not exists joriy_joy       text;          -- hozir qayerda
alter table haydovchilar add column if not exists yonalish        text;          -- qayerga yuk olmoqchi
alter table haydovchilar add column if not exists joy_yangilangan timestamptz;   -- joy qachon yangilangan
alter table haydovchilar add column if not exists login           text;
alter table haydovchilar add column if not exists parol           text;
alter table haydovchilar add column if not exists ozi_royxatdan   boolean not null default false;
create unique index if not exists haydovchilar_login_uq on haydovchilar (lower(login)) where login is not null;

-- Ruxsatlar (agar avval berilmagan bo'lsa)
grant select, insert, update, delete on haydovchilar to anon, authenticated;

-- Demo: Otabek Yusupov kabinetga kira oladi (otabek / 123456)
update haydovchilar set login = 'otabek', parol = '123456', joriy_joy = shahar, joy_yangilangan = now()
where id = 'd2' and login is null;

-- Tekshirish: 7 ta qator qaytarsa — hammasi joyida
select column_name from information_schema.columns
where table_name = 'haydovchilar'
  and column_name in ('mashina_turi', 'joriy_joy', 'yonalish', 'joy_yangilangan', 'login', 'parol', 'ozi_royxatdan');
