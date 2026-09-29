import { useMemo, useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Send, Users, Megaphone, Bot, Copy, Check, MessageSquareText,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import { TG_STATUS, TG_TYPES } from '../../data/constants';
import { fmtNumber, money, fmtDate } from '../../utils/helpers';
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
  const { telegram, cargo, factories, create, update, remove } = useData();
  const { isAdmin } = useAuth();
  const crud = useCrud(EMPTY);
  const [cargoId, setCargoId] = useState('');
  const [copied, setCopied] = useState(false);

  const openCargo = cargo.filter((c) => c.status === 'Kutilmoqda');
  const selected = cargo.find((c) => c.id === (cargoId || openCargo[0]?.id));
  const active = telegram.filter((t) => t.status === 'Ulangan');
  const reach = active.reduce((s, t) => s + (Number(t.members) || 0), 0);

  const postText = useMemo(() => {
    if (!selected) return '';
    const factory = factories.find((f) => f.id === selected.factoryId);
    return [
      `🚚 ${selected.from} → ${selected.to}`,
      `📦 Yuk: ${selected.title}${factory ? ` (${factory.name})` : ''}`,
      `⚖️ Og'irligi: ${selected.weight || '—'} tonna`,
      `💰 Narxi: ${money(selected.price)}`,
      `📅 Yuklash sanasi: ${fmtDate(selected.date)}`,
      '',
      '📞 Aloqa: +998 66 200 00 00',
    ].join('\n');
  }, [selected, factories]);

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
          <PageTitle>Telegram</PageTitle>
          <PageSub>Yuk e'lonlari tarqatiladigan guruh, kanal va botlar.</PageSub>
        </div>
        {isAdmin && <Button onClick={crud.openCreate}><Plus /> Guruh qo'shish</Button>}
      </PageHead>

      <Summary>
        <div><b>{active.length}</b><span>ulangan manba</span></div>
        <div><b>{fmtNumber(reach)}</b><span>jami obunachi</span></div>
        <div><b>{openCargo.length}</b><span>e'lon kutayotgan yuk</span></div>
      </Summary>

      <Layout>
        <Card $pad={false}>
          <CardHead style={{ padding: '18px 20px 0' }}>
            <h3>Ulangan manbalar</h3>
            <span>{telegram.length} ta</span>
          </CardHead>
          {telegram.length ? (
            <Channels>
              {telegram.map((t) => {
                const Icon = TYPE_ICON[t.type] || Send;
                const on = t.status === 'Ulangan';
                return (
                  <ChannelRow key={t.id} $off={!on}>
                    <TypeIcon $type={t.type}><Icon /></TypeIcon>
                    <Info>
                      <strong>{t.name}</strong>
                      <span>{t.username}</span>
                      {t.note && <small>{t.note}</small>}
                    </Info>
                    <Members>
                      <b>{fmtNumber(t.members)}</b>
                      <span>{t.type === 'Bot' ? 'foydalanuvchi' : "a'zo"}</span>
                    </Members>
                    <Switch
                      type="button"
                      role="switch"
                      aria-checked={on}
                      $on={on}
                      disabled={!isAdmin}
                      title={isAdmin ? (on ? "O'chirish" : 'Ulash') : t.status}
                      onClick={() => update('telegram', t.id, { status: on ? "O'chirilgan" : 'Ulangan' })}
                    />
                    {isAdmin && (
                      <RowActions>
                        <IconButton onClick={() => crud.openEdit(t)} aria-label="Tahrirlash"><Pencil /></IconButton>
                        <IconButton $danger onClick={() => crud.setDeleteId(t.id)} aria-label="O'chirish"><Trash2 /></IconButton>
                      </RowActions>
                    )}
                  </ChannelRow>
                );
              })}
            </Channels>
          ) : (
            <Empty>
              <Send />
              <h4>Hali manba ulanmagan</h4>
              <p>Birinchi guruh yoki kanalni qo'shing.</p>
            </Empty>
          )}
        </Card>

        <Composer>
          <CardHead>
            <h3>E'lon tayyorlash</h3>
            <MessageSquareText size={18} color="#2E9CF4" />
          </CardHead>
          {openCargo.length ? (
            <>
              <Field>
                <span>Kutilayotgan yuk</span>
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
                {copied ? <><Check /> Nusxa olindi</> : <><Copy /> Matnni nusxalash</>}
              </Button>
            </>
          ) : (
            <Empty style={{ padding: '30px 10px' }}>
              <Check />
              <h4>Hamma yuklar biriktirilgan</h4>
              <p>"Kutilmoqda" holatidagi yuk paydo bo'lsa, e'lon shu yerda tayyorlanadi.</p>
            </Empty>
          )}
        </Composer>
      </Layout>

      {crud.open && (
        <Overlay onMouseDown={crud.close}>
          <Modal as="form" onSubmit={onSave} onMouseDown={(e) => e.stopPropagation()}>
            <ModalHead>
              <div>
                <h2>{crud.editId ? 'Manbani tahrirlash' : 'Yangi manba'}</h2>
                <p>Guruh, kanal yoki bot ma'lumotlari</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label="Yopish"><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>Nomi</span>
                  <Input name="name" value={crud.form.name} onChange={crud.onChange} placeholder="Yuk Markazi UZ" required />
                </Field>
                <Field><span>Username</span>
                  <Input name="username" value={crud.form.username} onChange={crud.onChange} placeholder="@yuk_markazi" />
                </Field>
                <Field><span>Turi</span>
                  <FormSelect name="type" value={crud.form.type} onChange={crud.onChange}>
                    {TG_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>A'zolar soni</span>
                  <Input name="members" type="number" min="0" value={crud.form.members} onChange={crud.onChange} />
                </Field>
                <Field><span>Holat</span>
                  <FormSelect name="status" value={crud.form.status} onChange={crud.onChange}>
                    {TG_STATUS.map((s) => <option key={s}>{s}</option>)}
                  </FormSelect>
                </Field>
                <Field $full><span>Izoh</span>
                  <Textarea name="note" value={crud.form.note} onChange={crud.onChange} placeholder="Qaysi yo'nalishlar uchun ishlatiladi" />
                </Field>
              </FormGrid>
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={crud.close}>Bekor qilish</Button>
              <Button type="submit" disabled={!crud.form.name.trim()}>{crud.editId ? 'Saqlash' : "Qo'shish"}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}

      {crud.deleteId && (
        <Overlay onMouseDown={() => crud.setDeleteId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>Manbani o'chirasizmi?</h2>
              <p>Bu guruh ro'yxatdan olib tashlanadi.</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>Bekor qilish</Button>
              <Button $variant="danger" onClick={() => { remove('telegram', crud.deleteId); crud.setDeleteId(null); }}>O'chirish</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
