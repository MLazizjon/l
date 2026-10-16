import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trophy, Users } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { roleLabel } from '../../data/constants';
import { cargoStats, lastMonths, shortMoney, fmtNumber, initials, money } from '../../utils/helpers';
import { t } from '../../i18n';
import { Page, PageHead, PageTitle, PageSub, Empty, Avatar } from '../../styles/ui';
import { Summary, SumItem, Cards, StaffCard, Top, StatGrid, Progress, Spark, CardFoot } from './styles';

/* Admin va direktor uchun: har bir dispetcher qancha yuk yopgani, aylanma va foyda */
export default function Xodimlar() {
  const { users, cargo } = useData();
  const navigate = useNavigate();

  const list = useMemo(() => {
    const rows = users
      .map((u) => {
        const mine = cargo.filter((c) => c.closedBy === u.id);
        return { ...u, stats: cargoStats(mine), months: lastMonths(mine) };
      })
      // Dispetcherlar + yuk yopgan boshqa xodimlar
      .filter((u) => u.role === 'user' || u.stats.count > 0)
      .sort((a, b) => b.stats.profit - a.stats.profit);
    return rows;
  }, [users, cargo]);

  const leader = list[0]?.stats.profit || 1;
  const total = cargoStats(cargo.filter((c) => c.closedBy));
  const openCount = cargo.filter((c) => c.status === 'Kutilmoqda').length;

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{t("Xodimlar statistikasi")}</PageTitle>
          <PageSub>{t("Har bir dispetcher yopgan yuklar, aylanma va kompaniyaga keltirgan foyda. Kartani bosib, uning yuklarini ko'ring.")}</PageSub>
        </div>
      </PageHead>

      <Summary>
        <SumItem $main><span>{t("Dispetcherlar")}</span><b>{list.length}</b></SumItem>
        <SumItem><span>{t("Jami yopilgan")}</span><b>{total.count}</b></SumItem>
        <SumItem><span>{t("Umumiy aylanma")}</span><b>{shortMoney(total.sum)}</b></SumItem>
        <SumItem><span>{t("Umumiy foyda")}</span><b>{shortMoney(total.profit)}</b></SumItem>
        <SumItem><span>{t("Ochiq yuklar")}</span><b>{openCount}</b></SumItem>
      </Summary>

      {list.length ? (
        <Cards>
          {list.map((u, i) => {
            const maxM = Math.max(...u.months.map((m) => m.count), 1);
            return (
              <StaffCard key={u.id} onClick={() => navigate(`/yopilgan?user=${u.id}`)}>
                <Top>
                  <Avatar $dark={i === 0} $size={46}>{initials(u.name)}</Avatar>
                  <div>
                    <strong>{u.name}</strong>
                    <small>@{u.username} · {roleLabel(u.role)}</small>
                  </div>
                  <span className={i === 0 ? 'place first' : 'place'}>{i === 0 && <Trophy />}#{i + 1}</span>
                </Top>

                <StatGrid>
                  <div><span>{t("Yopgan yuklar")}</span><b>{u.stats.count}</b></div>
                  <div><span>{t("Shu oy")}</span><b>{u.stats.month}</b></div>
                  <div><span>{t("Aylanma")}</span><b>{shortMoney(u.stats.sum)}</b></div>
                  <div><span>{t("Foyda")}</span><b>{shortMoney(u.stats.profit)}</b></div>
                  <div><span>{t("Yo'lda")}</span><b>{u.stats.onRoad}</b></div>
                  <div><span>{t("Masofa")}</span><b>{fmtNumber(u.stats.km)} km</b></div>
                </StatGrid>

                <Progress $w={leader > 0 ? Math.max((u.stats.profit / leader) * 100, 2) : 0} title={money(u.stats.profit)}>
                  <div />
                </Progress>

                <Spark>
                  {u.months.map((m, idx) => (
                    <div key={m.key} title={`${m.label}: ${m.count} ${t('ta')}`}>
                      <i style={{ height: `${Math.max((m.count / maxM) * 100, 6)}%` }} className={idx === u.months.length - 1 ? 'cur' : ''} />
                      <span>{m.label}</span>
                    </div>
                  ))}
                </Spark>

                <CardFoot>{t("Yuklarini ko'rish")} <ArrowRight /></CardFoot>
              </StaffCard>
            );
          })}
        </Cards>
      ) : (
        <Empty><Users /><h4>{t("Dispetcherlar yo'q")}</h4><p>{t("«Foydalanuvchilar» bo'limida Dispetcher rolida xodim qo'shing.")}</p></Empty>
      )}
    </Page>
  );
}
