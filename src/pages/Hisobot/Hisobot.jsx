import { useMemo, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { money, shortMoney, fmtNumber, downloadCSV } from '../../utils/helpers';
import { t } from '../../i18n';
import {
  Page, PageHead, PageTitle, PageSub, Button, Card, CardHead, Select, TableWrap, Table, Muted,
} from '../../styles/ui';
import { Totals, Total, Columns, Share, RouteName } from './styles';

const PERIODS = [
  { value: 'all', label: 'Butun davr' },
  { value: 'month', label: t('Shu oy') },
  { value: 'quarter', label: t('Oxirgi 3 oy') },
  { value: 'year', label: t('Shu yil') },
];

const periodStart = (p) => {
  const now = new Date();
  if (p === 'month') return new Date(now.getFullYear(), now.getMonth(), 1);
  if (p === 'quarter') return new Date(now.getFullYear(), now.getMonth() - 2, 1);
  if (p === 'year') return new Date(now.getFullYear(), 0, 1);
  return null;
};

const groupBy = (list, keyFn) =>
  list.reduce((acc, item) => {
    const k = keyFn(item);
    if (!k) return acc;
    acc[k] = acc[k] || { count: 0, sum: 0, tons: 0 };
    acc[k].count += 1;
    acc[k].sum += Number(item.price) || 0;
    acc[k].tons += Number(item.weight) || 0;
    return acc;
  }, {});

export default function Hisobot() {
  const { cargo, brokers, drivers } = useData();
  const [period, setPeriod] = useState('all');

  const list = useMemo(() => {
    const start = periodStart(period);
    return cargo.filter((c) => c.status !== 'Bekor qilindi' && (!start || new Date(c.date) >= start));
  }, [cargo, period]);

  const cancelled = cargo.filter((c) => c.status === 'Bekor qilindi').length;
  const revenue = list.reduce((s, c) => s + (Number(c.price) || 0), 0);
  const tons = list.reduce((s, c) => s + (Number(c.weight) || 0), 0);
  const delivered = list.filter((c) => c.status === 'Yetkazildi').length;

  const byBroker = useMemo(() => {
    const g = groupBy(list, (c) => c.brokerId);
    return brokers
      .map((b) => {
        const v = g[b.id] || { count: 0, sum: 0 };
        return { ...b, ...v, fee: (v.sum * (Number(b.commission) || 0)) / 100 };
      })
      .filter((b) => b.count)
      .sort((a, b) => b.sum - a.sum);
  }, [list, brokers]);

  const commissionTotal = byBroker.reduce((s, b) => s + b.fee, 0);

  const byRoute = useMemo(() => {
    const g = groupBy(list, (c) => `${c.from} → ${c.to}`);
    return Object.entries(g)
      .map(([route, v]) => ({ route, ...v }))
      .sort((a, b) => b.sum - a.sum)
      .slice(0, 6);
  }, [list]);

  const byDriver = useMemo(() => {
    const g = groupBy(list, (c) => c.driverId);
    return drivers
      .map((d) => ({ ...d, ...(g[d.id] || { count: 0, sum: 0, tons: 0 }) }))
      .sort((a, b) => b.sum - a.sum);
  }, [list, drivers]);

  const exportReport = () => {
    const label = t(PERIODS.find((p) => p.value === period).label);
    downloadCSV(`hisobot-${period}.csv`, [
      [t('Hisobot davri'), label],
      [t('Umumiy aylanma'), revenue],
      [t('Yuklar soni'), list.length],
      [t('Tonna'), tons],
      [],
      ['Broker', 'Bitimlar', 'Aylanma', 'Ulush %', 'Ulush summasi'].map((h) => t(h)),
      ...byBroker.map((b) => [b.company, b.count, b.sum, b.commission, Math.round(b.fee)]),
      [],
      ["Yo'nalish", 'Reyslar', 'Tonna', 'Aylanma'].map((h) => t(h)),
      ...byRoute.map((r) => [r.route, r.count, r.tons, r.sum]),
      [],
      ['Haydovchi', 'Reyslar', 'Tonna', 'Aylanma'].map((h) => t(h)),
      ...byDriver.map((d) => [d.name, d.count, d.tons, d.sum]),
    ]);
  };

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{t("Hisobot")}</PageTitle>
          <PageSub>{t("Aylanma, brokerlar ulushi va yo'nalishlar kesimida tahlil. Bekor qilingan yuklar hisobga olinmaydi.")}</PageSub>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: t('wrap') }}>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label={t("Hisobot davri")}>
            {PERIODS.map((p) => <option key={p.value} value={p.value}>{t(p.label)}</option>)}
          </Select>
          <Button $variant="ghost" onClick={() => window.print()}><Printer /> {t("Chop etish")}</Button>
          <Button $variant="dark" onClick={exportReport}><Download /> {t("CSV yuklab olish")}</Button>
        </div>
      </PageHead>

      <Totals>
        <Total $main>
          <span>{t("Umumiy aylanma")}</span>
          <b>{shortMoney(revenue)}</b>
          <small>{money(revenue)}</small>
        </Total>
        <Total>
          <span>{t("Yuklar")}</span>
          <b>{list.length}</b>
          <small>{delivered} {t('tasi yetkazilgan')}</small>
        </Total>
        <Total>
          <span>{t("Tashilgan hajm")}</span>
          <b>{fmtNumber(tons)} t</b>
          <small>{t("O'rtacha")} {list.length ? Math.round(tons / list.length) : 0} t / {t('reys')}</small>
        </Total>
        <Total>
          <span>{t("Brokerlar ulushi")}</span>
          <b>{shortMoney(commissionTotal)}</b>
          <small>{cancelled} {t('ta yuk bekor qilingan')}</small>
        </Total>
      </Totals>

      <Card $pad={false}>
        <CardHead style={{ padding: t('18px 20px 0') }}>
          <h3>{t("Brokerlar kesimida")}</h3>
          <span>{byBroker.length} {t('ta broker')}</span>
        </CardHead>
        <TableWrap>
          <Table $min="720px">
            <thead>
              <tr>
                <th>{t("Broker")}</th>
                <th>{t("Bitimlar")}</th>
                <th>{t("Aylanma")}</th>
                <th>{t("Aylanmadagi o'rni")}</th>
                <th>{t("Ulush")}</th>
                <th style={{ textAlign: t('right') }}>{t("Ulush summasi")}</th>
              </tr>
            </thead>
            <tbody>
              {byBroker.map((b) => (
                <tr key={b.id}>
                  <td><strong>{b.company}</strong><br /><Muted>{b.name}</Muted></td>
                  <td>{b.count}</td>
                  <td><strong>{money(b.sum)}</strong></td>
                  <td>
                    <Share $w={revenue ? (b.sum / revenue) * 100 : 0}>
                      <div><i /></div>
                      <span>{revenue ? Math.round((b.sum / revenue) * 100) : 0}%</span>
                    </Share>
                  </td>
                  <td>{b.commission}%</td>
                  <td style={{ textAlign: t('right') }}><strong>{money(b.fee)}</strong></td>
                </tr>
              ))}
              {!byBroker.length && (
                <tr><td colSpan={6}><Muted>{t("Bu davrda brokerlar orqali yuk bo'lmagan.")}</Muted></td></tr>
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <Columns>
        <Card $pad={false}>
          <CardHead style={{ padding: t('18px 20px 0') }}>
            <h3>{t("Top yo'nalishlar")}</h3>
            <span>{t("Aylanma bo'yicha")}</span>
          </CardHead>
          <TableWrap>
            <Table $min="440px">
              <thead>
                <tr><th>{t("Yo'nalish")}</th><th>{t("Reys")}</th><th>{t("Tonna")}</th><th style={{ textAlign: t('right') }}>{t("Aylanma")}</th></tr>
              </thead>
              <tbody>
                {byRoute.map((r) => (
                  <tr key={r.route}>
                    <td><RouteName>{r.route}</RouteName></td>
                    <td>{r.count}</td>
                    <td>{fmtNumber(r.tons)}</td>
                    <td style={{ textAlign: t('right') }}><strong>{shortMoney(r.sum)}</strong></td>
                  </tr>
                ))}
                {!byRoute.length && <tr><td colSpan={4}><Muted>{t("Ma'lumot yo'q")}</Muted></td></tr>}
              </tbody>
            </Table>
          </TableWrap>
        </Card>

        <Card $pad={false}>
          <CardHead style={{ padding: t('18px 20px 0') }}>
            <h3>{t("Haydovchilar kesimida")}</h3>
            <span>{t("Reyslar va daromad")}</span>
          </CardHead>
          <TableWrap>
            <Table $min="440px">
              <thead>
                <tr><th>{t("Haydovchi")}</th><th>{t("Reys")}</th><th>{t("Tonna")}</th><th style={{ textAlign: t('right') }}>{t("Aylanma")}</th></tr>
              </thead>
              <tbody>
                {byDriver.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong><br /><Muted>{d.plate}</Muted></td>
                    <td>{d.count}</td>
                    <td>{fmtNumber(d.tons)}</td>
                    <td style={{ textAlign: t('right') }}><strong>{shortMoney(d.sum)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        </Card>
      </Columns>
    </Page>
  );
}
