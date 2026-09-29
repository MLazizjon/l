import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ChevronDown, LogOut, CalendarDays } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { findNavItem } from '../../data/navigation';
import { initials, MONTHS } from '../../utils/helpers';
import {
  Bar, Left, MenuBtn, Crumbs, Right, DateChip, RoleBadge, Profile, Dropdown, DropItem,
} from './styles';

const DAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];

export default function Header({ onMenu }) {
  const { user, isAdmin, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = findNavItem(pathname);
  const now = new Date();
  const dateText = `${DAYS[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]}`;

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <Bar>
      <Left>
        <MenuBtn onClick={onMenu} aria-label="Menyuni ochish"><Menu /></MenuBtn>
        <Crumbs>
          <span>YukCRM</span>
          <span>/</span>
          <strong>{current?.label || 'Bosh sahifa'}</strong>
        </Crumbs>
      </Left>

      <Right>
        <DateChip><CalendarDays />{dateText}</DateChip>
        <RoleBadge $admin={isAdmin}>{isAdmin ? 'Admin' : 'User'}</RoleBadge>

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
              <DropItem onClick={logout}><LogOut /> Tizimdan chiqish</DropItem>
            </Dropdown>
          )}
        </Profile>
      </Right>
    </Bar>
  );
}
