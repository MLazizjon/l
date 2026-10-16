import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import useVisibility from '../../hooks/useVisibility';
import { useData } from '../../context/DataContext';
import { CARGO_SOURCES, sourceOf } from '../../data/constants';
import { PARTNERS } from '../../data/partners';
import { t } from '../../i18n';
import { Page, PageHead, PageTitle, PageSub, Button, Toggle, Notice } from '../../styles/ui';
import { Grid, SourceCard } from './styles';

const ICON = { ...Object.fromEntries(Object.entries(PARTNERS).map(([k, v]) => [k, v.icon])), admin: ShieldCheck };

/* Admin bir bosishda zavod, broker, kompaniya yoki admin yuklarini dispetcherlardan yashiradi */
export default function Korinish() {
  const { isVisible, setVisible } = useVisibility();
  const { cargo } = useData();
  const all = CARGO_SOURCES.map((s) => s.value);
  const hiddenCount = all.filter((s) => !isVisible(s)).length;

  const setAll = (on) => setVisible(Object.fromEntries(all.map((s) => [s, on])));

  return (
    <Page>
      <PageHead>
        <div>
          <PageTitle>{t("Ko'rinish sozlamalari")}</PageTitle>
          <PageSub>{t("Qaysi hamkorlar yuklari dispetcherlarga (foydalanuvchilarga) ko'rinishini boshqaring. O'zgarish hamma kompyuterda darhol kuchga kiradi.")}</PageSub>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button $variant="ghost" onClick={() => setAll(false)}><EyeOff /> {t('Hammasini yashirish')}</Button>
          <Button onClick={() => setAll(true)}><Eye /> {t("Hammasini ko'rsatish")}</Button>
        </div>
      </PageHead>

      {hiddenCount > 0 && (
        <Notice $tone="danger"><EyeOff /> {t('{n} ta manba yuklari hozir dispetcherlardan yashirilgan.', { n: hiddenCount })}</Notice>
      )}

      <Grid>
        {CARGO_SOURCES.map((s) => {
          const Icon = ICON[s.value];
          const on = isVisible(s.value);
          const open = cargo.filter((c) => sourceOf(c) === s.value && c.status === 'Kutilmoqda').length;
          return (
            <SourceCard key={s.value} $on={on}>
              <div className="ico"><Icon /></div>
              <div className="txt">
                <strong>{t(s.label)}</strong>
                <span>{on ? t("Dispetcherlarga ko'rinadi") : t('Dispetcherlardan yashirilgan')}</span>
                <small>{t('{n} ta ochiq yuk', { n: open })}</small>
              </div>
              <Toggle
                type="button"
                role="switch"
                aria-checked={on}
                $on={on}
                onClick={() => setVisible({ [s.value]: !on })}
                aria-label={t(s.label)}
              />
            </SourceCard>
          );
        })}
      </Grid>
    </Page>
  );
}
