import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

export const Aside = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
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
  strong { display: block; font-size: 18px; font-weight: 800; letter-spacing: -0.03em; }
  span { font-size: 12px; color: ${({ theme }) => theme.colors.gray}; }
`;

export const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const SectionTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.grayLight};
  padding: 0 12px 6px;
  white-space: nowrap;
  ${({ $collapsed }) =>
    $collapsed &&
    css`
      height: 1px;
      padding: 0;
      margin: 0 10px 8px;
      background: ${({ theme }) => theme.colors.border};
      color: transparent;
    `}
`;

export const Item = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 12px;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  border-radius: 12px;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;

  svg { width: 20px; height: 20px; flex-shrink: 0; }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryFaint};
    color: ${({ theme }) => theme.colors.ink};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-weight: 600;
    box-shadow: 0 8px 18px -10px ${({ theme }) => theme.colors.primary};
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 14px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

export const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.bg};
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};

  .avatar {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.black};
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
  }
  span { font-size: 12px; color: ${({ theme }) => theme.colors.gray}; }
`;

export const LogoutBtn = styled.button`
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: ${({ theme }) => theme.colors.gray};
  svg { width: 17px; height: 17px; }
  &:hover {
    background: ${({ theme }) => theme.colors.dangerSoft};
    color: ${({ theme }) => theme.colors.danger};
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
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.25s;
    transform: rotate(${({ $collapsed }) => ($collapsed ? '180deg' : '0')});
  }
  &:hover { color: ${({ theme }) => theme.colors.primary}; }

  @media (max-width: ${({ theme }) => theme.bp.md}) { display: none; }
`;
