import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowUpRight, ArrowDownRight, Truck } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CARGO_STATUS, toneOf } from '../../data/constants';
import { MONTHS, shortMoney, money, initials } from '../../utils/helpers';
import { Page, Button, Card, CardHead, Badge, Avatar, Empty } from '../../styles/ui';
import {
  Hero, Kpis, Kpi, Grid, Chart, Bar, StatusStack, StatusLegend, Trips, Trip, TripRoute,
  DriverList, DriverRow, BrokerRow, Delta,
} from './styles';

const monthKey = (d) => d.slice(0, 7);

export default function Dashboard() {
  const { cargo, drivers, brokers } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const now = new Date();
  const hour = now.getHours();
  const greet = hour < 12 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech';

  const months = useMemo(() => {
    const list = [];
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const items = cargo.filter((c) => monthKey(c.date) === key && c.status !== 'Bekor qilindi');
      list.push({
        key,
        label: MONTHS[d.getMonth()],
        sum: items.reduce((s, c) => s + (Number(c.price) || 0), 0),
        count: items.length,
      });
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargo]);

  const thisMonth = months[5];
  const prevMonth = months[4];
  const growth = prevMonth.sum ? Math.round(((thisMonth.sum - prevMonth.sum) / prevMonth.sum) * 100) : 0;
  const maxSum = Math.max(...months.map((m) => m.sum), 1);

  const onRoad = cargo.filter((c) => c.status === "Yo'lda");
  const waiting = cargo.filter((c) => c.status === 'Kutilmoqda');
  const freeDrivers = drivers.filter((d) => d.status === 'Faol');

  const statusCounts = CARGO_STATUS.map((s) => ({ s, n: cargo.filter((c) => c.status === s).length }));

  const topBrokers = useMemo(
    () =>
      brokers
        .map((b) => ({
          ...b,
          sum: cargo
            .filter((c) => c.brokerId === b.id && c.status !== 'Bekor qilindi')
            .reduce((s, c) => s + (Number(c.price) || 0), 0),
        }))
        .sort((a, b) => b.sum - a.sum)
        .slice(0, 4),
    [brokers, cargo]
  );

  const driverOf = (id) => drivers.find((d) => d.id === id);

  return (
    <Page>
      <Hero>
        <div>
          <h1>{greet}, {user?.name?.split(' ')[0]}</h1>
          <p>
            Hozir {onRoad.length} ta yuk yo'lda, {waiting.length} tasi haydovchi kutmoqda.
          </p>
        </div>
        <Button $size="lg" onClick={() => navigate('/yuklar')}><Plus /> Yuklarni boshqarish</Button>
      </Hero>

      <Kpis>
        <Kpi $main>
          <span>{MONTHS[now.getMonth()]} oyi daromadi</span>
          <b>{shortMoney(thisMonth.sum)}</b>
          <Delta $up={growth >= 0}>
            {growth >= 0 ? <ArrowUpRight /> : <ArrowDownRight />}
            {Math.abs(growth)}% o'tgan oyga nisbatan
          </Delta>
        </Kpi>
        <Kpi>
          <span>Yo'ldagi yuklar</span>
          <b>{onRoad.length}</b>
          <small>{onRoad.reduce((s, c) => s + (Number(c.weight) || 0), 0)} tonna tashilmoqda</small>
        </Kpi>
        <Kpi>
          <span>Bo'sh haydovchilar</span>
          <b>{freeDrivers.length}<i>/ {drivers.length}</i></b>
          <small>Yangi reysga tayyor</small>
        </Kpi>
        <Kpi>
          <span>Haydovchi kutayotgan</span>
          <b>{waiting.length}</b>
          <small>{shortMoney(waiting.reduce((s, c) => s + (Number(c.price) || 0), 0))} so'mlik yuk</small>
        </Kpi>
      </Kpis>

      <Grid>
        <Card className="chart">
          <CardHead>
            <h3>Daromad, oxirgi 6 oy</h3>
            <span>Bekor qilinganlarsiz</span>
          </CardHead>
          <Chart>
            {months.map((m, i) => (
              <Bar key={m.key} $h={(m.sum / maxSum) * 100} $current={i === 5} title={money(m.sum)}>
                <em>{shortMoney(m.sum)}</em>
                <div />
                <span>{m.label}</span>
              </Bar>
            ))}
          </Chart>
        </Card>

        <Card className="status">
          <CardHead>
            <h3>Yuklar holati</h3>
            <span>Jami {cargo.length}</span>
          </CardHead>
          <StatusStack>
            {statusCounts.map(({ s, n }) =>
              n ? <div key={s} className={toneOf(s)} style={{ flexGrow: n }} title={`${s}: ${n}`} /> : null
            )}
          </StatusStack>
          <StatusLegend>
            {statusCounts.map(({ s, n }) => (
              <li key={s}>
                <Badge $tone={toneOf(s)}>{s}</Badge>
                <b>{n}</b>
              </li>
            ))}
          </StatusLegend>
        </Card>

        <Card className="trips">
          <CardHead>
            <h3>Hozir yo'lda</h3>
            <span>{onRoad.length} ta reys</span>
          </CardHead>
          {onRoad.length ? (
            <Trips>
              {onRoad.map((c) => {
                const d = driverOf(c.driverId);
                return (
                  <Trip key={c.id}>
                    <div className="top">
                      <strong>{c.title}</strong>
                      <span>{money(c.price)}</span>
                    </div>
                    <TripRoute>
                      <span>{c.from}</span>
                      <div><i><Truck /></i></div>
                      <span>{c.to}</span>
                    </TripRoute>
                    <small>{d ? `${d.name}, ${d.plate}` : 'Haydovchi biriktirilmagan'}</small>
                  </Trip>
                );
              })}
            </Trips>
          ) : (
            <Empty style={{ padding: 30 }}><h4>Yo'lda yuk yo'q</h4></Empty>
          )}
        </Card>

        <Card className="drivers">
          <CardHead>
            <h3>Haydovchilar</h3>
            <span>Holat bo'yicha</span>
          </CardHead>
          <DriverList>
            {drivers.slice(0, 6).map((d) => (
              <DriverRow key={d.id}>
                <Avatar $size={34}>{initials(d.name)}</Avatar>
                <div>
                  <strong>{d.name}</strong>
                  <small>{d.truck}</small>
                </div>
                <Badge $tone={toneOf(d.status)}>{d.status}</Badge>
              </DriverRow>
            ))}
          </DriverList>
        </Card>

        <Card className="brokers">
          <CardHead>
            <h3>Top brokerlar</h3>
            <span>Aylanma</span>
          </CardHead>
          {topBrokers.map((b, i) => (
            <BrokerRow key={b.id} $w={topBrokers[0].sum ? (b.sum / topBrokers[0].sum) * 100 : 0} $first={i === 0}>
              <div className="label">
                <strong>{b.company}</strong>
                <span>{shortMoney(b.sum)}</span>
              </div>
              <div className="track"><div /></div>
            </BrokerRow>
          ))}
        </Card>
      </Grid>
    </Page>
  );
}
