import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon, Eye, CircleCheck, X, PackageCheck, Phone, Truck, Route as RouteIcon,
  Wallet, UserRound, Factory, Handshake, Download,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { sourceOf, sourceLabel, toneOf, CARGO_SOURCES } from '../../data/constants';
import { ownerOf } from '../../data/partners';
import {
  money, fmtDate, fmtDateTime, matches, shortMoney, fmtNumber, profitOf, cargoStats, initials, today,
  downloadCSV,
} from '../../utils/helpers';
import { t } from '../../i18n';
import {
  Page, PageHead, PageTitle, PageSub, Button, IconButton, Card, Chips, Chip, Toolbar, Search, Select,
  TableWrap, Table, Badge, Actions, Empty, Muted, Overlay, Modal, ModalHead, ModalBody, ModalFoot,
  Avatar,
} from '../../styles/ui';
import { Strip, StripItem, Two, Money, Detail, DSection, DRow } from './styles';

const STATUSES = ['Barchasi', "Yo'lda", 'Yetkazildi'];

export default function Yopilgan() {
  const { cargo, drivers, users, update } = useData();
  const { user, canManage: isAdmin, canSeeAll } = useAuth();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('Barchasi');
  const [source, setSource] = useState('');
  const [openId, setOpenId] = useState(null);

  const staffFilter = params.get('user') || '';
  const setStaffFilter = (v) => setParams(v ? { user: v } : {});

  const byId = (list, id) => list.find((x) => x.id === id);

  // Dispetcher faqat o'zi yopgan yuklarni ko'radi, admin va direktor — hammanikini
  const base = useMemo(
    () =>
      cargo
        .filter((c) => c.closedBy)
        .filter((c) => (canSeeAll ? !staffFilter || c.closedBy === staffFilter : c.closedBy === user.id)),
    [cargo, canSeeAll, staffFilter, user.id]
  );

  const rows = useMemo(
    () =>
      base
        .filter((c) => status === 'Barchasi' || c.status === status)
        .filter((c) => !source || sourceOf(c) === source)
        .filter((c) => matches(c, query, ['title', 'from', 'to']) ||
          matches(byId(drivers, c.driverId) || {}, query, ['name', 'plate', 'phone']))
        .sort((a, b) => (b.closedAt || '').localeCompare(a.closedAt || '')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [base, status, source, query, drivers]
  );

  const stats = cargoStats(rows);
  const staff = users.filter((u) => cargo.some((c) => c.closedBy === u.id) || u.role === 'user');
  const openItem = byId(cargo, openId);

  const canDeliver = (c) => c.status === "Yo'lda" && (isAdmin || c.closedBy === user.id);
  const markDelivered = (c) => {
    update('cargo', c.id, { status: 'Yetkazildi', deliveredAt: today() });
    // Haydovchining boshqa faol reysi bo'lmasa — u yana bo'sh
    const busy = cargo.some((x) => x.id !== c.id && x.driverId === c.driverId && x.status === "Yo'lda");
    if (c.driverId && !busy) update('drivers', c.driverId, { status: t('Faol') });
  };

  const data = useData();
  const ownerName = (c) => ownerOf(c, data)?.name || (sourceOf(c) === 'admin' ? t('Admin') : '');

  const exportCSV = () =>
    downloadCSV('yopilgan-yuklar.csv', [
      ['Yuk', 'Manba', 'Qayerdan', 'Qayerga', 'Km', 'Haydovchi', 'Telefon', 'Mashina', 'Raqam', 'Yuklash', 'Yetib borish',
        'Narx', 'Haydovchiga', 'Foyda', 'Yopgan xodim', 'Yopilgan vaqt', 'Holat'].map((h) => t(h)),
      ...rows.map((c) => {
        const d = byId(drivers, c.driverId) || {};
        return [c.title, ownerName(c), c.from, c.to, c.trip?.distance, d.name, d.phone, d.truck, d.plate,
          fmtDate(c.trip?.loadDate), fmtDate(c.trip?.eta), c.price, c.trip?.driverPay, profitOf(c),
          byId(users, c.closedBy)?.name, fmtDateTime(c.closedAt), c.status];
      }),
    ]);

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{canSeeAll ? t('Yopilgan yuklar') : t('Yopgan yuklarim')}</PageTitle>
          <PageSub>
            {canSeeAll
              ? "Dispetcherlar haydovchiga biriktirgan barcha yuklar: yo'l, haydovchi va to'lov ma'lumotlari."
              : "Siz haydovchiga biriktirgan yuklar: yo'l, haydovchi va to'lov ma'lumotlari."}
          </PageSub>
        </div>
        <Button $variant="ghost" onClick={exportCSV}><Download /> {t("Eksport")}</Button>
      </PageHead>

      <Strip>
        <StripItem $main><span>{t("Yopilgan yuklar")}</span><b>{stats.count}</b></StripItem>
        <StripItem><span>{t("Aylanma")}</span><b>{shortMoney(stats.sum)}</b></StripItem>
        <StripItem><span>{t("Foyda")}</span><b>{shortMoney(stats.profit)}</b></StripItem>
        <StripItem><span>{t("Yo'lda / yetkazildi")}</span><b>{stats.onRoad} / {stats.delivered}</b></StripItem>
        <StripItem><span>{t("Bosib o'tilgan yo'l")}</span><b>{fmtNumber(stats.km)} km</b></StripItem>
      </Strip>

      <Chips>
        {STATUSES.map((s) => (
          <Chip key={s} $active={status === s} onClick={() => setStatus(s)}>
            {t(s)} <b>{s === 'Barchasi' ? base.length : base.filter((c) => c.status === s).length}</b>
          </Chip>
        ))}
      </Chips>

      <Card $pad={false}>
        <Toolbar>
          <Search>
            <SearchIcon />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("Yuk, shahar, haydovchi yoki mashina raqami")} />
          </Search>
          <Select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">{t('Barcha manbalar')}</option>
            {CARGO_SOURCES.map((x) => <option key={x.value} value={x.value}>{t(x.label)}</option>)}
          </Select>
          {canSeeAll && (
            <Select value={staffFilter} onChange={(e) => setStaffFilter(e.target.value)}>
              <option value="">{t("Barcha xodimlar")}</option>
              {staff.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </Select>
          )}
        </Toolbar>

        {rows.length ? (
          <TableWrap>
            <Table $min={canSeeAll ? t('1160px') : t('980px')}>
              <thead>
                <tr>
                  <th>{t("Yuk")}</th>
                  <th>{t("Yo'l")}</th>
                  <th>{t("Haydovchi")}</th>
                  <th>{t("Sanalar")}</th>
                  <th>{t("To'lov")}</th>
                  {canSeeAll && <th>{t("Yopgan xodim")}</th>}
                  <th>{t("Holat")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => {
                  const d = byId(drivers, c.driverId);
                  const closer = byId(users, c.closedBy);
                  return (
                    <tr key={c.id}>
                      <td>
                        <Two>
                          <strong>{c.title}</strong>
                          <small>{sourceOf(c) === 'broker' ? <Handshake /> : <Factory />}{ownerName(c) || '—'}</small>
                        </Two>
                      </td>
                      <td>
                        <Two>
                          <strong>{c.from} → {c.to}</strong>
                          <small>{c.trip?.distance ? `${fmtNumber(c.trip.distance)} km · ` : ''}{c.weight} t</small>
                        </Two>
                      </td>
                      <td>
                        {d ? (
                          <Two>
                            <strong>{d.name}</strong>
                            <small>{d.plate}</small>
                          </Two>
                        ) : <Muted>—</Muted>}
                      </td>
                      <td>
                        <Two>
                          <strong>{fmtDate(c.trip?.loadDate)}</strong>
                          <small>{c.status === 'Yetkazildi' ? `yetkazildi ${fmtDate(c.deliveredAt || c.trip?.eta)}` : c.trip?.eta ? `yetib borish ${fmtDate(c.trip.eta)}` : t("yo'lda")}</small>
                        </Two>
                      </td>
                      <td>
                        <Money>
                          <strong>{money(c.price)}</strong>
                          <small>{t("foyda")} <b>{shortMoney(profitOf(c))}</b></small>
                        </Money>
                      </td>
                      {canSeeAll && (
                        <td>
                          {closer ? (
                            <Two><strong>{closer.name}</strong><small>{fmtDateTime(c.closedAt)}</small></Two>
                          ) : <Muted>—</Muted>}
                        </td>
                      )}
                      <td><Badge $tone={toneOf(c.status)}>{t(c.status)}</Badge></td>
                      <td>
                        <Actions>
                          {canDeliver(c) && (
                            <IconButton onClick={() => markDelivered(c)} title={t("Yetkazildi deb belgilash")} aria-label={t("Yetkazildi")}>
                              <CircleCheck />
                            </IconButton>
                          )}
                          <IconButton onClick={() => setOpenId(c.id)} title={t("Batafsil")} aria-label={t("Batafsil")}><Eye /></IconButton>
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
            <PackageCheck />
            <h4>{t("Yopilgan yuk yo'q")}</h4>
            <p>{t("«Kelgan yuklar» bo'limida yukni yopsangiz, u shu yerda paydo bo'ladi.")}</p>
          </Empty>
        )}
      </Card>

      {openItem && (() => {
        const d = byId(drivers, openItem.driverId);
        const closer = byId(users, openItem.closedBy);
        return (
          <Overlay onMouseDown={() => setOpenId(null)}>
            <Modal $w="620px" onMouseDown={(e) => e.stopPropagation()}>
              <ModalHead>
                <div>
                  <h2>{openItem.title}</h2>
                  <p>{openItem.from} → {openItem.to} · <Badge $tone={toneOf(openItem.status)}>{t(openItem.status)}</Badge></p>
                </div>
                <IconButton type="button" onClick={() => setOpenId(null)} aria-label={t("Yopish")}><X /></IconButton>
              </ModalHead>
              <ModalBody>
                <Detail>
                  <DSection>
                    <h4><Factory /> {t('Yuk manbasi')}</h4>
                    <DRow><span>{t('Manba')}</span><b>{sourceLabel(sourceOf(openItem))}</b></DRow>
                    <DRow><span>{t('Hamkor')}</span><b>{ownerName(openItem) || '—'}{openItem.phone ? ` · ${openItem.phone}` : ''}</b></DRow>
                    {openItem.cargoType && <DRow><span>{t('Yuk turi')}</span><b>{openItem.cargoType}</b></DRow>}
                    <DRow><span>{t("Og'irlik / mashina")}</span><b>{openItem.weight} t{openItem.volume ? ` · ${openItem.volume} m³` : ''} · {t(openItem.truckType) || '—'}</b></DRow>
                    {openItem.note && <DRow><span>{t("Izoh")}</span><b>{openItem.note}</b></DRow>}
                  </DSection>

                  <DSection>
                    <h4><RouteIcon /> {t("Yo'l ma'lumotlari")}</h4>
                    <DRow><span>{t("Yo'nalish")}</span><b>{openItem.from} → {openItem.to}</b></DRow>
                    <DRow><span>{t("Masofa")}</span><b>{openItem.trip?.distance ? `${fmtNumber(openItem.trip.distance)} km` : '—'}</b></DRow>
                    <DRow><span>{t("Yuklash sanasi")}</span><b>{fmtDate(openItem.trip?.loadDate)}</b></DRow>
                    <DRow><span>{t("Yetib borish")}</span><b>{fmtDate(openItem.trip?.eta)}</b></DRow>
                    {openItem.deliveredAt && <DRow><span>{t("Yetkazildi")}</span><b>{fmtDate(openItem.deliveredAt)}</b></DRow>}
                    {openItem.trip?.note && <DRow><span>{t("Izoh")}</span><b>{openItem.trip.note}</b></DRow>}
                  </DSection>

                  <DSection>
                    <h4><Truck /> {t("Haydovchi (shofyor)")}</h4>
                    {d ? (
                      <div className="driver">
                        <Avatar $dark $size={44}>{initials(d.name)}</Avatar>
                        <div>
                          <strong>{d.name}</strong>
                          <span>{d.truck} · {d.plate}</span>
                          <a href={`tel:${d.phone.replace(/\s/g, '')}`}><Phone />{d.phone}</a>
                        </div>
                        <small>{d.city}<br />{d.experience} {t('yil tajriba')}</small>
                      </div>
                    ) : <Muted>{t("Haydovchi o'chirilgan")}</Muted>}
                  </DSection>

                  <DSection>
                    <h4><Wallet /> {t("To'lov")}</h4>
                    <DRow><span>{t("Mijoz to'lovi")}</span><b>{money(openItem.price)}</b></DRow>
                    <DRow><span>{t("Haydovchiga")}</span><b>{money(openItem.trip?.driverPay)}</b></DRow>
                    <DRow $strong><span>{t("Foyda")}</span><b>{money(profitOf(openItem))}</b></DRow>
                  </DSection>

                  <DSection>
                    <h4><UserRound /> {t("Yopgan xodim")}</h4>
                    <DRow><span>{t("Dispetcher")}</span><b>{closer?.name || '—'}</b></DRow>
                    <DRow><span>{t("Vaqt")}</span><b>{fmtDateTime(openItem.closedAt)}</b></DRow>
                  </DSection>
                </Detail>
              </ModalBody>
              <ModalFoot>
                {canDeliver(openItem) && (
                  <Button $variant="dark" onClick={() => markDelivered(openItem)}><CircleCheck /> {t("Yetkazildi")}</Button>
                )}
                <Button $variant="ghost" onClick={() => setOpenId(null)}>{t("Yopish")}</Button>
              </ModalFoot>
            </Modal>
          </Overlay>
        );
      })()}
    </Page>
  );
}
