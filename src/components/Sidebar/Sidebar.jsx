import { Truck, ChevronsLeft, LogOut } from 'lucide-react';
import { NAV } from '../../data/navigation';
import { useAuth } from '../../context/AuthContext';
import { initials } from '../../utils/helpers';
import {
  Aside, Brand, Logo, BrandText, Nav, Section, SectionTitle, Item,
  Footer, UserCard, UserInfo, CollapseBtn, LogoutBtn,
} from './styles';

export default function Sidebar({ collapsed, onToggle, mobileOpen }) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <Aside $collapsed={collapsed} $mobileOpen={mobileOpen}>
      <Brand>
        <Logo><Truck /></Logo>
        {!collapsed && (
          <BrandText>
            <strong>YukCRM</strong>
            <span>Logistika boshqaruvi</span>
          </BrandText>
        )}
      </Brand>

      <Nav>
        {NAV.map((section) => {
          const items = section.items.filter((i) => !i.adminOnly || isAdmin);
          if (!items.length) return null;
          return (
            <Section key={section.section}>
              <SectionTitle $collapsed={collapsed}>{section.section}</SectionTitle>
              {items.map(({ path, label, icon: Icon }) => (
                <Item key={path} to={path} $collapsed={collapsed} title={collapsed ? label : undefined}>
                  <Icon />
                  {!collapsed && <span>{label}</span>}
                </Item>
              ))}
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
              <span>{isAdmin ? 'Administrator' : 'Foydalanuvchi'}</span>
            </UserInfo>
          )}
          {!collapsed && (
            <LogoutBtn onClick={logout} title="Chiqish" aria-label="Chiqish">
              <LogOut />
            </LogoutBtn>
          )}
        </UserCard>
        <CollapseBtn onClick={onToggle} $collapsed={collapsed} aria-label="Menyuni yig'ish">
          <ChevronsLeft />
          {!collapsed && <span>Yig'ish</span>}
        </CollapseBtn>
      </Footer>
    </Aside>
  );
}
