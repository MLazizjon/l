import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search as SearchIcon, Pencil, Trash2, X, MapPin, KeyRound, Boxes, Link2, Check, EyeOff,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useVisibility from '../../hooks/useVisibility';
import { PARTNERS, normalize, denormalize } from '../../data/partners';
import { CITIES, toneOf } from '../../data/constants';
import { matches, fmtNumber, telHref } from '../../utils/helpers';
import { t } from '../../i18n';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, Chips, Chip, Toolbar, Search,
  TableWrap, Table, Badge, Actions, Empty, Person, Avatar, Muted, Overlay, Modal, ModalHead,
  ModalBody, ModalFoot, FormGrid, Field, Input, FormSelect, ConfirmBox, Req, Opt, Notice,
} from '../../styles/ui';
import { City, Volume, Cabinet } from './styles';

const cabinetLink = () => `${window.location.origin}/kabinet`;

/* Zavodlar, brokerlar va logistika kompaniyalari — bitta sahifa, turi bo'yicha */
export default function Hamkorlar({ type }) {
  const cfg = PARTNERS[type];
  const Icon = cfg.icon;
  const data = useData();
  const { cargo, create, update, remove } = data;
  const { canManage } = useAuth();
  const { isVisible } = useVisibility();
  const navigate = useNavigate();

  const EMPTY = {
    name: '', contact: '', phone: '+998 ', city: 'Toshkent', status: cfg.defaultStatus,
    product: '', commission: '5', username: '', password: '',
  };
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Barchasi');
  const [copied, setCopied] = useState(false);

  const list = useMemo(() => data[cfg.collection].map((p) => normalize(type, p)), [data, cfg.collection, type]);

  const volume = useMemo(() => {
    const map = {};
    cargo.forEach((c) => {
      const id = c[cfg.fk];
      if (!id || c.status === 'Bekor qilindi') return;
      map[id] = map[id] || { count: 0, tons: 0, open: 0 };
      map[id].count += 1;
      map[id].tons += Number(c.weight) || 0;
      if (c.status === 'Kutilmoqda') map[id].open += 1;
    });
    return map;
  }, [cargo, cfg.fk]);

  const rows = list
    .filter((p) => status === 'Barchasi' || p.status === status)
    .filter((p) => matches(p, query, ['name', 'city', 'contact', 'phone', 'product', 'username']));

  const onChange = (e) => { setError(''); setForm((f) => ({ ...f, [e.target.name]: e.target.value })); };

  const openCreate = () => { setForm(EMPTY); setEditId(null); setError(''); setOpen(true); };
  const openEdit = (p) => { setForm({ ...EMPTY, ...p, username: p.username || '', password: p.password || '' }); setEditId(p.id); setError(''); setOpen(true); };

  const onSave = (e) => {
    e.preventDefault();
    const login = form.username.trim().toLowerCase();
    if (login) {
      const taken = ['factories', 'brokers', 'companies'].some((col) =>
        data[col].some((x) => x.username?.toLowerCase() === login && !(col === cfg.collection && x.id === editId)))
        || data.drivers.some((d) => d.username?.toLowerCase() === login)
        || data.users.some((u) => u.username.toLowerCase() === login);
      if (taken) return setError(t('Bu login band. Boshqa login tanlang.'));
      if (form.password.length < 4) return setError(t("Parol kamida 4 ta belgidan iborat bo'lsin."));
    }
    const payload = denormalize(type, form);
    if (editId) update(cfg.collection, editId, payload);
    else create(cfg.collection, payload);
    setOpen(false);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cabinetLink());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* */ }
  };

  const valid = form.name.trim() && form.phone.replace(/\D/g, '').length >= 9;

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{t(cfg.many)}</PageTitle>
          <PageSub>
            {canManage
              ? t("Hamkorlar o'z kabinetiga login va parol bilan kiradi va yuk joylaydi. Kabinet havolasini ularga yuboring.")
              : t("Yuk beruvchi hamkorlar va ularning aloqa ma'lumotlari.")}
          </PageSub>
        </div>
        {canManage && (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Button $variant="ghost" onClick={copyLink}>{copied ? <Check /> : <Link2 />} {copied ? t('Nusxa olindi') : t('Kabinet havolasi')}</Button>
            <Button $variant="ghost" onClick={() => navigate(`/yuklar/${type}`)}><Boxes /> {t(cfg.cargo)}</Button>
            <Button onClick={openCreate}><Plus /> {t("Qo'shish")}</Button>
          </div>
        )}
      </PageHead>

      {canManage && (
        <Notice>
          <Link2 /> <span>{t('Kabinet havolasi')}: <b>{cabinetLink()}</b> — {t("hamkor shu havola orqali ro'yxatdan o'tadi yoki kiradi.")}</span>
        </Notice>
      )}
      {canManage && !isVisible(type) && (
        <Notice $tone="danger"><EyeOff /> {t("Bu hamkorlar yuklari hozir dispetcherlardan yashirilgan.")}</Notice>
      )}

      <Chips>
        {['Barchasi', ...cfg.statuses].map((s) => (
          <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
            {t(s)} <b>{s === 'Barchasi' ? list.length : list.filter((p) => p.status === s).length}</b>
          </Chip>
        ))}
      </Chips>

      <Card $pad={false}>
        <Toolbar>
          <Search>
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Nomi, shahar, telefon yoki login')} />
          </Search>
        </Toolbar>

        {rows.length ? (
          <TableWrap>
            <Table $min={canManage ? '1080px' : '820px'}>
              <thead>
                <tr>
                  <th>{t(cfg.one)}</th>
                  <th>{t('Shahar')}</th>
                  <th>{t("Mas'ul shaxs")}</th>
                  <th>{t('Yuklar')}</th>
                  {canManage && <th>{t('Kabinet')}</th>}
                  <th>{t('Holat')}</th>
                  {canManage && <th />}
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => {
                  const v = volume[p.id] || { count: 0, tons: 0, open: 0 };
                  return (
                    <tr key={p.id}>
                      <td>
                        <Person>
                          <Avatar $square><Icon /></Avatar>
                          <div>
                            <strong>{p.name}</strong>
                            <small>{type === 'factory' ? p.product : type === 'broker' ? `${t('Ulush')}: ${p.commission || 0}%` : t(cfg.one)}</small>
                          </div>
                        </Person>
                      </td>
                      <td>{p.city ? <City><MapPin />{p.city}</City> : <Muted>—</Muted>}</td>
                      <td>
                        <div>{p.contact || '—'}</div>
                        {p.phone && <Muted><a href={telHref(p.phone)}>{p.phone}</a></Muted>}
                      </td>
                      <td>
                        <Volume>
                          <b>{v.count} {t('ta')} · {fmtNumber(v.tons)} t</b>
                          <span>{v.open} {t('ta ochiq')}</span>
                        </Volume>
                      </td>
                      {canManage && (
                        <td>
                          {p.username ? (
                            <Cabinet><KeyRound />@{p.username}{p.selfRegistered && <em>{t("o'zi ro'yxatdan o'tgan")}</em>}</Cabinet>
                          ) : <Muted>{t("Kabinet yo'q")}</Muted>}
                        </td>
                      )}
                      <td><Badge $tone={toneOf(p.status)}>{t(p.status)}</Badge></td>
                      {canManage && (
                        <td>
                          <Actions>
                            <IconButton onClick={() => navigate(`/yuklar/${type}?owner=${p.id}`)} title={t('Yuklarini ko\'rish')} aria-label={t('Yuklarini ko\'rish')}><Boxes /></IconButton>
                            <IconButton onClick={() => openEdit(p)} title={t('Tahrirlash')} aria-label={t('Tahrirlash')}><Pencil /></IconButton>
                            <IconButton $danger onClick={() => setDeleteId(p.id)} title={t("O'chirish")} aria-label={t("O'chirish")}><Trash2 /></IconButton>
                          </Actions>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrap>
        ) : (
          <Empty>
            <Icon />
            <h4>{t('Hech narsa topilmadi')}</h4>
            <p>{t("Qidiruvni o'zgartiring yoki yangisini qo'shing.")}</p>
          </Empty>
        )}
      </Card>

      {open && (
        <Overlay onMouseDown={() => setOpen(false)}>
          <Modal as="form" $w="620px" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()} noValidate>
            <ModalHead>
              <div>
                <h2>{editId ? t('Tahrirlash') : t("Yangi qo'shish")}: {t(cfg.one)}</h2>
                <p>{t('Aloqa ma\'lumotlari va kabinetga kirish uchun login/parol')}</p>
              </div>
              <IconButton type="button" onClick={() => setOpen(false)} aria-label={t('Yopish')}><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>{t('Nomi')}<Req>*</Req></span>
                  <Input name="name" value={form.name} onChange={onChange} autoFocus />
                </Field>
                <Field><span>{t("Mas'ul shaxs")}</span>
                  <Input name="contact" value={form.contact || ''} onChange={onChange} />
                </Field>
                <Field><span>{t('Telefon')}<Req>*</Req></span>
                  <Input name="phone" value={form.phone || ''} onChange={onChange} inputMode="tel" />
                </Field>
                <Field><span>{t('Shahar')}</span>
                  <Input name="city" list="p-cities" value={form.city || ''} onChange={onChange} />
                  <datalist id="p-cities">{CITIES.map((c) => <option key={c} value={c} />)}</datalist>
                </Field>
                {type === 'factory' && (
                  <Field><span>{t('Mahsulot')}</span>
                    <Input name="product" value={form.product || ''} onChange={onChange} placeholder={t('sement, un...')} />
                  </Field>
                )}
                {type === 'broker' && (
                  <Field><span>{t('Ulush (%)')}</span>
                    <Input name="commission" type="number" min="0" step="0.5" value={form.commission || ''} onChange={onChange} />
                  </Field>
                )}
                <Field $full={type === 'company'}><span>{t('Holat')}</span>
                  <FormSelect name="status" value={form.status} onChange={onChange}>
                    {cfg.statuses.map((s) => <option key={s} value={s}>{t(s)}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>{t('Kabinet logini')}<Opt>{t("bo'sh — kabinet yo'q")}</Opt></span>
                  <Input name="username" value={form.username} onChange={onChange} autoComplete="off" />
                </Field>
                <Field><span>{t('Kabinet paroli')}</span>
                  <Input name="password" value={form.password} onChange={onChange} autoComplete="off" />
                </Field>
              </FormGrid>
              {error && <p style={{ marginTop: 12, color: 'var(--danger, #E5484D)', fontSize: 13 }}>{error}</p>}
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={() => setOpen(false)}>{t('Bekor qilish')}</Button>
              <Button type="submit" disabled={!valid}>{editId ? t('Saqlash') : t("Qo'shish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {deleteId && (
        <Overlay onMouseDown={() => setDeleteId(null)}>
          <Modal $w="420px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>{t("O'chirasizmi?")}</h2>
              <p>{t("Hamkor o'chiriladi va kabinetidan darhol chiqib ketadi. Yuklar tarixi saqlanib qoladi.")}</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => setDeleteId(null)}>{t('Bekor qilish')}</Button>
              <Button $variant="danger" onClick={() => { remove(cfg.collection, deleteId); setDeleteId(null); }}>{t("O'chirish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
