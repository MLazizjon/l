import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Plus, Search as SearchIcon, Pencil, Trash2, PackageOpen, Download, CheckCheck, Layers, PackagePlus,
  EyeOff, PackageCheck, ShieldCheck,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useVisibility from '../../hooks/useVisibility';
import { CARGO_STATUS, CARGO_SOURCES, sourceOf, sourceLabel, toneOf } from '../../data/constants';
import { PARTNERS, normalize, ownerOf } from '../../data/partners';
import { money, fmtDate, matches, today, downloadCSV } from '../../utils/helpers';
import { t } from '../../i18n';
import CargoForm, { EMPTY_CARGO, cargoPayload } from '../../components/CargoForm/CargoForm';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, Chips, Chip, Toolbar, Search,
  Select, TableWrap, Table, Badge, Actions, Empty, Muted, Overlay, Modal, ModalFoot, ConfirmBox,
  SegTabs, SegTab, FormGrid, Field, FormSelect, Req, Notice,
} from '../../styles/ui';
import { CargoCell, RouteCell, Weight, DriverTag, NewTag, Owner, CloseBtn } from './styles';
import CloseModal from './CloseModal';

const SRC_ICON = {
  all: Layers, factory: PARTNERS.factory.icon, broker: PARTNERS.broker.icon, company: PARTNERS.company.icon, admin: ShieldCheck,
};

const isFresh = (c) => {
  const ts = c.createdAt || c.date;
  return ts && Date.now() - new Date(ts).getTime() < 36 * 3600 * 1000;
};

// Har bir bo'lim (/yuklar, /yuklar/broker ...) o'z filtrlari bilan alohida ochiladi
export default function Yuklar() {
  const { source } = useParams();
  return <YuklarPage key={source || 'all'} />;
}

function YuklarPage() {
  const data = useData();
  const { cargo, drivers, users, create, update, remove } = data;
  const { canManage } = useAuth();
  const { isVisible, visibleCargo } = useVisibility();
  const navigate = useNavigate();
  const { source: fixedSource } = useParams();
  const [params] = useSearchParams();

  const [tab, setTab] = useState('all');
  const source = fixedSource || tab;
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Kutilmoqda');
  const [owner, setOwner] = useState(params.get('owner') || '');
  const [closing, setClosing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [form, setForm] = useState(EMPTY_CARGO);
  const [meta, setMeta] = useState({ source: 'admin', ownerId: '' });

  // Dispetcher: faqat admin ruxsat bergan manbalar va faqat ochiq yuklar
  const pool = canManage ? cargo : visibleCargo;
  const sources = canManage ? CARGO_SOURCES.map((s) => s.value) : CARGO_SOURCES.map((s) => s.value).filter(isVisible);
  const bySource = useMemo(() => pool.filter((c) => source === 'all' || sourceOf(c) === source), [pool, source]);
  const openOf = (s) => pool.filter((c) => (s === 'all' || sourceOf(c) === s) && c.status === 'Kutilmoqda').length;

  const counts = useMemo(() => {
    const c = { Barchasi: bySource.length };
    CARGO_STATUS.forEach((s) => (c[s] = bySource.filter((x) => x.status === s).length));
    return c;
  }, [bySource]);

  const rows = useMemo(
    () =>
      bySource
        .filter((x) => (canManage ? status === 'Barchasi' || x.status === status : x.status === 'Kutilmoqda'))
        .filter((x) => !owner || (PARTNERS[source] && x[PARTNERS[source].fk] === owner))
        .filter((x) => matches(x, query, ['title', 'from', 'to', 'truckType', 'cargoType', 'phone']))
        .sort((a, b) => (b.createdAt || b.date || '').localeCompare(a.createdAt || a.date || '')),
    [bySource, status, owner, query, source, canManage]
  );

  const byId = (list, id) => list.find((x) => x.id === id);
  const partnerList = (type) => data[PARTNERS[type].collection].map((p) => normalize(type, p));

  /* ---------- Qo'shish / tahrirlash ---------- */
  const openCreate = () => {
    const src = source === 'all' ? 'admin' : source;
    setMeta({ source: src, ownerId: owner });
    setForm({ ...EMPTY_CARGO, loadDate: today() });
    setEditing('new');
  };

  const openEdit = (c) => {
    const src = sourceOf(c);
    setMeta({ source: src, ownerId: PARTNERS[src] ? c[PARTNERS[src].fk] : '' });
    setForm({ ...EMPTY_CARGO, ...c, truckType: c.truckType || '', volume: c.volume || '', cargoType: c.cargoType || '' });
    setEditing(c.id);
  };

  const onSave = () => {
    const links = { source: meta.source, factoryId: '', brokerId: '', companyId: '' };
    if (PARTNERS[meta.source]) links[PARTNERS[meta.source].fk] = meta.ownerId;
    const payload = { ...cargoPayload(form), ...links };
    if (editing === 'new') {
      create('cargo', {
        ...payload, status: 'Kutilmoqda', date: today(), driverId: '', addedBy: 'admin',
        createdAt: new Date().toISOString(),
      });
    } else {
      update('cargo', editing, { ...payload, status: form.status });
    }
    setEditing(null);
  };

  const ownerMissing = PARTNERS[meta.source] && !meta.ownerId;

  const exportCSV = () =>
    downloadCSV(`yuklar-${source}.csv`, [
      [t('Yuk'), t('Yuk turi'), t('Manba'), t('Hamkor'), t('Qayerdan'), t('Qayerga'), t('Tonna'), 'm³', t('Narx'),
        t('Telefon'), t('Mashina turi'), t('Haydovchi'), t('Sana'), t('Holat')],
      ...rows.map((r) => [
        r.title, r.cargoType, sourceLabel(sourceOf(r)), ownerOf(r, data)?.name, r.from, r.to, r.weight, r.volume,
        r.price, r.phone, r.truckType, byId(drivers, r.driverId)?.name, fmtDate(r.date), t(r.status),
      ]),
    ]);

  const pageTitle = fixedSource ? sourceLabel(fixedSource) : canManage ? t('Barcha yuklar') : t('Kelgan yuklar');
  const hiddenNow = canManage && source !== 'all' && !isVisible(source);

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{pageTitle}</PageTitle>
          <PageSub>
            {canManage
              ? t("Zavodlar, brokerlar va logistika kompaniyalari kabinetidan kelgan yuklar. Tahrirlash, o'chirish va yangi yuk qo'shish mumkin.")
              : t('Hamkorlardan kelgan yuklar. «Yopish» tugmasi orqali yukni haydovchiga biriktiring va barcha ma’lumotlarni kiriting.')}
          </PageSub>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {!canManage && <Button $variant="ghost" onClick={() => navigate('/yopilgan')}><PackageCheck /> {t('Yopgan yuklarim')}</Button>}
          <Button $variant="ghost" onClick={exportCSV}><Download /> {t('Eksport')}</Button>
          {canManage && <Button onClick={openCreate}><Plus /> {t("Yuk qo'shish")}</Button>}
        </div>
      </PageHead>

      {!fixedSource && sources.length > 0 && (
        <SegTabs role="tablist">
          {['all', ...sources].map((s) => {
            const Icon = SRC_ICON[s];
            return (
              <SegTab key={s} role="tab" aria-selected={source === s} $active={source === s} onClick={() => { setTab(s); setOwner(''); }}>
                <Icon /> {s === 'all' ? t('Hammasi') : sourceLabel(s)}
                <b title={t('Ochiq yuklar')}>{openOf(s)}</b>
              </SegTab>
            );
          })}
        </SegTabs>
      )}

      {hiddenNow && (
        <Notice><EyeOff /> {t("Bu manba yuklari hozir dispetcherlardan yashirilgan. «Ko'rinish sozlamalari» bo'limida yoqishingiz mumkin.")}</Notice>
      )}

      {canManage && (
        <Chips>
          {['Barchasi', ...CARGO_STATUS].map((s) => (
            <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
              {t(s)} <b>{counts[s]}</b>
            </Chip>
          ))}
        </Chips>
      )}

      <Card $pad={false}>
        <Toolbar>
          <Search>
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Yuk nomi, turi, shahar yoki telefon')} />
          </Search>
          {PARTNERS[source] && (
            <Select value={owner} onChange={(e) => setOwner(e.target.value)}>
              <option value="">{t('Hammasi')}: {t(PARTNERS[source].many)}</option>
              {partnerList(source).map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </Select>
          )}
        </Toolbar>

        {rows.length ? (
          <TableWrap>
            <Table $min="1180px">
              <thead>
                <tr>
                  <th>{t('Yuk')}</th>
                  <th>{t('Kimdan')}</th>
                  <th>{t("Yo'nalish")}</th>
                  <th>{t('Hajm')}</th>
                  <th>{t('Narx')}</th>
                  <th>{t('Kelgan / Haydovchi')}</th>
                  {canManage && <th>{t('Holat')}</th>}
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const driver = byId(drivers, r.driverId);
                  const own = ownerOf(r, data);
                  const src = sourceOf(r);
                  const SrcIcon = SRC_ICON[src] || Layers;
                  const closer = byId(users, r.closedBy);
                  return (
                    <tr key={r.id}>
                      <td>
                        <CargoCell>
                          <strong>{r.title}{r.status === 'Kutilmoqda' && isFresh(r) && <NewTag>{t('YANGI')}</NewTag>}</strong>
                          <small>{[r.cargoType, t(r.truckType)].filter(Boolean).join(' · ') || '—'}{r.note ? ` · ${r.note}` : ''}</small>
                        </CargoCell>
                      </td>
                      <td>
                        <Owner>
                          <strong><SrcIcon size={13} style={{ verticalAlign: -2, marginRight: 5 }} />{own?.name || (src === 'admin' ? t('Admin') : '—')}</strong>
                          <small>{sourceLabel(src)} · {r.phone || own?.phone || ''}</small>
                        </Owner>
                      </td>
                      <td><RouteCell><span>{r.from}</span><i /><span>{r.to}</span></RouteCell></td>
                      <td><Weight>{r.weight || '—'} t{r.volume ? ` · ${r.volume} m³` : ''}</Weight></td>
                      <td><strong>{money(r.price)}</strong></td>
                      <td>
                        {r.status === 'Kutilmoqda' ? (
                          <Muted>{fmtDate(r.date)}{r.loadDate ? ` → ${fmtDate(r.loadDate)}` : ''}</Muted>
                        ) : driver ? (
                          <DriverTag>{driver.name}<small>{driver.plate}{closer ? ` · ${t('yopdi')}: ${closer.name.split(' ')[0]}` : ''}</small></DriverTag>
                        ) : <Muted>—</Muted>}
                      </td>
                      {canManage && <td><Badge $tone={toneOf(r.status)}>{t(r.status)}</Badge></td>}
                      <td>
                        <Actions style={{ alignItems: 'center', gap: 6 }}>
                          {r.status === 'Kutilmoqda' && (
                            <CloseBtn onClick={() => setClosing(r)}><CheckCheck /> {t('Yopish')}</CloseBtn>
                          )}
                          {canManage && (
                            <>
                              <IconButton onClick={() => openEdit(r)} aria-label={t('Tahrirlash')} title={t('Tahrirlash')}><Pencil /></IconButton>
                              <IconButton $danger onClick={() => setDeleteId(r.id)} aria-label={t("O'chirish")} title={t("O'chirish")}><Trash2 /></IconButton>
                            </>
                          )}
                        </Actions>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </TableWrap>
        ) : (
          <Empty>
            <PackageOpen />
            <h4>{t("Hozircha yuk yo'q")}</h4>
            <p>{t("Hamkorlar kabinetidan yuk joylashi bilan shu yerda paydo bo'ladi.")}</p>
          </Empty>
        )}
      </Card>

      {closing && <CloseModal cargoItem={closing} onClose={() => setClosing(null)} />}

      {editing && (
        <CargoForm
          title={editing === 'new' ? t("Yangi yuk qo'shish") : t('Yukni tahrirlash')}
          form={form}
          setForm={setForm}
          onClose={() => setEditing(null)}
          onSubmit={() => !ownerMissing && onSave()}
          submitLabel={editing === 'new' ? t("Qo'shish") : t('Saqlash')}
          showStatus={editing !== 'new'}
          top={(
            <FormGrid style={{ marginBottom: 18 }}>
              <Field><span>{t('Manba')}<Req>*</Req></span>
                <FormSelect value={meta.source} onChange={(e) => setMeta({ source: e.target.value, ownerId: '' })}>
                  {CARGO_SOURCES.map((s) => <option key={s.value} value={s.value}>{t(s.label)}</option>)}
                </FormSelect>
              </Field>
              {PARTNERS[meta.source] ? (
                <Field><span>{t(PARTNERS[meta.source].one)}<Req>*</Req></span>
                  <FormSelect value={meta.ownerId} onChange={(e) => setMeta((m) => ({ ...m, ownerId: e.target.value }))}>
                    <option value="">{t('Tanlang')}</option>
                    {partnerList(meta.source).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </FormSelect>
                </Field>
              ) : (
                <Field><span>{t('Kimdan')}</span><Notice style={{ padding: '10px 12px' }}><PackagePlus /> {t('Adminning o’z yuki')}</Notice></Field>
              )}
            </FormGrid>
          )}
        />
      )}

      {deleteId && (
        <Overlay onMouseDown={() => setDeleteId(null)}>
          <Modal $w="400px" onMouseDown={(e) => e.stopPropagation()}>
            <ConfirmBox>
              <div><Trash2 /></div>
              <h2>{t("Yukni o'chirasizmi?")}</h2>
              <p>{t("Bu yuk ro'yxatdan butunlay o'chiriladi.")}</p>
            </ConfirmBox>
            <ModalFoot style={{ borderTop: 'none', justifyContent: 'center' }}>
              <Button $variant="ghost" onClick={() => setDeleteId(null)}>{t('Bekor qilish')}</Button>
              <Button $variant="danger" onClick={() => { remove('cargo', deleteId); setDeleteId(null); }}>{t("O'chirish")}</Button>
            </ModalFoot>
          </Modal>
        </Overlay>
      )}
    </Page>
  );
}
