import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronDown, LogOut, CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { findNavItem, itemLabel } from '../../data/navigation';
import { roleLabel } from '../../data/constants';
import { initials, monthName } from '../../utils/helpers';
import { t, LangSwitcher } from '../../i18n';
import {
  Bar, Left, MenuBtn, Crumbs, Right, DateChip, RoleBadge, Profile, Dropdown, DropItem,
} from './styles';

const DAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

export default function Header({ onMenu }) {
  const { user, role, canSeeAll, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = findNavItem(pathname);
  const now = new Date();
  const dateText = `${t(DAYS[now.getDay()])}, ${now.getDate()} ${monthName(now.getMonth())}`;

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <Bar>
      <Left>
        <MenuBtn onClick={onMenu} aria-label={t('Menyuni ochish')}><Menu /></MenuBtn>
        <Crumbs>
          <span>YukCRM</span>
          <span>/</span>
          <strong>{t(current ? itemLabel(current, role) : 'Bosh sahifa')}</strong>
        </Crumbs>
      </Left>

      <Right>
        <LangSwitcher />
        <DateChip><CalendarDays />{dateText}</DateChip>
        <RoleBadge $admin={canSeeAll}>{roleLabel(role)}</RoleBadge>

        <Profile ref={ref}>
          <button onClick={() => setOpen((v) => !v)} aria-expanded={open}>
            <span className="avatar">{initials(user?.name)}</span>
            <span className="name">{user?.name?.split(' ')[0]}</span>
            <ChevronDown />
          </button>
          {open && (
            <Dropdown>
              <div className="head">
                <strong>{user?.name}</strong>
                <span>@{user?.username}</span>
              </div>
              <DropItem onClick={logout}><LogOut /> {t('Tizimdan chiqish')}</DropItem>
            </Dropdown>
          )}
        </Profile>
      </Right>
    </Bar>
  );
}
