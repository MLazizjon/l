import { useMemo, useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Truck, ShieldCheck, UserRound, RotateCcw, Eye, EyeOff, Users, Copy, Search as SearchIcon,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ROLES, roleLabel } from '../../data/constants';
import { PARTNERS, PARTNER_TYPES, normalize } from '../../data/partners';
import { initials, matches } from '../../utils/helpers';
import { t } from '../../i18n';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, TableWrap, Table, Actions,
  Person, Avatar, Muted, Overlay, Modal, ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input,
  FormSelect, ConfirmBox, SegTabs, SegTab, Req, Toolbar, Search,
} from '../../styles/ui';
import { RoleTag, You, Hint, Danger, Secret } from './styles';

const EMPTY = { name: '', username: '', password: '', role: 'user' };

// Hisob turi -> jadval: hamkorlar va haydovchilar
const collOf = (kind) => (kind === 'driver' ? 'drivers' : PARTNERS[kind].collection);
const iconOf = (kind) => (kind === 'driver' ? Truck : PARTNERS[kind]?.icon);

/* Hamma hisoblar bir joyda: xodimlar va hamkorlar (zavod, broker, kompaniya).
   O'chirilgan hisob egasi tizimdan darhol chiqib ketadi. */
export default function Foydalanuvchilar() {
  const data = useData();
  const { users, create, update, remove, refresh } = data;
  const { user: me } = useAuth();
  const [tab, setTab] = useState('staff');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState({});
  const [edit, setEdit] = useState(null); // { kind, id|null, form }
  const [del, setDel] = useState(null); // { kind, id }
  const [error, setError] = useState('');

  const adminCount = users.filter((u) => u.role === 'admin').length;

  const accounts = useMemo(() => {
    if (tab === 'staff') {
      return users.map((u) => ({ id: u.id, kind: 'staff', name: u.name, username: u.username, password: u.password, role: u.role }));
    }
    if (tab === 'driver') {
      return data.drivers.filter((d) => d.username).map((d) => ({ id: d.id, kind: 'driver', name: d.name, username: d.username, password: d.password }));
    }
    return data[PARTNERS[tab].collection]
      .map((p) => normalize(tab, p))
      .filter((p) => p.username)
      .map((p) => ({ ...p, kind: tab }));
  }, [tab, users, data]);

  const rows = accounts.filter((a) => matches(a, query, ['name', 'username']));
  const countOf = (k) => (k === 'staff' ? users.length : data[collOf(k)].filter((p) => p.username).length);

  const allLogins = () => [
    ...users.map((u) => ({ kind: 'staff', id: u.id, username: u.username })),
    ...[...PARTNER_TYPES, 'driver'].flatMap((k) => data[collOf(k)].filter((p) => p.username).map((p) => ({ kind: k, id: p.id, username: p.username }))),
  ];

  const openNew = () => { setError(''); setEdit({ kind: 'staff', id: null, form: EMPTY }); };
  const openEdit = (a) => { setError(''); setEdit({ kind: a.kind, id: a.id, form: { name: a.name, username: a.username, password: a.password, role: a.role || 'user' } }); };
  const setF = (e) => { setError(''); setEdit((x) => ({ ...x, form: { ...x.form, [e.target.name]: e.target.value } })); };

  const onSave = (e) => {
    e.preventDefault();
    const { kind, id, form } = edit;
    const login = form.username.trim().toLowerCase();
    if (allLogins().some((l) => l.username.toLowerCase() === login && !(l.kind === kind && l.id === id))) {
      return setError(t('Bu login band. Boshqa login tanlang.'));
    }
    if (kind === 'staff') {
      const editing = users.find((u) => u.id === id);
      if (editing?.role === 'admin' && form.role !== 'admin' && adminCount === 1) {
        return setError(t('Tizimda kamida bitta administrator qolishi kerak.'));
      }
      const payload = { name: form.name.trim(), username: form.username.trim(), password: form.password, role: form.role };
      if (id) update('users', id, payload);
      else create('users', payload);
    } else {
      // Hamkor nomi o'z sahifasida o'zgartiriladi, bu yerda faqat kirish ma'lumotlari
      update(collOf(kind), id, { username: form.username.trim(), password: form.password });
    }
    setEdit(null);
  };

  const canDelete = (a) => a.kind !== 'staff' || (a.id !== me.id && !(a.role === 'admin' && adminCount === 1));

  const onDelete = () => {
    if (del.kind === 'staff') remove('users', del.id);
    else remove(collOf(del.kind), del.id);
    setDel(null);
  };

  const copy = (a) => {
    const text = `${window.location.origin}${a.kind === 'staff' ? '/login' : a.kind === 'driver' ? '/haydovchi' : '/kabinet'}\n${t('Login')}: ${a.username}\n${t('Parol')}: ${a.password}`;
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  const TABS = [
    { value: 'staff', label: 'Xodimlar', icon: Users },
    ...PARTNER_TYPES.map((k) => ({ value: k, label: PARTNERS[k].many, icon: PARTNERS[k].icon })),
    { value: 'driver', label: 'Haydovchilar', icon: Truck },
  ];

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{t('Foydalanuvchilar va loginlar')}</PageTitle>
          <PageSub>{t("Tizimga kira oladigan barcha hisoblar: xodimlar, zavodlar, brokerlar va logistika kompaniyalari. Hisob o'chirilsa, egasi tizimdan darhol chiqib ketadi.")}</PageSub>
        </div>
        <Button onClick={openNew}><Plus /> {t("Xodim qo'shish")}</Button>
      </PageHead>

      <SegTabs>
        {TABS.map((x) => (
          <SegTab key={x.value} $active={tab === x.value} onClick={() => setTab(x.value)}>
            <x.icon /> {t(x.label)} <b>{countOf(x.value)}</b>
          </SegTab>
        ))}
      </SegTabs>

      <Card $pad={false}>
        <Toolbar>
          <Search>
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Ism yoki login')} />
          </Search>
        </Toolbar>
        <TableWrap>
          <Table $min="760px">
            <thead>
              <tr><th>{t('Nomi')}</th><th>{t('Login')}</th><th>{t('Parol')}</th><th>{t('Rol')}</th><th /></tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const key = `${a.kind}:${a.id}`;
                const PIcon = a.kind !== 'staff' ? iconOf(a.kind) : null;
                return (
                  <tr key={key}>
                    <td>
                      <Person>
                        <Avatar $dark={a.role && a.role !== 'user'} $square={!!PIcon}>{PIcon ? <PIcon /> : initials(a.name)}</Avatar>
                        <div><strong>{a.name} {a.kind === 'staff' && a.id === me.id && <You>{t('Siz')}</You>}</strong></div>
                      </Person>
                    </td>
                    <td><strong>@{a.username}</strong></td>
                    <td>
                      <Secret>
                        <code>{shown[key] ? a.password : '••••••••'}</code>
                        <IconButton onClick={() => setShown((s) => ({ ...s, [key]: !s[key] }))} aria-label={t("Parolni ko'rsatish")} title={t("Parolni ko'rsatish")}>
                          {shown[key] ? <EyeOff /> : <Eye />}
                        </IconButton>
                      </Secret>
                    </td>
                    <td>
                      {a.kind === 'staff' ? (
                        <RoleTag $admin={a.role !== 'user'}>{a.role === 'admin' ? <ShieldCheck /> : <UserRound />}{roleLabel(a.role)}</RoleTag>
                      ) : <Muted>{a.kind === 'driver' ? t('Haydovchi') : t(PARTNERS[a.kind].one)}</Muted>}
                    </td>
                    <td>
                      <Actions>
                        <IconButton onClick={() => copy(a)} title={t('Kirish maʼlumotlarini nusxalash')} aria-label={t('Nusxalash')}><Copy /></IconButton>
                        <IconButton onClick={() => openEdit(a)} title={t('Tahrirlash')} aria-label={t('Tahrirlash')}><Pencil /></IconButton>
                        <IconButton
                          $danger
                          disabled={!canDelete(a)}
                          style={{ opacity: canDelete(a) ? 1 : 0.35 }}
                          title={canDelete(a) ? t("O'chirish") : t("Bu hisobni o'chirib bo'lmaydi")}
                          onClick={() => canDelete(a) && setDel({ kind: a.kind, id: a.id })}
                          aria-label={t("O'chirish")}
                        >
                          <Trash2 />
                        </IconButton>
                      </Actions>
                    </td>
                  </tr>
                );
              })}
              {!rows.length && <tr><td colSpan={5}><Muted>{t('Hisob topilmadi')}</Muted></td></tr>}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <Danger>
        <div>
          <h3>{t('Bazadan yangilash')}</h3>
          <p>{t("Boshqa joyda o'zgartirilgan bo'lsa, shu yerdan qayta o'qib oling.")}</p>
        </div>
        <Button $variant="ghost" onClick={refresh}><RotateCcw /> {t('Yangilash')}</Button>
      </Danger>

      {edit && (
        <Overlay onMouseDown={() => setEdit(null)}>
          <Modal as="form" $w="500px" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()}>
            <ModalHead>
              <div>
                <h2>{edit.id ? t('Hisobni tahrirlash') : t('Yangi xodim')}</h2>
                <p>{t("Kirish ma'lumotlari")}</p>
              </div>
              <IconButton type="button" onClick={() => setEdit(null)} aria-label={t('Yopish')}><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                {edit.kind === 'staff' && (
                  <Field $full><span>{t('F.I.Sh.')}<Req>*</Req></span>
                    <Input name="name" value={edit.form.name} onChange={setF} required />
                  </Field>
                )}
                <Field><span>{t('Login')}<Req>*</Req></span>
                  <Input name="username" value={edit.form.username} onChange={setF} required autoComplete="off" />
                </Field>
                <Field><span>{t('Parol')}<Req>*</Req></span>
                  <Input name="password" value={edit.form.password} onChange={setF} required autoComplete="off" />
                </Field>
                {edit.kind === 'staff' && (
                  <Field $full><span>{t('Rol')}</span>
                    <FormSelect name="role" value={edit.form.role} onChange={setF}>
                      {ROLES.map((r) => <option key={r.value} value={r.value}>{t(r.label)}</option>)}
                    </FormSelect>
                  </Field>
                )}
              </FormGrid>
              {error ? <Hint $error>{error}</Hint> : (
                <Hint>{edit.kind === 'staff'
                  ? t('Dispetcher faqat kelgan yuklar, hamkorlar, haydovchilar va Telegram bo\'limlarini ko\'radi.')
                  : edit.kind === 'driver'
                    ? t('Haydovchi shu login va parol bilan /haydovchi kabinetiga kiradi.')
                    : t('Hamkor shu login va parol bilan kabinetga kiradi.')}</Hint>
              )}
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={() => setEdit(null)}>{t('Bekor qilish')}</Button>
              <Button type="submit" disabled={(edit.kind === 'staff' && !edit.form.name.trim()) || !edit.form.username.trim() || !edit.form.password}>
                {edit.id ? t('Saqlash') : t("Qo'shish")}
              </Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {del && (
        <Overlay onMouseDown={() => setDel(null)}>
          <Modal $w="420px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>{t("Hisobni o'chirasizmi?")}</h2>
              <p>{t('U tizimdan darhol chiqib ketadi va qayta kira olmaydi.')}</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => setDel(null)}>{t('Bekor qilish')}</Button>
              <Button $variant="danger" onClick={onDelete}>{t("O'chirish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
