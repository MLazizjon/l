import { Truck, ChevronsLeft, LogOut } from 'lucide-react';
import { NAV, canSee, itemLabel } from '../../data/navigation';
import { roleLabel, sourceOf } from '../../data/constants';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import useVisibility from '../../hooks/useVisibility';
import { initials } from '../../utils/helpers';
import { t } from '../../i18n';
import {
  Aside, Brand, Logo, BrandText, Nav, Section, SectionTitle, Item,
  Footer, UserCard, UserInfo, CollapseBtn, LogoutBtn, Count,
} from './styles';

export default function Sidebar({ collapsed, onToggle, mobileOpen }) {
  const { user, role, canManage, logout } = useAuth();
  const { cargo } = useData();
  const { visibleCargo, isVisible } = useVisibility();
  // Dispetcher faqat ko'rinadigan manbalarni sanaydi
  const open = (canManage ? cargo : visibleCargo).filter((c) => c.status === 'Kutilmoqda');

  const badgeOf = (badge) => {
    if (!badge) return 0;
    if (badge === 'open') return open.length;
    const src = badge.split(':')[1];
    return open.filter((c) => sourceOf(c) === src).length;
  };

  return (
    <Aside $collapsed={collapsed} $mobileOpen={mobileOpen}>
      <Brand>
        <Logo><Truck /></Logo>
        {!collapsed && (
          <BrandText>
            <strong>YukCRM</strong>
            <span>{t('Logistika boshqaruvi')}</span>
          </BrandText>
        )}
      </Brand>

      <Nav>
        {NAV.filter((s) => canSee(s, role)).map((section) => {
          const items = section.items.filter((i) => canSee(i, role) && (canManage || !i.source || isVisible(i.source)));
          if (!items.length) return null;
          return (
            <Section key={section.section}>
              <SectionTitle $collapsed={collapsed}>{t(section.section)}</SectionTitle>
              {items.map((item) => {
                const { path, icon: Icon, badge, end } = item;
                const label = t(itemLabel(item, role));
                const n = badgeOf(badge);
                return (
                  <Item key={path} to={path} end={end} $collapsed={collapsed} title={collapsed ? label : undefined}>
                    <Icon />
                    {!collapsed && <span>{label}</span>}
                    {n > 0 && <Count $collapsed={collapsed}>{n}</Count>}
                  </Item>
                );
              })}
            </Section>
          );
        })}
      </Nav>

      <Footer>
        <UserCard $collapsed={collapsed}>
          <span className="avatar">{initials(user?.name)}</span>
          {!collapsed && (
            <UserInfo>
              <strong>{user?.name}</strong>
              <span>{roleLabel(role)}</span>
            </UserInfo>
          )}
          {!collapsed && (
            <LogoutBtn onClick={logout} title={t('Chiqish')} aria-label={t('Chiqish')}>
              <LogOut />
            </LogoutBtn>
          )}
        </UserCard>
        <CollapseBtn onClick={onToggle} $collapsed={collapsed} aria-label={t("Menyuni yig'ish")}>
          <ChevronsLeft />
          {!collapsed && <span>{t("Yig'ish")}</span>}
        </CollapseBtn>
      </Footer>
    </Aside>
  );
}
