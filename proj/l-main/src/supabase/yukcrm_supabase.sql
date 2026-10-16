-- =====================================================================
--  YukCRM — Supabase uchun to'liq SQL
--  Supabase → SQL Editor → New query → hammasini qo'yib "Run" bosing.
--  Qayta ishga tushirsa ham xato bermaydi (mavjud jadval/ma'lumot buzilmaydi).
--
--  Login va parollar ODDIY MATN holida saqlanadi (hash qilinmagan),
--  Table Editor'da ochiq ko'rinib turadi.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. FOYDALANUVCHILAR (admin, direktor, dispetcher)
-- ---------------------------------------------------------------------
create table if not exists foydalanuvchilar (
  id          text primary key default gen_random_uuid()::text,
  ism         text not null,
  login       text not null,
  parol       text not null,
  rol         text not null default 'dispetcher'
              check (rol in ('admin', 'direktor', 'dispetcher')),
  yaratilgan  timestamptz not null default now()
);
create unique index if not exists foydalanuvchilar_login_uq on foydalanuvchilar (lower(login));

-- ---------------------------------------------------------------------
-- 2. HAYDOVCHILAR
-- ---------------------------------------------------------------------
create table if not exists haydovchilar (
  id          text primary key default gen_random_uuid()::text,
  ism         text not null,
  telefon     text,
  mashina     text,                -- masalan: MAN TGX 18.440
  raqam       text,                -- davlat raqami: 30 A 145 BA
  shahar      text,
  tajriba     int default 0,       -- yil
  holat       text not null default 'Faol'
              check (holat in ('Faol', 'Yo''lda', 'Dam olishda')),
  yaratilgan  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. BROKERLAR
-- ---------------------------------------------------------------------
create table if not exists brokerlar (
  id          text primary key default gen_random_uuid()::text,
  ism         text not null,
  kompaniya   text,
  telefon     text,
  komissiya   numeric(5,2) default 0,   -- foiz
  holat       text not null default 'Faol' check (holat in ('Faol', 'Nofaol')),
  yaratilgan  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 4. ZAVODLAR (yukchilar) — o'z kabinetiga login/parol bilan kiradi
-- ---------------------------------------------------------------------
create table if not exists zavodlar (
  id               text primary key default gen_random_uuid()::text,
  nomi             text not null,
  shahar           text,
  mahsulot         text,
  masul_shaxs      text,
  telefon          text,
  holat            text not null default 'Hamkor'
                   check (holat in ('Hamkor', 'Muzokarada', 'Nofaol')),
  login            text,            -- bo'sh bo'lsa — kabineti yo'q
  parol            text,
  ozi_royxatdan    boolean not null default false,  -- "Men yukchiman" orqali o'zi o'tganmi
  yaratilgan       timestamptz not null default now()
);
create unique index if not exists zavodlar_login_uq on zavodlar (lower(login)) where login is not null;

-- ---------------------------------------------------------------------
-- 5. YUKLAR — kelgan yuklar + yopilgan reys ma'lumotlari bitta jadvalda
-- ---------------------------------------------------------------------
create table if not exists yuklar (
  id                text primary key default gen_random_uuid()::text,
  nomi              text not null,
  manba             text not null default 'zavod' check (manba in ('zavod', 'broker')),
  zavod_id          text references zavodlar(id) on delete set null,
  broker_id         text references brokerlar(id) on delete set null,
  qayerdan          text not null,
  qayerga           text not null,
  ogirlik           numeric(10,2),            -- tonna
  narx              numeric(14,0) not null default 0,  -- so'm, mijoz to'lovi
  mashina_turi      text,
  telefon           text,                     -- yuk bo'yicha bog'lanish
  izoh              text,
  holat             text not null default 'Kutilmoqda'
                    check (holat in ('Kutilmoqda', 'Yo''lda', 'Yetkazildi', 'Bekor qilindi')),
  sana              date not null default current_date,   -- kelgan sana
  yaratilgan        timestamptz not null default now(),

  -- Yukni yopish (dispetcher haydovchiga biriktirganda to'ldiriladi)
  haydovchi_id      text references haydovchilar(id) on delete set null,
  yopgan_xodim_id   text references foydalanuvchilar(id) on delete set null,
  yopilgan_vaqt     timestamptz,
  masofa_km         int,
  yuklash_sanasi    date,
  yetib_borish      date,
  haydovchi_tolovi  numeric(14,0),
  yol_izohi         text,
  yetkazilgan_sana  date
);
create index if not exists yuklar_holat_idx     on yuklar (holat);
create index if not exists yuklar_zavod_idx     on yuklar (zavod_id);
create index if not exists yuklar_broker_idx    on yuklar (broker_id);
create index if not exists yuklar_yopgan_idx    on yuklar (yopgan_xodim_id);

-- ---------------------------------------------------------------------
-- 6. TELEGRAM GURUHLARI
-- ---------------------------------------------------------------------
create table if not exists telegram_guruhlar (
  id          text primary key default gen_random_uuid()::text,
  nomi        text not null,
  username    text,
  turi        text default 'Guruh' check (turi in ('Guruh', 'Kanal', 'Bot')),
  azolar      int default 0,
  holat       text default 'Ulangan' check (holat in ('Ulangan', 'O''chirilgan')),
  izoh        text,
  yaratilgan  timestamptz not null default now()
);

-- =====================================================================
-- 6.1 YANGILANISH (v2): logistika kompaniyalari, hamkor kabinetlari,
--     yuk turi / hajm, ko'rinish sozlamalari. Eski bazada ham xavfsiz ishlaydi.
-- =====================================================================

-- Brokerlar ham o'z kabinetiga kiradi
alter table brokerlar add column if not exists shahar        text;
alter table brokerlar add column if not exists login         text;
alter table brokerlar add column if not exists parol         text;
alter table brokerlar add column if not exists ozi_royxatdan boolean not null default false;
create unique index if not exists brokerlar_login_uq on brokerlar (lower(login)) where login is not null;

-- Logistika kompaniyalari (bizga yuk beradi)
create table if not exists logistika_kompaniyalari (
  id             text primary key default gen_random_uuid()::text,
  nomi           text not null,
  masul_shaxs    text,
  telefon        text,
  shahar         text,
  holat          text not null default 'Faol' check (holat in ('Faol', 'Nofaol')),
  login          text,
  parol          text,
  ozi_royxatdan  boolean not null default false,
  yaratilgan     timestamptz not null default now()
);
create unique index if not exists kompaniyalar_login_uq on logistika_kompaniyalari (lower(login)) where login is not null;

-- Yuklar: yangi manbalar va maydonlar
alter table yuklar add column if not exists kompaniya_id text references logistika_kompaniyalari(id) on delete set null;
alter table yuklar add column if not exists yuk_turi     text;
alter table yuklar add column if not exists hajm         numeric(10,2);   -- m3
alter table yuklar add column if not exists qoshgan      text;            -- 'hamkor' | 'admin'
alter table yuklar drop constraint if exists yuklar_manba_check;
alter table yuklar add constraint yuklar_manba_check check (manba in ('zavod', 'broker', 'kompaniya', 'admin'));
create index if not exists yuklar_kompaniya_idx on yuklar (kompaniya_id);

-- Sozlamalar: qaysi manba yuklari dispetcherlarga ko'rinadi
create table if not exists sozlamalar (
  id          text primary key,
  qiymat      jsonb not null default '{}'::jsonb,
  yaratilgan  timestamptz not null default now()
);
insert into sozlamalar (id, qiymat)
values ('korinish', '{"factory": true, "broker": true, "company": true, "admin": true}')
on conflict (id) do nothing;

-- =====================================================================
-- 7. KO'RINISHLAR (VIEW) — tayyor hisobotlar
-- =====================================================================

-- Yopilgan yuklar: haydovchi, zavod/broker va yopgan xodim bilan birga
drop view if exists yopilgan_yuklar;
create view yopilgan_yuklar as
select
  y.*,
  coalesce(y.narx, 0) - coalesce(y.haydovchi_tolovi, 0) as foyda,
  h.ism      as haydovchi_ismi,
  h.telefon  as haydovchi_telefoni,
  h.mashina  as haydovchi_mashinasi,
  h.raqam    as mashina_raqami,
  z.nomi     as zavod_nomi,
  b.kompaniya as broker_kompaniyasi,
  k.nomi      as kompaniya_nomi,
  f.ism      as yopgan_xodim
from yuklar y
left join haydovchilar     h on h.id = y.haydovchi_id
left join zavodlar         z on z.id = y.zavod_id
left join brokerlar        b on b.id = y.broker_id
left join logistika_kompaniyalari k on k.id = y.kompaniya_id
left join foydalanuvchilar f on f.id = y.yopgan_xodim_id
where y.yopgan_xodim_id is not null;

-- Har bir xodimning statistikasi
drop view if exists xodimlar_statistikasi;
create view xodimlar_statistikasi as
select
  f.id, f.ism, f.login, f.rol,
  count(y.id)                                                     as yopgan_yuklar,
  count(y.id) filter (where date_trunc('month', y.yopilgan_vaqt) = date_trunc('month', now())) as shu_oy,
  count(y.id) filter (where y.holat = 'Yo''lda')                  as yolda,
  count(y.id) filter (where y.holat = 'Yetkazildi')               as yetkazildi,
  coalesce(sum(y.narx), 0)                                        as aylanma,
  coalesce(sum(y.narx - coalesce(y.haydovchi_tolovi, 0)), 0)      as foyda,
  coalesce(sum(y.masofa_km), 0)                                   as jami_km
from foydalanuvchilar f
left join yuklar y on y.yopgan_xodim_id = f.id and y.holat <> 'Bekor qilindi'
group by f.id;

-- =====================================================================
-- 8. FUNKSIYALAR — saytdan supabase.rpc(...) bilan chaqiriladi
-- =====================================================================

-- Xodim kirishi: login + parol to'g'ri bo'lsa xodim qatorini qaytaradi
create or replace function xodim_kirish(p_login text, p_parol text)
returns setof foydalanuvchilar
language sql security definer set search_path = public as $$
  select * from foydalanuvchilar
  where lower(login) = lower(trim(p_login)) and parol = p_parol
  limit 1;
$$;

-- Zavod logini bormi? ("Hisob topildi" / "Ro'yxatdan o'ting" maslahati uchun)
create or replace function zavod_login_bormi(p_login text)
returns boolean
language sql security definer set search_path = public as $$
  select exists (select 1 from zavodlar where lower(login) = lower(trim(p_login)));
$$;

-- Zavod kirishi: {"natija": "ok" | "topilmadi" | "parol_xato", "zavod": {...}}
create or replace function zavod_kirish(p_login text, p_parol text)
returns json
language plpgsql security definer set search_path = public as $$
declare z zavodlar;
begin
  select * into z from zavodlar where lower(login) = lower(trim(p_login));
  if not found then
    return json_build_object('natija', 'topilmadi');
  end if;
  if z.parol <> p_parol then
    return json_build_object('natija', 'parol_xato');
  end if;
  return json_build_object('natija', 'ok', 'zavod', row_to_json(z));
end;
$$;

-- Zavod o'zi ro'yxatdan o'tadi ("Men yukchiman" → Ro'yxatdan o'tish)
create or replace function zavod_royxatdan_otish(
  p_nomi text, p_masul_shaxs text, p_telefon text, p_shahar text,
  p_mahsulot text, p_login text, p_parol text
)
returns json
language plpgsql security definer set search_path = public as $$
declare z zavodlar;
begin
  if exists (select 1 from zavodlar where lower(login) = lower(trim(p_login))) then
    return json_build_object('natija', 'login_band');
  end if;
  insert into zavodlar (nomi, masul_shaxs, telefon, shahar, mahsulot, login, parol, ozi_royxatdan)
  values (trim(p_nomi), trim(p_masul_shaxs), trim(p_telefon), p_shahar, trim(p_mahsulot),
          trim(p_login), p_parol, true)
  returning * into z;
  return json_build_object('natija', 'ok', 'zavod', row_to_json(z));
end;
$$;

-- Yukni yopish: haydovchi biriktiriladi, reys yoziladi, haydovchi "Yo'lda" bo'ladi
create or replace function yukni_yopish(
  p_yuk_id text, p_haydovchi_id text, p_xodim_id text,
  p_masofa_km int, p_yuklash_sanasi date, p_yetib_borish date,
  p_haydovchi_tolovi numeric, p_yol_izohi text
)
returns void
language plpgsql security definer set search_path = public as $$
begin
  update yuklar set
    haydovchi_id     = p_haydovchi_id,
    yopgan_xodim_id  = p_xodim_id,
    yopilgan_vaqt    = now(),
    masofa_km        = p_masofa_km,
    yuklash_sanasi   = p_yuklash_sanasi,
    yetib_borish     = p_yetib_borish,
    haydovchi_tolovi = p_haydovchi_tolovi,
    yol_izohi        = p_yol_izohi,
    holat            = 'Yo''lda'
  where id = p_yuk_id and holat = 'Kutilmoqda';

  if not found then
    raise exception 'Yuk topilmadi yoki allaqachon yopilgan';
  end if;

  update haydovchilar set holat = 'Yo''lda' where id = p_haydovchi_id;
end;
$$;

-- Yuk yetkazildi: haydovchida boshqa faol reys bo'lmasa — u yana "Faol"
create or replace function yuk_yetkazildi(p_yuk_id text)
returns void
language plpgsql security definer set search_path = public as $$
declare v_haydovchi text;
begin
  update yuklar set holat = 'Yetkazildi', yetkazilgan_sana = current_date
  where id = p_yuk_id and holat = 'Yo''lda'
  returning haydovchi_id into v_haydovchi;

  if v_haydovchi is not null and not exists (
    select 1 from yuklar where haydovchi_id = v_haydovchi and holat = 'Yo''lda'
  ) then
    update haydovchilar set holat = 'Faol' where id = v_haydovchi;
  end if;
end;
$$;

-- =====================================================================
-- 9. RLS — sayt anon kalit bilan hamma jadvalni o'qiy/yoza oladi
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['foydalanuvchilar','haydovchilar','brokerlar','zavodlar','yuklar','telegram_guruhlar',
                        'logistika_kompaniyalari','sozlamalar']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "hamma_uchun_ochiq" on %I', t);
    execute format('create policy "hamma_uchun_ochiq" on %I for all to anon, authenticated using (true) with check (true)', t);
  end loop;
end $$;

grant execute on function xodim_kirish, zavod_login_bormi, zavod_kirish, zavod_royxatdan_otish,
  yukni_yopish, yuk_yetkazildi to anon, authenticated;
grant select on yopilgan_yuklar, xodimlar_statistikasi to anon, authenticated;

-- =====================================================================
-- 10. REALTIME — har qanday o'zgarish boshqa kompyuterlarda ham darhol ko'rinadi
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array['yuklar','haydovchilar','zavodlar','brokerlar','foydalanuvchilar','telegram_guruhlar',
                        'logistika_kompaniyalari','sozlamalar']
  loop
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
       and not exists (select 1 from pg_publication_tables
                       where pubname = 'supabase_realtime' and tablename = t) then
      execute format('alter publication supabase_realtime add table %I', t);
    end if;
  end loop;
end $$;

-- =====================================================================
-- 11. BOSHLANG'ICH MA'LUMOTLAR (demo)
-- =====================================================================
insert into foydalanuvchilar (id, ism, login, parol, rol) values
  ('u1', 'Muhammad',         'admin',      'admin123', 'admin'),
  ('u4', 'Akbar Rustamov',   'direktor',   'dir123',   'direktor'),
  ('u2', 'Dilnoza Karimova', 'dispetcher', 'user123',  'dispetcher'),
  ('u3', 'Sardor Olimov',    'user',       'user123',  'dispetcher')
on conflict (id) do nothing;

insert into haydovchilar (id, ism, telefon, mashina, raqam, shahar, tajriba, holat) values
  ('d1', 'Jasur Rahimov',    '+998 90 123 45 67', 'MAN TGX 18.440',  '30 A 145 BA', 'Samarqand', 12, 'Yo''lda'),
  ('d2', 'Otabek Yusupov',   '+998 91 555 12 34', 'Volvo FH 460',    '01 B 772 CA', 'Toshkent',   8, 'Faol'),
  ('d3', 'Sherzod Aliyev',   '+998 93 310 88 20', 'Kamaz 5490',      '80 C 901 DA', 'Buxoro',    15, 'Faol'),
  ('d4', 'Bekzod Tursunov',  '+998 97 402 11 09', 'Howo A7',         '60 D 333 AA', 'Andijon',    5, 'Dam olishda'),
  ('d5', 'Farrux Qodirov',   '+998 99 870 65 43', 'Shacman X3000',   '30 E 520 BB', 'Samarqand',  9, 'Yo''lda'),
  ('d6', 'Ulug''bek Nazarov','+998 94 222 70 70', 'Isuzu NQR 90',    '40 F 118 CC', 'Farg''ona',  6, 'Faol'),
  ('d7', 'Rustam Ergashev',  '+998 90 909 30 30', 'Mercedes Actros', '85 G 640 DD', 'Navoiy',    18, 'Faol'),
  ('d8', 'Azizbek Mirzayev', '+998 88 144 52 52', 'DAF XF 480',      '70 H 207 AB', 'Qarshi',     4, 'Faol')
on conflict (id) do nothing;

insert into brokerlar (id, ism, kompaniya, telefon, komissiya, holat) values
  ('b1', 'Nodir Xoliqov',    'TezYuk Logistics',     '+998 90 700 10 10', 5,   'Faol'),
  ('b2', 'Malika Saidova',   'Ipak Yo''li Cargo',    '+998 91 300 44 55', 4,   'Faol'),
  ('b3', 'Akmal Hamidov',    'Asia Trans Broker',    '+998 93 555 66 77', 6,   'Faol'),
  ('b4', 'Javlon Sobirov',   'Registon Freight',     '+998 97 111 22 33', 3.5, 'Nofaol'),
  ('b5', 'Kamola Rashidova', 'Zarafshon Ekspeditor', '+998 99 404 04 04', 5,   'Faol')
on conflict (id) do nothing;

insert into zavodlar (id, nomi, shahar, mahsulot, masul_shaxs, telefon, holat, login, parol) values
  ('f1', 'Zarafshon Sement',       'Samarqand', 'Sement M400, M500',  'Ilhom Toshev',    '+998 66 233 10 10', 'Hamkor',     'zarafshon', '123456'),
  ('f2', 'Oltin Don un kombinati', 'Jizzax',    'Un, kepak',          'Botir Jo''rayev', '+998 72 226 40 40', 'Hamkor',     'oltindon',  '123456'),
  ('f3', 'Navro''z Tekstil',       'Buxoro',    'Ip-kalava, mato',    'Gulnora Aminova', '+998 65 221 55 55', 'Hamkor',     null, null),
  ('f4', 'Vodiy Metall',           'Andijon',   'Armatura, profil',   'Sanjar Ismoilov', '+998 74 223 90 90', 'Muzokarada', null, null),
  ('f5', 'Qarshi Shisha',          'Qarshi',    'Oyna, shisha idish', 'Rahim Normatov',  '+998 75 225 30 30', 'Hamkor',     null, null)
on conflict (id) do nothing;

-- Ochiq (kelgan) yuklar
insert into yuklar (id, nomi, manba, zavod_id, broker_id, qayerdan, qayerga, ogirlik, narx, mashina_turi, telefon, izoh, holat, sana) values
  ('c16', 'Sement M500, qopda', 'zavod',  'f1', null, 'Samarqand', 'Toshkent', 22, 6900000,  'Tent (fura)',  '+998 66 233 10 10', 'Ertalab 8:00 dan yuklash', 'Kutilmoqda', current_date),
  ('c17', 'Un, 50 kg qop',      'zavod',  'f2', null, 'Jizzax',    'Nukus',    20, 9400000,  'Tent (fura)',  '+998 72 226 40 40', null,                       'Kutilmoqda', current_date),
  ('c4',  'Oyna listlari',      'broker', 'f5', 'b5', 'Qarshi',    'Samarqand',12, 4100000,  'Bort',         null, 'Ehtiyotkor tashish kerak',           'Kutilmoqda', current_date - 2),
  ('c5',  'Armatura 12 mm',     'broker', 'f4', 'b1', 'Andijon',   'Navoiy',   24, 10500000, 'Bort',         null, null,                                 'Kutilmoqda', current_date - 3)
on conflict (id) do nothing;

-- Yopilgan yuklar (reys ma'lumotlari bilan)
insert into yuklar (id, nomi, manba, zavod_id, broker_id, qayerdan, qayerga, ogirlik, narx, mashina_turi, holat, sana,
                    haydovchi_id, yopgan_xodim_id, yopilgan_vaqt, masofa_km, yuklash_sanasi, yetib_borish, haydovchi_tolovi, yol_izohi, yetkazilgan_sana) values
  ('c1', 'Sement M400', 'zavod',  'f1', null, 'Samarqand', 'Toshkent', 22, 6800000, 'Tent (fura)', 'Yo''lda',    current_date - 5,
         'd1', 'u2', now() - interval '5 days', 310, current_date - 4, current_date - 4, 5200000, 'Toshkent, Sergeli ombori', null),
  ('c2', 'Un, 50 kg qop','broker','f2', 'b2', 'Jizzax',    'Termiz',   20, 7900000, 'Tent (fura)', 'Yo''lda',    current_date - 6,
         'd5', 'u3', now() - interval '6 days', 480, current_date - 5, current_date - 4, 6100000, null, null),
  ('c6', 'Sement M500', 'zavod',  'f1', null, 'Samarqand', 'Buxoro',   22, 4600000, 'Sement tashuvchi', 'Yetkazildi', current_date - 28,
         'd3', 'u2', now() - interval '28 days', 270, current_date - 28, current_date - 27, 3600000, null, current_date - 27),
  ('c7', 'Mato rulonlari','broker','f3','b2', 'Buxoro',    'Toshkent', 10, 7300000, 'Tent (fura)', 'Yetkazildi', current_date - 40,
         'd2', 'u3', now() - interval '40 days', 580, current_date - 39, current_date - 38, 5800000, null, current_date - 38)
on conflict (id) do nothing;

insert into telegram_guruhlar (id, nomi, username, turi, azolar, holat, izoh) values
  ('t1', 'Yuk Markazi UZ',      '@yuk_markazi_uz',  'Guruh', 48200, 'Ulangan', 'Asosiy yuk e''lonlari guruhi'),
  ('t2', 'Logistika Samarqand', '@logistika_smq',   'Guruh', 12650, 'Ulangan', 'Samarqand yo''nalishlari'),
  ('t3', 'YukCRM yangiliklari', '@yukcrm_news',     'Kanal', 3120,  'Ulangan', 'Kompaniya kanali')
on conflict (id) do nothing;

-- Demo: broker va logistika kompaniyasi kabinetlari
update brokerlar set login = 'tezyuk', parol = '123456', shahar = 'Toshkent' where id = 'b1' and login is null;
insert into logistika_kompaniyalari (id, nomi, masul_shaxs, telefon, shahar, holat, login, parol) values
  ('k1', 'Silk Road Logistics', 'Anvar Qosimov', '+998 90 600 70 80', 'Toshkent', 'Faol', 'silkroad', '123456'),
  ('k2', 'Turon Trans Group',   'Dilshod Ergashev', '+998 93 410 20 30', 'Samarqand', 'Faol', null, null)
on conflict (id) do nothing;
insert into yuklar (id, nomi, manba, kompaniya_id, qayerdan, qayerga, ogirlik, hajm, yuk_turi, narx, mashina_turi, telefon, holat, sana, qoshgan) values
  ('c20', 'Paxta tolasi, toylarda', 'kompaniya', 'k1', 'Buxoro', 'Moskva', 20, 82, 'Tekstil', 38000000, 'Tent (fura)', '+998 90 600 70 80', 'Kutilmoqda', current_date, 'hamkor')
on conflict (id) do nothing;
