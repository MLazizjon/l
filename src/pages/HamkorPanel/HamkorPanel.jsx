import { useMemo, useState } from 'react';
import {
  LogOut, Plus, PackageOpen, Truck, Phone, CalendarClock, Pencil, Ban, MapPin, Weight, Box as BoxIcon, Tag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CARGO_STATUS, toneOf } from '../../data/constants';
import { PARTNERS } from '../../data/partners';
import { money, fmtDate, today, initials, shortMoney, telHref } from '../../utils/helpers';
import { t, LangSwitcher } from '../../i18n';
import { ThemeToggle } from '../../styles/ThemeMode';
import CargoForm, { EMPTY_CARGO, cargoPayload } from '../../components/CargoForm/CargoForm';
import {
  Button, IconButton, Chips, Chip, Badge, Empty, Overlay, Modal, ModalFoot, ConfirmBox,
} from '../../styles/ui';
import {
  Shell, TopBar, Brand, Account, Container, Hero, Kpis, Kpi, List, CargoCard, CardTop, Route,
  Meta, DriverBox, Waiting, CardActions,
} from './styles';

/* Zavod, broker yoki logistika kompaniyasining shaxsiy kabineti */
export default function HamkorPanel() {
  const { partner, partnerLogout } = useAuth();
  const { cargo, drivers, create, update } = useData();
  const cfg = PARTNERS[partner.type];
  const Icon = cfg.icon;

  const blank = () => ({ ...EMPTY_CARGO, from: partner.city || '', phone: partner.phone || '+998 ', loadDate: today() });
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [status, setStatus] = useState('Barchasi');
  const [cancelId, setCancelId] = useState(null);

  // Faqat shu hamkorning yuklari
  const mine = useMemo(
    () => cargo
      .filter((c) => c[cfg.fk] === partner.id && (c.source || (c.brokerId ? 'broker' : 'factory')) === partner.type)
      .sort((a, b) => (b.createdAt || b.date || '').localeCompare(a.createdAt || a.date || '')),
    [cargo, cfg.fk, partner.id, partner.type]
  );
  const count = (s) => mine.filter((c) => c.status === s).length;
  const rows = mine.filter((c) => status === 'Barchasi' || c.status === status);
  const total = mine.filter((c) => c.status !== 'Bekor qilindi').reduce((s, c) => s + (Number(c.price) || 0), 0);
  const driverOf = (id) => drivers.find((d) => d.id === id);

  const openNew = () => { setForm(blank()); setEditing('new'); };
  const openEdit = (c) => { setForm({ ...EMPTY_CARGO, ...c, truckType: c.truckType || '', volume: c.volume || '', cargoType: c.cargoType || '' }); setEditing(c.id); };

  const onSave = () => {
    const payload = cargoPayload(form);
    if (editing === 'new') {
      create('cargo', {
        ...payload,
        source: partner.type,
        factoryId: '', brokerId: '', companyId: '',
        [cfg.fk]: partner.id,
        driverId: '',
        status: 'Kutilmoqda',
        date: today(),
        addedBy: 'hamkor',
        createdAt: new Date().toISOString(),
      });
    } else {
      update('cargo', editing, payload);
    }
    setEditing(null);
  };

  return (
    <Shell>
      <TopBar>
        <Brand>
          <span className="logo"><Icon /></span>
          <div>
            <strong>{partner.name}</strong>
            <span>{t(cfg.one)} · {t('kabinet')}{partner.city ? ` · ${partner.city}` : ''}</span>
          </div>
        </Brand>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LangSwitcher />
          <ThemeToggle />
          <Account>
            <span className="avatar">{initials(partner.contact || partner.name)}</span>
            <div className="who">
              <strong>{partner.contact || partner.name}</strong>
              <span>@{partner.username}</span>
            </div>
            <IconButton $danger onClick={partnerLogout} title={t('Chiqish')} aria-label={t('Chiqish')}><LogOut /></IconButton>
          </Account>
        </div>
      </TopBar>

      <Container>
        <Hero>
          <div>
            <h1>{t('Yuklaringiz')}</h1>
            <p>{t("Joylagan yukingiz darhol logistlar ro'yxatiga tushadi. Haydovchi biriktirilgach, uning ma'lumotlari shu yerda ko'rinadi.")}</p>
          </div>
          <Button $size="lg" onClick={openNew}><Plus /> {t('Yuk joylash')}</Button>
        </Hero>

        <Kpis>
          <Kpi $main><span>{t('Jami joylangan')}</span><b>{mine.length}</b><small>{shortMoney(total)} {t("so'm")}</small></Kpi>
          <Kpi><span>{t('Mashina kutmoqda')}</span><b>{count('Kutilmoqda')}</b><small>{t("Dispetcher ko'rib chiqmoqda")}</small></Kpi>
          <Kpi><span>{t("Yo'lda")}</span><b>{count("Yo'lda")}</b><small>{t('Haydovchi biriktirilgan')}</small></Kpi>
          <Kpi><span>{t('Yetkazildi')}</span><b>{count('Yetkazildi')}</b><small>{t('Muvaffaqiyatli reyslar')}</small></Kpi>
        </Kpis>

        <Chips>
          {['Barchasi', ...CARGO_STATUS].map((s) => (
            <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
              {t(s)} <b>{s === 'Barchasi' ? mine.length : count(s)}</b>
            </Chip>
          ))}
        </Chips>

        {rows.length ? (
          <List>
            {rows.map((c) => {
              const d = driverOf(c.driverId);
              return (
                <CargoCard key={c.id}>
                  <CardTop>
                    <div>
                      <strong>{c.title}</strong>
                      <small>{t('Joylangan')}: {fmtDate(c.date)}{c.truckType ? ` · ${t(c.truckType)}` : ''}</small>
                    </div>
                    <Badge $tone={toneOf(c.status)}>{c.status === 'Kutilmoqda' ? t('Mashina kutmoqda') : t(c.status)}</Badge>
                  </CardTop>

                  <Route>
                    <span><MapPin />{c.from}</span>
                    <i />
                    <span>{c.to}</span>
                  </Route>

                  <Meta>
                    {c.cargoType && <span><Tag />{c.cargoType}</span>}
                    <span><Weight />{c.weight || '—'} t</span>
                    {c.volume && <span><BoxIcon />{c.volume} m³</span>}
                    <span><b>{money(c.price)}</b></span>
                    {c.loadDate && <span><CalendarClock />{t('Yuklash')}: {fmtDate(c.loadDate)}</span>}
                  </Meta>

                  {d && c.status !== 'Kutilmoqda' ? (
                    <DriverBox>
                      <span className="avatar"><Truck /></span>
                      <div>
                        <strong>{d.name}</strong>
                        <small>{d.truck} · <b>{d.plate}</b></small>
                      </div>
                      <a href={telHref(d.phone)}><Phone />{d.phone}</a>
                      {c.trip?.eta && <em>{t('Yetib borish')}: {fmtDate(c.trip.eta)}</em>}
                    </DriverBox>
                  ) : c.status === 'Kutilmoqda' ? (
                    <Waiting><span className="pulse" /> {t('Dispetcher mos mashina qidirmoqda…')}</Waiting>
                  ) : null}

                  {c.status === 'Kutilmoqda' && (
                    <CardActions>
                      <Button $variant="ghost" onClick={() => openEdit(c)}><Pencil /> {t('Tahrirlash')}</Button>
                      <Button $variant="ghost" onClick={() => setCancelId(c.id)}><Ban /> {t('Bekor qilish')}</Button>
                    </CardActions>
                  )}
                </CargoCard>
              );
            })}
          </List>
        ) : (
          <Empty $boxed>
            <PackageOpen />
            <h4>{mine.length ? t("Bu holatda yuk yo'q") : t('Hali yuk joylamagansiz')}</h4>
            <p>{t("«Yuk joylash» tugmasini bosing — logistlar darhol ko'radi.")}</p>
          </Empty>
        )}
      </Container>

      {editing && (
        <CargoForm
          title={editing === 'new' ? t('Yangi yuk joylash') : t('Yukni tahrirlash')}
          form={form}
          setForm={setForm}
          onClose={() => setEditing(null)}
          onSubmit={onSave}
          submitLabel={editing === 'new' ? t('Joylash') : t('Saqlash')}
        />
      )}

      {cancelId && (
        <Overlay onMouseDown={() => setCancelId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Ban /></div>
              <h2>{t('Yukni bekor qilasizmi?')}</h2>
              <p>{t("Logistlar bu yukka mashina qidirishni to'xtatadi.")}</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => setCancelId(null)}>{t("Yo'q")}</Button>
              <Button $variant="danger" onClick={() => { update('cargo', cancelId, { status: 'Bekor qilindi' }); setCancelId(null); }}>{t('Ha, bekor qilish')}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Shell>
  );
}
