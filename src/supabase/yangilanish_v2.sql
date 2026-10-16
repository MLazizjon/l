-- =====================================================================
--  YukCRM — YANGILANISH v2 (mavjud bazaga qo'shimcha)
--  Supabase → SQL Editor → New query → hammasini qo'yib "Run".
--  Mavjud ma'lumotlar O'CHMAYDI. Qayta ishga tushirsa ham xato bermaydi.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. BROKERLAR — o'z kabinetiga login/parol bilan kiradi
-- ---------------------------------------------------------------------
alter table brokerlar add column if not exists shahar        text;
alter table brokerlar add column if not exists login         text;
alter table brokerlar add column if not exists parol         text;
alter table brokerlar add column if not exists ozi_royxatdan boolean not null default false;
create unique index if not exists brokerlar_login_uq on brokerlar (lower(login)) where login is not null;

-- ---------------------------------------------------------------------
-- 2. LOGISTIKA KOMPANIYALARI — yangi jadval
-- ---------------------------------------------------------------------
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

-- ---------------------------------------------------------------------
-- 3. YUKLAR — yangi ustunlar
-- ---------------------------------------------------------------------
alter table yuklar add column if not exists kompaniya_id text references logistika_kompaniyalari(id) on delete set null;
alter table yuklar add column if not exists yuk_turi     text;            -- Qurilish materiallari, Oziq-ovqat ...
alter table yuklar add column if not exists hajm         numeric(10,2);   -- m3
alter table yuklar add column if not exists qoshgan      text;            -- 'hamkor' | 'admin' | 'telegram'
alter table yuklar add column if not exists tg_kanal     text;            -- Telegram kanal nomi
alter table yuklar add column if not exists tg_havola    text;            -- xabarga havola (t.me/...)
alter table yuklar add column if not exists tg_matn      text;            -- e'lonning asl matni
create index if not exists yuklar_kompaniya_idx on yuklar (kompaniya_id);

-- Yuk manbalari: zavod, broker, kompaniya, admin, telegram
alter table yuklar drop constraint if exists yuklar_manba_check;
alter table yuklar add constraint yuklar_manba_check
  check (manba in ('zavod', 'broker', 'kompaniya', 'admin', 'telegram'));

-- ---------------------------------------------------------------------
-- 4. TELEGRAM GURUHLARI — avtomatik yuk olish uchun
-- ---------------------------------------------------------------------
alter table telegram_guruhlar add column if not exists chat_id     text;                           -- bot o'zi to'ldiradi
alter table telegram_guruhlar add column if not exists avto_import boolean not null default true;  -- yuklarni avtomatik olish

-- ---------------------------------------------------------------------
-- 5. SOZLAMALAR — qaysi manba yuklari dispetcherlarga ko'rinadi
-- ---------------------------------------------------------------------
create table if not exists sozlamalar (
  id          text primary key,
  qiymat      jsonb not null default '{}'::jsonb,
  yaratilgan  timestamptz not null default now()
);
insert into sozlamalar (id, qiymat)
values ('korinish', '{"factory": true, "broker": true, "company": true, "admin": true, "telegram": true}')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 6. YOPILGAN YUKLAR ko'rinishi — logistika kompaniyasi nomi bilan
-- ---------------------------------------------------------------------
drop view if exists yopilgan_yuklar;
create view yopilgan_yuklar as
select
  y.*,
  coalesce(y.narx, 0) - coalesce(y.haydovchi_tolovi, 0) as foyda,
  h.ism       as haydovchi_ismi,
  h.telefon   as haydovchi_telefoni,
  h.mashina   as haydovchi_mashinasi,
  h.raqam     as mashina_raqami,
  z.nomi      as zavod_nomi,
  b.kompaniya as broker_kompaniyasi,
  k.nomi      as kompaniya_nomi,
  f.ism       as yopgan_xodim
from yuklar y
left join haydovchilar            h on h.id = y.haydovchi_id
left join zavodlar                z on z.id = y.zavod_id
left join brokerlar               b on b.id = y.broker_id
left join logistika_kompaniyalari k on k.id = y.kompaniya_id
left join foydalanuvchilar        f on f.id = y.yopgan_xodim_id
where y.yopgan_xodim_id is not null;

-- ---------------------------------------------------------------------
-- 7. RUXSATLAR (RLS) — sayt yangi jadvallarni o'qiy/yoza olsin
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['logistika_kompaniyalari', 'sozlamalar']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "hamma_uchun_ochiq" on %I', t);
    execute format('create policy "hamma_uchun_ochiq" on %I for all to anon, authenticated using (true) with check (true)', t);
    execute format('grant select, insert, update, delete on %I to anon, authenticated', t);
  end loop;
end $$;
grant select on yopilgan_yuklar to anon, authenticated;

-- ---------------------------------------------------------------------
-- 8. REALTIME — o'zgarishlar boshqa kompyuterlarda darhol ko'rinsin
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['logistika_kompaniyalari', 'sozlamalar']
  loop
    if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
       and not exists (select 1 from pg_publication_tables
                       where pubname = 'supabase_realtime' and tablename = t) then
      execute format('alter publication supabase_realtime add table %I', t);
    end if;
  end loop;
end $$;

-- Tekshirish: quyidagi so'rov 2 ta qator qaytarsa — hammasi joyida
select table_name from information_schema.tables
where table_schema = 'public' and table_name in ('logistika_kompaniyalari', 'sozlamalar');
