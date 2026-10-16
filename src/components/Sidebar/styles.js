import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Aside = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.side};
  border-right: 1px solid ${({ theme }) => theme.colors.sideBorder};
  color: ${({ theme }) => theme.colors.sideStrong};
  transition: background 0.25s, border-color 0.25s;
  padding: 20px ${({ $collapsed }) => ($collapsed ? '14px' : '16px')};
  overflow: hidden;
  z-index: 50;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    position: fixed;
    left: 0;
    width: ${({ theme }) => theme.sidebar.width};
    padding: 20px 16px;
    transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? '0' : '-100%')});
    transition: transform 0.25s ease;
    box-shadow: ${({ $mobileOpen, theme }) => ($mobileOpen ? theme.shadow.lg : 'none')};
  }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 6px 22px;
`;

export const Logo = styled.div`
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  svg { width: 22px; height: 22px; }
`;

export const BrandText = styled.div`
  line-height: 1.2;
  white-space: nowrap;
  strong { display: block; font-size: 18px; font-weight: 800; letter-spacing: -0.03em; color: ${({ theme }) => theme.colors.sideStrong}; }
  span { font-size: 12px; color: ${({ theme }) => theme.colors.sideMuted}; }
`;

export const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0 -6px;
  padding: 0 6px;
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.colors.sideBorder}; border: none; }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SectionTitle = styled.div`
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.sideMuted};
  padding: 0 12px 6px;
  white-space: nowrap;
  ${({ $collapsed }) =>
    $collapsed &&
    css`
      height: 1px;
      padding: 0;
      margin: 0 10px 8px;
      background: ${({ theme }) => theme.colors.sideBorder};
      color: transparent;
    `}
`;

export const Item = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 40px;
  padding: 0 12px;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.sideText};
  font-weight: 500;
  font-size: 13.5px;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  svg { width: 18px; height: 18px; flex-shrink: 0; }
  span { overflow: hidden; text-overflow: ellipsis; }

  &:hover {
    background: ${({ theme }) => theme.colors.sideHover};
    color: ${({ theme }) => theme.colors.sideStrong};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-weight: 600;
    box-shadow: 0 10px 22px -12px ${({ theme }) => theme.colors.primary};
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.sideBorder};
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.sideCard};
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};

  .avatar {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-weight: 700;
    font-size: 13px;
  }
`;

export const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
  line-height: 1.25;
  strong {
    display: block;
    font-size: 13.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${({ theme }) => theme.colors.sideStrong};
  }
  span { font-size: 12px; color: ${({ theme }) => theme.colors.sideMuted}; }
`;

export const LogoutBtn = styled.button`
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: ${({ theme }) => theme.colors.sideText};
  svg { width: 17px; height: 17px; }
  &:hover {
    background: rgba(229, 72, 77, 0.18);
    color: #FF8A8E;
  }
`;

export const CollapseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: 10px;
  height: 38px;
  padding: 0 12px;
  border-radius: 10px;
  color: ${({ theme }) => theme.colors.sideMuted};
  font-weight: 500;
  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.25s;
    transform: rotate(${({ $collapsed }) => ($collapsed ? '180deg' : '0')});
  }
  &:hover { color: ${({ theme }) => theme.colors.sideStrong}; }

  @media (max-width: ${({ theme }) => theme.bp.md}) { display: none; }
`;

/* Menyu bandidagi son (masalan, yangi kelgan yuklar) */
export const Count = styled.b`
  margin-left: auto;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  ${({ $collapsed }) =>
    $collapsed &&
    css`
      position: absolute;
      top: 4px;
      right: 6px;
      min-width: 18px;
      height: 18px;
      padding: 0 5px;
      font-size: 10px;
    `}
  .active & { background: #fff; color: ${({ theme }) => theme.colors.primary}; }
`;
