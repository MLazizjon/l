import { useMemo, useState } from 'react';
import {
  Plus, Pencil, Trash2, X, Send, Users, Megaphone, Bot, Copy, Check, MessageSquareText, Inbox,
  Settings2, Radio, Wand2, Link2, ShieldCheck, Terminal, PackagePlus, CircleCheck, CircleAlert,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useCrud from '../../hooks/useCrud';
import useVisibility from '../../hooks/useVisibility';
import { TG_STATUS, TG_TYPES, sourceOf } from '../../data/constants';
import { ownerOf } from '../../data/partners';
import { fmtNumber, money, fmtDate, today } from '../../utils/helpers';
import { parseCargoText } from '../../utils/tgParser';
import { SUPABASE_URL } from '../../supabase/supabase';
import { t, useLang } from '../../i18n';
import Yuklar from '../Yuklar/Yuklar';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, CardHead, Empty, Overlay, Modal,
  ModalHead, ModalBody, ModalFoot, FormGrid, Field, Input, Textarea, FormSelect, ConfirmBox,
  SegTabs, SegTab, Toggle, Notice, Badge,
} from '../../styles/ui';
import {
  Layout, Channels, ChannelRow, TypeIcon, Info, Members, Switch, RowActions, Composer,
  Preview, Bubble, Summary, Steps, StepItem, CodeLine, ParsedGrid,
} from './styles';

const EMPTY = { name: '', username: '@', type: 'Kanal', members: '', status: 'Ulangan', note: '', autoImport: true };
const TYPE_ICON = { Guruh: Users, Kanal: Megaphone, Bot };
const WEBHOOK = `${SUPABASE_URL}/functions/v1/telegram-webhook`;
const SAMPLE = "🚚 Samarqand → Toshkent\n📦 Yuk: Sement M500, qopda\n⚖️ 22 tonna\n💰 Narxi: 6 900 000 so'm\nTent kerak\n📞 +998 90 123 45 67";

/* Telegram markazi — 3 qism:
   1) Telegramdan kelgan yuklar  2) Kanal va guruhlar  3) Ulash (bot, webhook, sinov) */
export default function Telegram() {
  const { canManage } = useAuth();
  const [tab, setTab] = useState('cargo');
  const { cargo } = useData();
  const { visibleCargo } = useVisibility();
  const tgOpen = (canManage ? cargo : visibleCargo).filter((c) => sourceOf(c) === 'telegram' && c.status === 'Kutilmoqda').length;

  const TABS = [
    { value: 'cargo', label: 'Kelgan yuklar', icon: Inbox, n: tgOpen },
    { value: 'channels', label: 'Kanal va guruhlar', icon: Radio },
    ...(canManage ? [{ value: 'setup', label: 'Ulash va sinov', icon: Settings2 }] : []),
  ];

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{t('Telegram markazi')}</PageTitle>
          <PageSub>{t("Telegram kanal va guruhlaringizga tushgan yuk e'lonlari avtomatik shu yerga keladi. Dispetcher ularni oddiy yuk kabi yopadi.")}</PageSub>
        </div>
      </PageHead>

      <SegTabs>
        {TABS.map((x) => (
          <SegTab key={x.value} $active={tab === x.value} onClick={() => setTab(x.value)}>
            <x.icon /> {t(x.label)}{x.n !== undefined && <b>{x.n}</b>}
          </SegTab>
        ))}
      </SegTabs>

      {tab === 'cargo' && <Yuklar source="telegram" embedded />}
      {tab === 'channels' && <ChannelsTab />}
      {tab === 'setup' && canManage && <SetupTab />}
    </Page>
  );
}

/* ---------- 2. Kanal va guruhlar + e'lon tayyorlash ---------- */
function ChannelsTab() {
  const data = useData();
  const { telegram, cargo, create, update, remove } = data;
  const { canManage } = useAuth();
  const { visibleCargo } = useVisibility();
  const { lang } = useLang();
  const crud = useCrud(EMPTY);
  const [cargoId, setCargoId] = useState('');
  const [copied, setCopied] = useState(false);

  const openCargo = (canManage ? cargo : visibleCargo).filter((c) => c.status === 'Kutilmoqda');
  const selected = cargo.find((c) => c.id === (cargoId || openCargo[0]?.id));
  const active = telegram.filter((g) => g.status === 'Ulangan');
  const reach = active.reduce((s, g) => s + (Number(g.members) || 0), 0);
  const imported = cargo.filter((c) => sourceOf(c) === 'telegram').length;

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
    } catch { /* brauzer ruxsat bermasa */ }
  };

  const onSave = (e) => {
    e.preventDefault();
    const payload = { ...crud.form, username: crud.form.username.trim() };
    delete payload.id;
    if (crud.editId) update('telegram', crud.editId, payload);
    else create('telegram', payload);
    crud.close();
  };

  return (
    <>
      <Summary>
        <div><b>{active.length}</b><span>{t('ulangan manba')}</span></div>
        <div><b>{fmtNumber(reach)}</b><span>{t('jami obunachi')}</span></div>
        <div><b>{imported}</b><span>{t('Telegramdan kelgan yuk')}</span></div>
      </Summary>

      <Layout>
        <Card $pad={false}>
          <CardHead style={{ padding: '18px 20px 0' }}>
            <h3>{t('Kanal va guruhlar')}</h3>
            {canManage
              ? <Button onClick={crud.openCreate} style={{ height: 34 }}><Plus /> {t("Qo'shish")}</Button>
              : <span>{telegram.length} {t('ta')}</span>}
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
                      <small>
                        {g.autoImport === false ? t("Avtomatik yuk olish o'chiq") : t('Yuklar avtomatik olinadi')}
                        {g.chatId ? ` · ${t('bot ulangan')}` : ''}
                      </small>
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
                      disabled={!canManage}
                      title={canManage ? (on ? t("O'chirish") : t('Ulash')) : t(g.status)}
                      onClick={() => update('telegram', g.id, { status: on ? "O'chirilgan" : 'Ulangan' })}
                    />
                    {canManage && (
                      <RowActions>
                        <IconButton onClick={() => crud.openEdit({ ...g, autoImport: g.autoImport !== false })} aria-label={t('Tahrirlash')}><Pencil /></IconButton>
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
              <h4>{t('Hali manba ulanmagan')}</h4>
              <p>{t("Birinchi guruh yoki kanalni qo'shing.")}</p>
            </Empty>
          )}
        </Card>

        <Composer>
          <CardHead>
            <h3>{t("E'lon tayyorlash")}</h3>
            <MessageSquareText size={18} />
          </CardHead>
          {openCargo.length ? (
            <>
              <Field>
                <span>{t('Kutilayotgan yuk')}</span>
                <FormSelect value={selected?.id || ''} onChange={(e) => setCargoId(e.target.value)}>
                  {openCargo.map((c) => <option key={c.id} value={c.id}>{c.title} — {c.from} → {c.to}</option>)}
                </FormSelect>
              </Field>
              <Preview><Bubble>{postText}<time>12:30</time></Bubble></Preview>
              <Button $block $variant={copied ? 'dark' : 'primary'} onClick={copy}>
                {copied ? <><Check /> {t('Nusxa olindi')}</> : <><Copy /> {t('Matnni nusxalash')}</>}
              </Button>
            </>
          ) : (
            <Empty style={{ padding: '30px 10px' }}>
              <Check />
              <h4>{t('Hamma yuklar biriktirilgan')}</h4>
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
                <p>{t("Kanal username'i Telegram'dagi bilan bir xil bo'lsin (masalan @yuk_kanal)")}</p>
              </div>
              <IconButton type="button" onClick={crud.close} aria-label={t('Yopish')}><X /></IconButton>
            </ModalHead>
            <ModalBody>
              <FormGrid>
                <Field $full><span>{t('Nomi')}</span>
                  <Input name="name" value={crud.form.name} onChange={crud.onChange} placeholder="Yuk Markazi UZ" required />
                </Field>
                <Field><span>Username</span>
                  <Input name="username" value={crud.form.username} onChange={crud.onChange} placeholder="@yuk_markazi" />
                </Field>
                <Field><span>{t('Turi')}</span>
                  <FormSelect name="type" value={crud.form.type} onChange={crud.onChange}>
                    {TG_TYPES.map((x) => <option key={x} value={x}>{t(x)}</option>)}
                  </FormSelect>
                </Field>
                <Field><span>{t("A'zolar soni")}</span>
                  <Input name="members" type="number" min="0" value={crud.form.members} onChange={crud.onChange} />
                </Field>
                <Field><span>{t('Holat')}</span>
                  <FormSelect name="status" value={crud.form.status} onChange={crud.onChange}>
                    {TG_STATUS.map((s) => <option key={s} value={s}>{t(s)}</option>)}
                  </FormSelect>
                </Field>
                <Field $full>
                  <span>{t('Avtomatik yuk olish')}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Toggle type="button" $on={crud.form.autoImport !== false} onClick={() => crud.setForm((f) => ({ ...f, autoImport: f.autoImport === false }))} />
                    <small style={{ opacity: 0.7 }}>{t("Yoqilgan bo'lsa, shu kanaldagi yuk e'lonlari saytga o'zi tushadi")}</small>
                  </div>
                </Field>
                <Field $full><span>{t('Izoh')}</span>
                  <Textarea name="note" value={crud.form.note || ''} onChange={crud.onChange} placeholder={t("Qaysi yo'nalishlar uchun ishlatiladi")} />
                </Field>
              </FormGrid>
            </ModalBody>
            <ModalFoot>
              <Button type="button" $variant="ghost" onClick={crud.close}>{t('Bekor qilish')}</Button>
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
              <Button $variant="ghost" onClick={() => crud.setDeleteId(null)}>{t('Bekor qilish')}</Button>
              <Button $variant="danger" onClick={() => { remove('telegram', crud.deleteId); crud.setDeleteId(null); }}>{t("O'chirish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </>
  );
}

/* ---------- 3. Ulash: bot + webhook + matnni sinash ---------- */
function SetupTab() {
  const { create } = useData();
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [hook, setHook] = useState(null); // { ok, text }
  const [busy, setBusy] = useState(false);
  const [sample, setSample] = useState(SAMPLE);
  const [added, setAdded] = useState(false);
  const parsed = useMemo(() => parseCargoText(sample), [sample]);

  const connect = async () => {
    setBusy(true);
    setHook(null);
    try {
      const params = new URLSearchParams({
        url: WEBHOOK,
        allowed_updates: JSON.stringify(['channel_post', 'edited_channel_post', 'message', 'edited_message']),
      });
      if (secret.trim()) params.set('secret_token', secret.trim());
      const r = await fetch(`https://api.telegram.org/bot${token.trim()}/setWebhook`, { method: 'POST', body: params });
      const j = await r.json();
      setHook({ ok: !!j.ok, text: j.description || (j.ok ? 'OK' : 'Error') });
    } catch (e) {
      setHook({ ok: false, text: String(e.message || e) });
    }
    setBusy(false);
  };

  const addAsCargo = () => {
    create('cargo', {
      title: parsed.title, from: parsed.from, to: parsed.to, weight: parsed.weight, volume: parsed.volume,
      price: parsed.price || 0, phone: parsed.phone, truckType: parsed.truckType, note: parsed.note,
      source: 'telegram', tgChannel: t("Qo'lda kiritilgan"), tgText: sample, status: 'Kutilmoqda',
      date: today(), driverId: '', addedBy: 'admin', createdAt: new Date().toISOString(),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const F = [
    ['Yuk nomi', parsed.title], ['Qayerdan', parsed.from], ['Qayerga', parsed.to],
    ["Og'irlik (tonna)", parsed.weight], ['Hajm (m³)', parsed.volume], ["Narx (so'm)", parsed.price ? money(parsed.price) : ''],
    ['Telefon', parsed.phone], ['Mashina turi', t(parsed.truckType)], ['Izoh', parsed.note],
  ];

  return (
    <Layout>
      <Card>
        <CardHead><h3>{t('Avtomatik ulash — 4 qadam')}</h3><ShieldCheck size={18} /></CardHead>
        <Steps>
          <StepItem>
            <i>1</i>
            <div>
              <strong>{t('Bot yarating')}</strong>
              <p>{t("Telegram'da @BotFather → /newbot. Bergan tokenni saqlab qo'ying.")}</p>
            </div>
          </StepItem>
          <StepItem>
            <i>2</i>
            <div>
              <strong>{t("Botni kanallarga admin qiling")}</strong>
              <p>{t("Har bir kanal/guruh → Sozlamalar → Administratorlar → botni qo'shing. So'ng «Kanal va guruhlar» bo'limida kanalni username bilan qo'shing.")}</p>
            </div>
          </StepItem>
          <StepItem>
            <i>3</i>
            <div>
              <strong>{t("Funksiyani Supabase'ga joylang (bir marta)")}</strong>
              <p>{t('Loyiha papkasida terminalda:')}</p>
              <CodeLine><Terminal /> supabase functions deploy telegram-webhook --no-verify-jwt</CodeLine>
              <CodeLine><Terminal /> supabase secrets set TELEGRAM_SECRET=maxfiy_soz</CodeLine>
            </div>
          </StepItem>
          <StepItem>
            <i>4</i>
            <div>
              <strong>{t('Botni saytga ulang')}</strong>
              <p>{t("Token va maxfiy so'zni kiriting — token saqlanmaydi, faqat Telegram'ga yuboriladi.")}</p>
              <FormGrid style={{ marginTop: 10 }}>
                <Field $full><span>{t('Bot tokeni')}</span>
                  <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="123456:ABC-..." autoComplete="off" />
                </Field>
                <Field $full><span>{t("Maxfiy so'z (TELEGRAM_SECRET)")}</span>
                  <Input value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="maxfiy_soz" autoComplete="off" />
                </Field>
              </FormGrid>
              <CodeLine style={{ marginTop: 10 }}><Link2 /> {WEBHOOK}</CodeLine>
              <Button style={{ marginTop: 12 }} onClick={connect} disabled={!token.trim() || busy}><Radio /> {busy ? '…' : t('Webhookni ulash')}</Button>
              {hook && (
                <Notice $tone={hook.ok ? undefined : 'danger'} style={{ marginTop: 12 }}>
                  {hook.ok ? <CircleCheck /> : <CircleAlert />}
                  {hook.ok ? t("Bot ulandi! Endi kanallarga tushgan yuklar saytga avtomatik keladi.") : hook.text}
                </Notice>
              )}
            </div>
          </StepItem>
        </Steps>
      </Card>

      <Composer>
        <CardHead><h3>{t("E'lonni sinab ko'rish")}</h3><Wand2 size={18} /></CardHead>
        <p style={{ fontSize: 13, opacity: 0.7, marginTop: -8 }}>{t("Kanaldagi e'lon matnini qo'ying — tizim undan qanday yuk ajratib olishini ko'rasiz.")}</p>
        <Textarea value={sample} onChange={(e) => setSample(e.target.value)} style={{ minHeight: 150 }} />
        <ParsedGrid>
          {F.map(([k, v]) => (
            <div key={k}><span>{t(k)}</span><b>{v || '—'}</b></div>
          ))}
        </ParsedGrid>
        {parsed.isCargo
          ? <Badge $tone="blue"><CircleCheck size={13} /> {t('Yuk sifatida tanildi')}</Badge>
          : <Badge $tone="danger">{t("Yo'nalish topilmadi — bu xabar yuk deb olinmaydi")}</Badge>}
        <Button $block disabled={!parsed.isCargo} onClick={addAsCargo}>
          {added ? <><Check /> {t("Qo'shildi")}</> : <><PackagePlus /> {t("Yuk sifatida qo'shish")}</>}
        </Button>
      </Composer>
    </Layout>
  );
}
