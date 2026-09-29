import { useMemo, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { money, shortMoney, fmtNumber, downloadCSV } from '../../utils/helpers';
import {
  Page, PageHead, PageTitle, PageSub, Button, Card, CardHead, Select, TableWrap, Table, Muted,
} from '../../styles/ui';
import { Totals, Total, Columns, Share, RouteName } from './styles';

const PERIODS = [
  { value: 'all', label: 'Butun davr' },
  { value: 'month', label: 'Shu oy' },
  { value: 'quarter', label: 'Oxirgi 3 oy' },
  { value: 'year', label: 'Shu yil' },
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
    const label = PERIODS.find((p) => p.value === period).label;
    downloadCSV(`hisobot-${period}.csv`, [
      ['Hisobot davri', label],
      ['Umumiy aylanma', revenue],
      ['Yuklar soni', list.length],
      ['Tonna', tons],
      [],
      ['Broker', 'Bitimlar', 'Aylanma', 'Ulush %', 'Ulush summasi'],
      ...byBroker.map((b) => [b.company, b.count, b.sum, b.commission, Math.round(b.fee)]),
      [],
      ["Yo'nalish", 'Reyslar', 'Tonna', 'Aylanma'],
      ...byRoute.map((r) => [r.route, r.count, r.tons, r.sum]),
      [],
      ['Haydovchi', 'Reyslar', 'Tonna', 'Aylanma'],
      ...byDriver.map((d) => [d.name, d.count, d.tons, d.sum]),
    ]);
  };

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>Hisobot</PageTitle>
          <PageSub>Aylanma, brokerlar ulushi va yo'nalishlar kesimida tahlil. Bekor qilingan yuklar hisobga olinmaydi.</PageSub>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Hisobot davri">
            {PERIODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </Select>
          <Button $variant="ghost" onClick={() => window.print()}><Printer /> Chop etish</Button>
          <Button $variant="dark" onClick={exportReport}><Download /> CSV yuklab olish</Button>
        </div>
      </PageHead>

      <Totals>
        <Total $main>
          <span>Umumiy aylanma</span>
          <b>{shortMoney(revenue)}</b>
          <small>{money(revenue)}</small>
        </Total>
        <Total>
          <span>Yuklar</span>
          <b>{list.length}</b>
          <small>{delivered} tasi yetkazilgan</small>
        </Total>
        <Total>
          <span>Tashilgan hajm</span>
          <b>{fmtNumber(tons)} t</b>
          <small>O'rtacha {list.length ? Math.round(tons / list.length) : 0} t / reys</small>
        </Total>
        <Total>
          <span>Brokerlar ulushi</span>
          <b>{shortMoney(commissionTotal)}</b>
          <small>{cancelled} ta yuk bekor qilingan</small>
        </Total>
      </Totals>

      <Card $pad={false}>
        <CardHead style={{ padding: '18px 20px 0' }}>
          <h3>Brokerlar kesimida</h3>
          <span>{byBroker.length} ta broker</span>
        </CardHead>
        <TableWrap>
          <Table $min="720px">
            <thead>
              <tr>
                <th>Broker</th>
                <th>Bitimlar</th>
                <th>Aylanma</th>
                <th>Aylanmadagi o'rni</th>
                <th>Ulush</th>
                <th style={{ textAlign: 'right' }}>Ulush summasi</th>
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
                  <td style={{ textAlign: 'right' }}><strong>{money(b.fee)}</strong></td>
                </tr>
              ))}
              {!byBroker.length && (
                <tr><td colSpan={6}><Muted>Bu davrda brokerlar orqali yuk bo'lmagan.</Muted></td></tr>
              )}
            </tbody>
          </Table>
        </TableWrap>
      </Card>

      <Columns>
        <Card $pad={false}>
          <CardHead style={{ padding: '18px 20px 0' }}>
            <h3>Top yo'nalishlar</h3>
            <span>Aylanma bo'yicha</span>
          </CardHead>
          <TableWrap>
            <Table $min="440px">
              <thead>
                <tr><th>Yo'nalish</th><th>Reys</th><th>Tonna</th><th style={{ textAlign: 'right' }}>Aylanma</th></tr>
              </thead>
              <tbody>
                {byRoute.map((r) => (
                  <tr key={r.route}>
                    <td><RouteName>{r.route}</RouteName></td>
                    <td>{r.count}</td>
                    <td>{fmtNumber(r.tons)}</td>
                    <td style={{ textAlign: 'right' }}><strong>{shortMoney(r.sum)}</strong></td>
                  </tr>
                ))}
                {!byRoute.length && <tr><td colSpan={4}><Muted>Ma'lumot yo'q</Muted></td></tr>}
              </tbody>
            </Table>
          </TableWrap>
        </Card>

        <Card $pad={false}>
          <CardHead style={{ padding: '18px 20px 0' }}>
            <h3>Haydovchilar kesimida</h3>
            <span>Reyslar va daromad</span>
          </CardHead>
          <TableWrap>
            <Table $min="440px">
              <thead>
                <tr><th>Haydovchi</th><th>Reys</th><th>Tonna</th><th style={{ textAlign: 'right' }}>Aylanma</th></tr>
              </thead>
              <tbody>
                {byDriver.map((d) => (
                  <tr key={d.id}>
                    <td><strong>{d.name}</strong><br /><Muted>{d.plate}</Muted></td>
                    <td>{d.count}</td>
                    <td>{fmtNumber(d.tons)}</td>
                    <td style={{ textAlign: 'right' }}><strong>{shortMoney(d.sum)}</strong></td>
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
