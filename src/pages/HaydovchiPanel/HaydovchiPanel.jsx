import { useMemo, useState } from 'react';
import {
  LogOut, Truck, MapPin, Navigation, CheckCircle2, Coffee, Save, UserCog, X, PackageOpen, Phone,
  CalendarClock, Weight, Wallet, Route as RouteIcon, Clock,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { CITIES, TRUCK_TYPES, toneOf } from '../../data/constants';
import { money, fmtDate, fmtDateTime, initials, shortMoney, telHref } from '../../utils/helpers';
import { t, LangSwitcher } from '../../i18n';
import { ThemeToggle } from '../../styles/ThemeMode';
import {
  Button, IconButton, Badge, Empty, Overlay, Modal, ModalHead, ModalBody, ModalFoot, FormGrid, Field,
  Input, FormSelect, Req, Opt, Notice,
} from '../../styles/ui';
import {
  Shell, TopBar, Brand, Account, Container, Hero, Kpis, Kpi, List, CargoCard, CardTop, Route, Meta,
} from '../HamkorPanel/styles';
import { LocationCard, LocNow, LocForm, StatusPick, Saved, SectionTitle } from './styles';

// Haydovchi o'zi tanlay oladigan holatlar ("Yo'lda"ni dispetcher qo'yadi)
const SELF_STATUSES = [
  { value: 'Faol', label: "Bo'shman — yuk olaman", icon: CheckCircle2 },
  { value: 'Dam olishda', label: 'Dam olyapman', icon: Coffee },
];

/* Haydovchining shaxsiy kabineti: hozirgi joyi, holati, reyslari va ma'lumotlari */
export default function HaydovchiPanel() {
  const { driver, driverLogout, loginTaken } = useAuth();
  const { cargo, update } = useData();

  const [loc, setLoc] = useState({
    location: driver.location || driver.city || '',
    heading: driver.heading || '',
    status: null, // null — holat o'zgartirilmagan
  });
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const trips = useMemo(
    () => cargo
      .filter((c) => c.driverId === driver.id)
      .sort((a, b) => (b.closedAt || b.date || '').localeCompare(a.closedAt || a.date || '')),
    [cargo, driver.id]
  );
  const live = trips.filter((c) => c.status !== 'Bekor qilindi');
  const onRoad = live.filter((c) => c.status === "Yo'lda").length;
  const delivered = live.filter((c) => c.status === 'Yetkazildi').length;
  const earned = live.reduce((s, c) => s + (Number(c.trip?.driverPay) || 0), 0);

  const onTrip = driver.status === "Yo'lda";
  const dirty = loc.location.trim() !== (driver.location || driver.city || '')
    || loc.heading.trim() !== (driver.heading || '')
    || (!onTrip && !!loc.status && loc.status !== driver.status);
  const shownStatus = loc.status || driver.status;

  const onLoc = (e) => { setSaved(false); setLoc((f) => ({ ...f, [e.target.name]: e.target.value })); };

  const saveLocation = (e) => {
    e.preventDefault();
    if (!loc.location.trim()) return;
    const patch = { location: loc.location.trim(), heading: loc.heading.trim(), locationAt: new Date().toISOString() };
    if (!onTrip && loc.status) patch.status = loc.status;
    update('drivers', driver.id, patch);
    setSaved(true);
  };

  /* ---------- Shaxsiy ma'lumotlar ---------- */
  const openProfile = () => {
    setError('');
    setProfile({
      name: driver.name || '', phone: driver.phone || '+998 ', truck: driver.truck || '', plate: driver.plate || '',
      truckType: driver.truckType || TRUCK_TYPES[0], experience: driver.experience || '', city: driver.city || '',
      username: driver.username, password: '', confirm: '',
    });
  };
  const onProfile = (e) => { setError(''); setProfile((f) => ({ ...f, [e.target.name]: e.target.value })); };

  const saveProfile = (e) => {
    e.preventDefault();
    const f = profile;
    if (!f.name.trim() || f.phone.replace(/\D/g, '').length < 9 || !f.truck.trim() || !f.plate.trim()) {
      return setError(t("Ism, telefon, mashina va davlat raqamini to'ldiring."));
    }
    const login = f.username.trim();
    if (!/^[a-zA-Z0-9_.]{3,}$/.test(login)) {
      return setError(t("Login kamida 3 ta belgi: lotin harflari, raqam, _ yoki . bo'lsin."));
    }
    if (login.toLowerCase() !== driver.username.toLowerCase() && loginTaken(login)) {
      return setError(t('Bu login band. Boshqa login tanlang.'));
    }
    if (f.password && f.password.length < 6) return setError(t("Parol kamida 6 ta belgidan iborat bo'lsin."));
    if (f.password !== f.confirm) return setError(t('Parollar bir xil emas.'));
    const patch = {
      name: f.name.trim(), phone: f.phone.trim(), truck: f.truck.trim(), plate: f.plate.trim().toUpperCase(),
      truckType: f.truckType, experience: f.experience, city: f.city.trim(), username: login,
    };
    if (f.password) patch.password = f.password;
    update('drivers', driver.id, patch);
    setProfile(null);
  };

  return (
    <Shell>
      <TopBar>
        <Brand>
          <span className="logo"><Truck /></span>
          <div>
            <strong>{driver.name}</strong>
            <span>{t('Haydovchi')} · {t('kabinet')}{driver.plate ? ` · ${driver.plate}` : ''}</span>
          </div>
        </Brand>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LangSwitcher />
          <ThemeToggle />
          <Account>
            <span className="avatar">{initials(driver.name)}</span>
            <div className="who">
              <strong>{driver.name}</strong>
              <span>@{driver.username}</span>
            </div>
            <IconButton $danger onClick={driverLogout} title={t('Chiqish')} aria-label={t('Chiqish')}><LogOut /></IconButton>
          </Account>
        </div>
      </TopBar>

      <Container>
        <Hero>
          <div>
            <h1>{t('Salom')}, {driver.name.split(' ')[0]}!</h1>
            <p>{t("Hozirgi joyingiz va holatingizni yangilab turing — dispetcherlar yaqin atrofdagi yukni sizga biriktiradi.")}</p>
          </div>
          <Button $variant="ghost" $size="lg" onClick={openProfile}><UserCog /> {t("Mening ma'lumotlarim")}</Button>
        </Hero>

        <LocationCard as="form" onSubmit={saveLocation} noValidate>
          <LocNow>
            <span className="pin"><MapPin /></span>
            <div>
              <small>{t('Hozirgi joyingiz')}</small>
              <strong>{driver.location || driver.city || t('Kiritilmagan')}</strong>
              <span>
                {driver.heading && <><Navigation /> {t('Yo\'nalish')}: {driver.heading} · </>}
                <Clock /> {driver.locationAt ? `${t('Yangilangan')}: ${fmtDateTime(driver.locationAt)}` : t('Hali yangilanmagan')}
              </span>
            </div>
            <Badge $tone={toneOf(driver.status)}>{t(driver.status)}</Badge>
          </LocNow>

          <LocForm>
            <Field><span>{t('Hozir qayerdasiz?')}<Req>*</Req></span>
              <Input name="location" list="drv-loc" value={loc.location} onChange={onLoc} placeholder={t('shahar yoki tuman')} />
            </Field>
            <Field><span>{t('Qayerga yuk olmoqchisiz?')}<Opt>{t('ixtiyoriy')}</Opt></span>
              <Input name="heading" list="drv-loc" value={loc.heading} onChange={onLoc} placeholder={t("masalan: Toshkent yoki farqi yo'q")} />
            </Field>
            <datalist id="drv-loc">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
          </LocForm>

          {onTrip ? (
            <Notice><RouteIcon /> {t("Siz hozir reysdasiz. Yuk yetkazilgach dispetcher holatingizni «Faol» qiladi. Joyingizni yo'lda ham yangilab turing.")}</Notice>
          ) : (
            <StatusPick role="radiogroup" aria-label={t('Holat')}>
              {SELF_STATUSES.map((s) => (
                <button
                  type="button"
                  key={s.value}
                  role="radio"
                  aria-checked={shownStatus === s.value}
                  onClick={() => { setSaved(false); setLoc((f) => ({ ...f, status: s.value })); }}
                >
                  <s.icon /> {t(s.label)}
                </button>
              ))}
            </StatusPick>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Button type="submit" $size="lg" disabled={!loc.location.trim() || !dirty}><Save /> {t('Joyni yangilash')}</Button>
            {saved && !dirty && <Saved><CheckCircle2 /> {t('Saqlandi — dispetcherlar yangi joyingizni ko\'radi')}</Saved>}
          </div>
        </LocationCard>

        <Kpis>
          <Kpi $main><span>{t('Jami reyslar')}</span><b>{live.length}</b><small>{shortMoney(earned)} {t("so'm")}</small></Kpi>
          <Kpi><span>{t("Yo'lda")}</span><b>{onRoad}</b><small>{t('Hozirgi reyslar')}</small></Kpi>
          <Kpi><span>{t('Yetkazildi')}</span><b>{delivered}</b><small>{t('Muvaffaqiyatli reyslar')}</small></Kpi>
          <Kpi><span>{t('Tajriba')}</span><b>{driver.experience || 0}</b><small>{t('yil')}</small></Kpi>
        </Kpis>

        <SectionTitle>{t('Mening reyslarim')}</SectionTitle>
        {trips.length ? (
          <List>
            {trips.map((c) => (
              <CargoCard key={c.id}>
                <CardTop>
                  <div>
                    <strong>{c.title}</strong>
                    <small>{c.cargoType || t('Yuk')}{c.truckType ? ` · ${t(c.truckType)}` : ''}</small>
                  </div>
                  <Badge $tone={toneOf(c.status)}>{t(c.status)}</Badge>
                </CardTop>
                <Route>
                  <span><MapPin />{c.from}</span>
                  <i />
                  <span>{c.to}</span>
                </Route>
                <Meta>
                  <span><Weight />{c.weight || '—'} t</span>
                  {c.trip?.distance && <span><RouteIcon />{c.trip.distance} km</span>}
                  {(c.trip?.loadDate || c.loadDate) && <span><CalendarClock />{t('Yuklash')}: {fmtDate(c.trip?.loadDate || c.loadDate)}</span>}
                  {c.trip?.eta && <span><CalendarClock />{t('Yetib borish')}: {fmtDate(c.trip.eta)}</span>}
                  {c.trip?.driverPay !== undefined && c.trip?.driverPay !== '' && (
                    <span><Wallet />{t("Sizga to'lov")}: <b>{money(c.trip.driverPay)}</b></span>
                  )}
                  {c.phone && <span><Phone /><a href={telHref(c.phone)}>{c.phone}</a></span>}
                </Meta>
                {c.trip?.note && <small style={{ color: 'inherit', opacity: 0.7 }}>{c.trip.note}</small>}
              </CargoCard>
            ))}
          </List>
        ) : (
          <Empty $boxed>
            <PackageOpen />
            <h4>{t("Hali reys yo'q")}</h4>
            <p>{t("Joyingizni yangilab, «Bo'shman» holatini tanlang — dispetcher sizga yuk biriktirganda shu yerda ko'rinadi.")}</p>
          </Empty>
        )}
      </Container>

      {profile && (
        <Overlay onMouseDown={() => setProfile(null)}>
          <Modal as="form" $w="620px" onSubmit={saveProfile} onMouseDown={(e) => e.stopPropagation()} noValidate>
            <ModalHead>
              <div>
                <h2>{t("Mening ma'lumotlarim")}</h2>
                <p>{t('Shaxsiy ma\'lumot, mashina va kirish paroli')}</p>
              </div>
              <IconButton type="button" onClick={() => setProfile(null)} aria-label={t('Yopish')}><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>{t('F.I.Sh.')}<Req>*</Req></span>
                  <Input name="name" value={profile.name} onChange={onProfile} autoFocus />
                </Field>
                <Field><span>{t('Telefon')}<Req>*</Req></span>
                  <Input name="phone" value={profile.phone} onChange={onProfile} inputMode="tel" />
                </Field>
                <Field><span>{t('Yashash shahri')}</span>
                  <Input name="city" list="drv-loc" value={profile.city} onChange={onProfile} />
                </Field>
                <Field><span>{t('Mashina rusumi')}<Req>*</Req></span>
                  <Input name="truck" value={profile.truck} onChange={onProfile} placeholder={t('MAN TGX')} />
                </Field>
                <Field><span>{t('Davlat raqami')}<Req>*</Req></span>
                  <Input name="plate" value={profile.plate} onChange={onProfile} placeholder={t('30 A 123 BA')} />
                </Field>
                <Field><span>{t('Mashina turi')}</span>
                  <FormSelect name="truckType" value={profile.truckType} onChange={onProfile}>
                    {TRUCK_TYPES.map((x) => <option key={x} value={x}>{t(x)}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>{t('Tajriba (yil)')}</span>
                  <Input name="experience" type="number" min="0" value={profile.experience} onChange={onProfile} />
                </Field>
                <Field $full><span>{t('Login')}<Req>*</Req></span>
                  <Input name="username" value={profile.username} onChange={onProfile} autoComplete="off" autoCapitalize="none" />
                </Field>
                <Field><span>{t('Yangi parol')}<Opt>{t("bo'sh — o'zgarmaydi")}</Opt></span>
                  <Input name="password" type="password" value={profile.password} onChange={onProfile} autoComplete="new-password" />
                </Field>
                <Field><span>{t('Parolni takrorlang')}</span>
                  <Input name="confirm" type="password" value={profile.confirm} onChange={onProfile} autoComplete="new-password" />
                </Field>
              </FormGrid>
              {error && <Notice $tone="danger" style={{ marginTop: 14 }}>{error}</Notice>}
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={() => setProfile(null)}>{t('Bekor qilish')}</Button>
              <Button type="submit">{t('Saqlash')}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Shell>
  );
}
