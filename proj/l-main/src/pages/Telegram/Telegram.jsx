import { useMemo, useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Send, Users, Megaphone, Bot, Copy, Check, MessageSquareText,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import { TG_STATUS, TG_TYPES } from '../../data/constants';
import { fmtNumber, money, fmtDate } from '../../utils/helpers';
import { t, useLang } from '../../i18n';
import useVisibility from '../../hooks/useVisibility';
import { ownerOf } from '../../data/partners';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, CardHead, Empty, Overlay, Modal,
  ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input, Textarea, FormSelect, ConfirmBox,
} from '../../styles/ui';
import {
  Layout, Channels, ChannelRow, TypeIcon, Info, Members, Switch, RowActions, Composer,
  Preview, Bubble, Summary,
} from './styles';

const EMPTY = { name: '', username: '@', type: 'Guruh', members: '', status: 'Ulangan', note: '' };
const TYPE_ICON = { Guruh: Users, Kanal: Megaphone, Bot };

export default function Telegram() {
  const data = useData();
  const { telegram, cargo, create, update, remove } = data;
  const { visibleCargo } = useVisibility();
  const { lang } = useLang();
  const { canManage: isAdmin } = useAuth();
  const crud = useCrud(EMPTY);
  const [cargoId, setCargoId] = useState('');
  const [copied, setCopied] = useState(false);

  const openCargo = (isAdmin ? cargo : visibleCargo).filter((c) => c.status === 'Kutilmoqda');
  const selected = cargo.find((c) => c.id === (cargoId || openCargo[0]?.id));
  const active = telegram.filter((g) => g.status === 'Ulangan');
  const reach = active.reduce((s, g) => s + (Number(g.members) || 0), 0);

  const postText = useMemo(() => {
    if (!selected) return '';
    const owner = ownerOf(selected, data);
    return [
      `🚚 ${selected.from} → ${selected.to}`,
      `📦 ${t('Yuk')}: ${selected.title}${selected.cargoType ? ` (${selected.cargoType})` : ''}`,
      `⚖️ ${t("Og'irligi")}: ${selected.weight || '—'} t${selected.volume ? ` · ${selected.volume} m³` : ''}`,
      selected.truckType ? `🚛 ${t('Mashina turi')}: ${t(selected.truckType)}` : null,
      `💰 ${t('Narxi')}: ${money(selected.price)}`,
      `📅 ${t('Yuklash sanasi')}: ${fmtDate(selected.loadDate || selected.date)}`,
      owner ? `🏢 ${owner.name}` : null,
      '',
      `📞 ${t('Aloqa')}: +998 66 200 00 00`,
    ].filter((x) => x !== null).join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, data, lang]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(postText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* brauzer ruxsat bermasa */
    }
  };

  const onSave = (e) => {
    e.preventDefault();
    const payload = { ...crud.form };
    delete payload.id;
    if (crud.editId) update('telegram', crud.editId, payload);
    else create('telegram', payload);
    crud.close();
  };

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{t("Telegram")}</PageTitle>
          <PageSub>{t("Yuk e'lonlari tarqatiladigan guruh, kanal va botlar.")}</PageSub>
        </div>
        {isAdmin && <Button onClick={crud.openCreate}><Plus /> {t("Guruh qo'shish")}</Button>}
      </PageHead>

      <Summary>
        <div><b>{active.length}</b><span>{t("ulangan manba")}</span></div>
        <div><b>{fmtNumber(reach)}</b><span>{t("jami obunachi")}</span></div>
        <div><b>{openCargo.length}</b><span>{t("e'lon kutayotgan yuk")}</span></div>
      </Summary>

      <Layout>
        <Card $pad={false}>
          <CardHead style={{ padding: t('18px 20px 0') }}>
            <h3>{t("Ulangan manbalar")}</h3>
            <span>{telegram.length} {t('ta')}</span>
          </CardHead>
          {telegram.length ? (
            <Channels>
              {telegram.map((g) => {
                const Icon = TYPE_ICON[g.type] || Send;
                const on = g.status === 'Ulangan';
                return (
                  <ChannelRow key={g.id} $off={!on}>
                    <TypeIcon $type={g.type}><Icon /></TypeIcon>
                    <Info>
                      <strong>{g.name}</strong>
                      <span>{g.username}</span>
                      {g.note && <small>{g.note}</small>}
                    </Info>
                    <Members>
                      <b>{fmtNumber(g.members)}</b>
                      <span>{g.type === 'Bot' ? t('foydalanuvchi') : t("a'zo")}</span>
                    </Members>
                    <Switch
                      type="button"
                      role="switch"
                      aria-checked={on}
                      $on={on}
                      disabled={!isAdmin}
                      title={isAdmin ? (on ? t("O'chirish") : t('Ulash')) : t(g.status)}
                      onClick={() => update('telegram', g.id, { status: on ? "O'chirilgan" : 'Ulangan' })}
                    />
                    {isAdmin && (
                      <RowActions>
                        <IconButton onClick={() => crud.openEdit(t)} aria-label={t("Tahrirlash")}><Pencil /></IconButton>
                        <IconButton $danger onClick={() => crud.setDeleteId(g.id)} aria-label={t("O'chirish")}><Trash2 /></IconButton>
                      </RowActions>
                    )}
                  </ChannelRow>
                );
              })}
            </Channels>
          ) : (
            <Empty>
              <Send />
              <h4>{t("Hali manba ulanmagan")}</h4>
              <p>{t("Birinchi guruh yoki kanalni qo'shing.")}</p>
            </Empty>
          )}
        </Card>

        <Composer>
          <CardHead>
            <h3>{t("E'lon tayyorlash")}</h3>
            <MessageSquareText size={18} color="#2563EB" />
          </CardHead>
          {openCargo.length ? (
            <>
              <Field>
                <span>{t("Kutilayotgan yuk")}</span>
                <FormSelect value={selected?.id || ''} onChange={(e) => setCargoId(e.target.value)}>
                  {openCargo.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} — {c.from} → {c.to}</option>
                  ))}
                </FormSelect>
              </Field>
              <Preview>
                <Bubble>{postText}<time>12:30</time></Bubble>
              </Preview>
              <Button $block $variant={copied ? 'dark' : 'primary'} onClick={copy}>
                {copied ? <><Check /> {t("Nusxa olindi")}</> : <><Copy /> {t("Matnni nusxalash")}</>}
              </Button>
            </>
          ) : (
            <Empty style={{ padding: t('30px 10px') }}>
              <Check />
              <h4>{t("Hamma yuklar biriktirilgan")}</h4>
              <p>{t("«Kutilmoqda» holatidagi yuk paydo bo'lsa, e'lon shu yerda tayyorlanadi.")}</p>
            </Empty>
          )}
        </Composer>
      </Layout>

      {crud.open && (
        <Overlay onMouseDown={crud.close}>
          <Modal as="form" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()}>
            <ModalHead>
              <div>
                <h2>{crud.editId ? t('Manbani tahrirlash') : t('Yangi manba')}</h2>
                <p>{t("Guruh, kanal yoki bot ma'lumotlari")}</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label={t("Yopish")}><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>{t("Nomi")}</span>
                  <Input name="name" value={crud.form.name} onChange={crud.onChange} placeholder={t("Yuk Markazi UZ")} required />
                </Field>
                <Field><span>{t("Username")}</span>
                  <Input name="username" value={crud.form.username} onChange={crud.onChange} placeholder={t("@yuk_markazi")} />
                </Field>
                <Field><span>{t("Turi")}</span>
                  <FormSelect name="type" value={crud.form.type} onChange={crud.onChange}>
                    {TG_TYPES.map((x) => <option key={x} value={x}>{t(x)}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>{t("A'zolar soni")}</span>
                  <Input name="members" type="number" min="0" value={crud.form.members} onChange={crud.onChange} />
                </Field>
                <Field><span>{t("Holat")}</span>
                  <FormSelect name="status" value={crud.form.status} onChange={crud.onChange}>
                    {TG_STATUS.map((s) => <option key={s} value={s}>{t(s)}</option>)}
                  </FormSelect>
                </Field>
                <Field $full><span>{t("Izoh")}</span>
                  <Textarea name="note" value={crud.form.note} onChange={crud.onChange} placeholder={t("Qaysi yo'nalishlar uchun ishlatiladi")} />
                </Field>
              </FormGrid>
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={crud.close}>{t("Bekor qilish")}</Button>
              <Button type="submit" disabled={!crud.form.name.trim()}>{crud.editId ? t('Saqlash') : t("Qo'shish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {crud.deleteId && (
        <Overlay onMouseDown={() => crud.setDeleteId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>{t("Manbani o'chirasizmi?")}</h2>
              <p>{t("Bu guruh ro'yxatdan olib tashlanadi.")}</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>{t("Bekor qilish")}</Button>
              <Button $variant="danger" onClick={() => { remove('telegram', crud.deleteId); crud.setDeleteId(null); }}>{t("O'chirish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
