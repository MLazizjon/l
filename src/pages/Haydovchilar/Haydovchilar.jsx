import { useMemo, useState } from 'react';
import {
  Plus, Search as SearchIcon, Pencil, Trash2, X, Truck, ShieldCheck, UserPlus, MapPin, Navigation,
  KeyRound, Link2, Check, UserCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import { CITIES, DRIVER_STATUS, TRUCK_TYPES, toneOf } from '../../data/constants';
import { initials, matches, fmtDateTime, telHref } from '../../utils/helpers';
import { t } from '../../i18n';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, Chips, Chip, Toolbar, Search,
  Select, TableWrap, Table, Badge, Actions, Empty, Person, Avatar, Muted, Overlay, Modal,
  ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input, FormSelect, ConfirmBox, SegTabs, SegTab,
  Opt, Notice,
} from '../../styles/ui';
import { Plate, TruckCell, TripCount, Location, Cabinet } from './styles';

const EMPTY = {
  name: '', phone: '+998 ', truck: '', plate: '', truckType: '', city: 'Samarqand', location: '', heading: '',
  experience: '', status: 'Faol', username: '', password: '',
};

const cabinetLink = () => `${window.location.origin}/haydovchi`;

// Admin qo'shgan — doimiy; haydovchi /haydovchi orqali o'zi ro'yxatdan o'tgan — o'zi qo'shilgan
const isSelf = (d) => d.selfRegistered === true || d.selfRegistered === 'true';

export default function Haydovchilar() {
  const data = useData();
  const { drivers, cargo, create, update, remove } = data;
  const { canManage: isAdmin } = useAuth();
  const crud = useCrud(EMPTY);
  const [kind, setKind] = useState('permanent'); // permanent | self
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Barchasi');
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [promoteId, setPromoteId] = useState(null);

  const trips = useMemo(() => {
    const map = {};
    cargo.forEach((c) => { if (c.driverId) map[c.driverId] = (map[c.driverId] || 0) + 1; });
    return map;
  }, [cargo]);

  const permanent = useMemo(() => drivers.filter((d) => !isSelf(d)), [drivers]);
  const selfAdded = useMemo(() => drivers.filter(isSelf), [drivers]);
  const list = kind === 'self' ? selfAdded : permanent;

  const counts = useMemo(() => {
    const c = { Barchasi: list.length };
    DRIVER_STATUS.forEach((s) => (c[s] = list.filter((d) => d.status === s).length));
    return c;
  }, [list]);

  const placeOf = (d) => d.location || d.city || '';

  const rows = list
    .filter((d) => status === 'Barchasi' || d.status === status)
    .filter((d) => !city || placeOf(d) === city || d.heading === city)
    .filter((d) => matches(d, query, ['name', 'phone', 'plate', 'truck', 'location', 'username']));

  const openCreate = () => { setError(''); crud.openCreate(); };
  const openEdit = (d) => {
    setError('');
    crud.openEdit({ ...d, username: d.username || '', password: d.password || '', truckType: d.truckType || '' });
  };

  const onSave = (e) => {
    e.preventDefault();
    const f = crud.form;
    const login = f.username.trim().toLowerCase();
    if (login) {
      const taken = ['factories', 'brokers', 'companies'].some((col) => (data[col] || []).some((x) => x.username?.toLowerCase() === login))
        || drivers.some((x) => x.username?.toLowerCase() === login && x.id !== crud.editId)
        || data.users.some((u) => u.username.toLowerCase() === login);
      if (taken) return setError(t('Bu login band. Boshqa login tanlang.'));
      if (f.password.length < 4) return setError(t("Parol kamida 4 ta belgidan iborat bo'lsin."));
    }
    const before = drivers.find((d) => d.id === crud.editId);
    const location = f.location.trim();
    const payload = {
      name: f.name.trim(), phone: f.phone.trim(), truck: f.truck.trim(), plate: f.plate.trim().toUpperCase(),
      truckType: f.truckType, city: f.city, location, heading: f.heading.trim(), experience: f.experience,
      status: f.status, username: f.username.trim(), password: login ? f.password : '',
    };
    // Joy o'zgargan bo'lsa — yangilangan vaqtni ham yozamiz
    if (location && location !== (before?.location || '')) payload.locationAt = new Date().toISOString();
    if (crud.editId) update('drivers', crud.editId, payload);
    else create('drivers', payload); // admin qo'shgani — doimiy
    crud.close();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cabinetLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* */ }
  };

  const switchKind = (k) => { setKind(k); setStatus('Barchasi'); };

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{t("Haydovchilar")}</PageTitle>
          <PageSub>{t("Doimiy haydovchilarni admin qo'shadi, qolganlari haydovchi kabineti orqali o'zi ro'yxatdan o'tadi va joyini o'zi yangilaydi.")}</PageSub>
        </div>
        {isAdmin && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button $variant="ghost" onClick={copyLink}>{copied ? <Check /> : <Link2 />} {copied ? t('Nusxa olindi') : t('Haydovchi kabineti havolasi')}</Button>
            <Button onClick={openCreate}><Plus /> {t("Haydovchi qo'shish")}</Button>
          </div>
        )}
      </PageHead>

      {isAdmin && (
        <Notice>
          <Link2 /> <span>{t('Haydovchi kabineti')}: <b>{cabinetLink()}</b> — {t("haydovchi shu havola orqali o'zi ro'yxatdan o'tadi, joyi va holatini yangilaydi.")}</span>
        </Notice>
      )}

      <SegTabs>
        <SegTab $active={kind === 'permanent'} onClick={() => switchKind('permanent')}>
          <ShieldCheck /> {t('Doimiy haydovchilar')} <b>{permanent.length}</b>
        </SegTab>
        <SegTab $active={kind === 'self'} onClick={() => switchKind('self')}>
          <UserPlus /> {t("O'zi qo'shilgan haydovchilar")} <b>{selfAdded.length}</b>
        </SegTab>
      </SegTabs>

      <Chips>
        {['Barchasi', ...DRIVER_STATUS].map((s) => (
          <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
            {t(s)} <b>{counts[s]}</b>
          </Chip>
        ))}
      </Chips>

      <Card $pad={false}>
        <Toolbar>
          <Search>
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Ism, telefon, davlat raqami yoki joyi")} />
          </Search>
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">{t("Barcha shaharlar")}</option>
            {CITIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
          </Select>
        </Toolbar>

        {rows.length ? (
          <TableWrap>
            <Table $min={isAdmin ? '1080px' : '900px'}>
              <thead>
                <tr>
                  <th>{t("Haydovchi")}</th>
                  <th>{t("Mashina")}</th>
                  <th>{t("Hozirgi joyi")}</th>
                  <th>{t("Tajriba")}</th>
                  <th>{t("Reyslar")}</th>
                  {isAdmin && <th>{t('Kabinet')}</th>}
                  <th>{t("Holat")}</th>
                  {isAdmin && <th />}
                </tr>
              </thead>
              <tbody>
                {rows.map((d) => (
                  <tr key={d.id}>
                    <td>
                      <Person>
                        <Avatar $dark={!isSelf(d)}>{initials(d.name)}</Avatar>
                        <div>
                          <strong>{d.name}</strong>
                          <small>{d.phone ? <a href={telHref(d.phone)}>{d.phone}</a> : '—'}</small>
                        </div>
                      </Person>
                    </td>
                    <td>
                      <TruckCell>
                        <Plate><em>UZ</em>{d.plate || '—'}</Plate>
                        <small>{d.truck}{d.truckType ? ` · ${t(d.truckType)}` : ''}</small>
                      </TruckCell>
                    </td>
                    <td>
                      <Location>
                        <b><MapPin />{placeOf(d) || '—'}</b>
                        {d.heading && <span><Navigation />{d.heading}</span>}
                        {d.locationAt && <small>{fmtDateTime(d.locationAt)}</small>}
                      </Location>
                    </td>
                    <td><Muted>{d.experience ? `${d.experience} ${t('yil')}` : '—'}</Muted></td>
                    <td><TripCount>{trips[d.id] || 0}</TripCount></td>
                    {isAdmin && (
                      <td>
                        {d.username ? <Cabinet><KeyRound />@{d.username}</Cabinet> : <Muted>{t("Kabinet yo'q")}</Muted>}
                      </td>
                    )}
                    <td><Badge $tone={toneOf(d.status)}>{t(d.status)}</Badge></td>
                    {isAdmin && (
                      <td>
                        <Actions>
                          {isSelf(d) && (
                            <IconButton onClick={() => setPromoteId(d.id)} title={t("Doimiy haydovchilarga o'tkazish")} aria-label={t("Doimiy haydovchilarga o'tkazish")}><UserCheck /></IconButton>
                          )}
                          <IconButton onClick={() => openEdit(d)} title={t("Tahrirlash")} aria-label={t("Tahrirlash")}><Pencil /></IconButton>
                          <IconButton $danger onClick={() => crud.setDeleteId(d.id)} title={t("O'chirish")} aria-label={t("O'chirish")}><Trash2 /></IconButton>
                        </Actions>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        ) : (
          <Empty>
            <Truck />
            <h4>{t("Haydovchi topilmadi")}</h4>
            <p>{kind === 'self'
              ? t("Haydovchilar kabinet havolasi orqali ro'yxatdan o'tganda shu yerda ko'rinadi.")
              : t("Filtrlarni tozalang yoki yangi haydovchi qo'shing.")}</p>
          </Empty>
        )}
      </Card>

      {crud.open && (
        <Overlay onMouseDown={crud.close}>
          <Modal as="form" $w="640px" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()} noValidate>
            <ModalHead>
              <div>
                <h2>{crud.editId ? t('Haydovchini tahrirlash') : t('Yangi haydovchi')}</h2>
                <p>{t("Shaxsiy ma'lumot, mashina, hozirgi joyi va kabinet logini")}</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label={t("Yopish")}><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>{t("F.I.Sh.")}</span>
                  <Input name="name" value={crud.form.name} onChange={crud.onChange} placeholder={t("Jasur Rahimov")} required />
                </Field>
                <Field><span>{t("Telefon")}</span>
                  <Input name="phone" value={crud.form.phone} onChange={crud.onChange} placeholder="+998 90 123 45 67" />
                </Field>
                <Field><span>{t("Yashash shahri")}</span>
                  <FormSelect name="city" value={crud.form.city} onChange={crud.onChange}>
                    {crud.form.city && !CITIES.includes(crud.form.city) && <option value={crud.form.city}>{crud.form.city}</option>}
                    {CITIES.map((c) => <option key={c} value={c}>{t(c)}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>{t("Hozirgi joyi")}<Opt>{t("bo'sh — yashash shahri")}</Opt></span>
                  <Input name="location" list="drv-cities" value={crud.form.location} onChange={crud.onChange} />
                </Field>
                <Field><span>{t("Yo'nalish")}<Opt>{t('ixtiyoriy')}</Opt></span>
                  <Input name="heading" list="drv-cities" value={crud.form.heading} onChange={crud.onChange} />
                </Field>
                <datalist id="drv-cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
                <Field><span>{t("Mashina rusumi")}</span>
                  <Input name="truck" value={crud.form.truck} onChange={crud.onChange} placeholder={t("MAN TGX")} />
                </Field>
                <Field><span>{t("Davlat raqami")}</span>
                  <Input name="plate" value={crud.form.plate} onChange={crud.onChange} placeholder={t("30 A 123 BA")} />
                </Field>
                <Field><span>{t("Mashina turi")}</span>
                  <FormSelect name="truckType" value={crud.form.truckType} onChange={crud.onChange}>
                    <option value="">—</option>
                    {TRUCK_TYPES.map((x) => <option key={x} value={x}>{t(x)}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>{t("Tajriba (yil)")}</span>
                  <Input name="experience" type="number" min="0" value={crud.form.experience} onChange={crud.onChange} />
                </Field>
                <Field $full><span>{t("Holat")}</span>
                  <FormSelect name="status" value={crud.form.status} onChange={crud.onChange}>
                    {DRIVER_STATUS.map((s) => <option key={s} value={s}>{t(s)}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>{t('Kabinet logini')}<Opt>{t("bo'sh — kabinet yo'q")}</Opt></span>
                  <Input name="username" value={crud.form.username} onChange={(e) => { setError(''); crud.onChange(e); }} autoComplete="off" autoCapitalize="none" />
                </Field>
                <Field><span>{t('Kabinet paroli')}</span>
                  <Input name="password" value={crud.form.password} onChange={(e) => { setError(''); crud.onChange(e); }} autoComplete="off" />
                </Field>
              </FormGrid>
              {error && <Notice $tone="danger" style={{ marginTop: 14 }}>{error}</Notice>}
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={crud.close}>{t("Bekor qilish")}</Button>
              <Button type="submit" disabled={!crud.form.name.trim()}>{crud.editId ? t('Saqlash') : t("Qo'shish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {promoteId && (
        <Overlay onMouseDown={() => setPromoteId(null)}>
          <Modal $w="420px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><UserCheck /></div>
              <h2>{t("Doimiy haydovchilarga o'tkazasizmi?")}</h2>
              <p>{t("Haydovchi «Doimiy haydovchilar» ro'yxatiga o'tadi. Kabineti va logini saqlanib qoladi.")}</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => setPromoteId(null)}>{t("Bekor qilish")}</Button>
              <Button onClick={() => { update('drivers', promoteId, { selfRegistered: false }); setPromoteId(null); }}>{t("Ha, o'tkazish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {crud.deleteId && (
        <Overlay onMouseDown={() => crud.setDeleteId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>{t("Haydovchini o'chirasizmi?")}</h2>
              <p>{t("Unga biriktirilgan yuklar «Biriktirilmagan» bo'lib qoladi.")}</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>{t("Bekor qilish")}</Button>
              <Button $variant="danger" onClick={() => { remove('drivers', crud.deleteId); crud.setDeleteId(null); }}>{t("O'chirish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
