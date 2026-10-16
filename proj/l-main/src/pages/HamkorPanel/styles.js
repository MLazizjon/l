import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%   { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.5); }
  100% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
`;

export const Shell = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bg};
`;

export const TopBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 32px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: ${({ theme }) => theme.bp.sm}) { padding: 12px 16px; }
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  .logo {
    width: 42px;
    height: 42px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    svg { width: 21px; height: 21px; }
  }
  div { min-width: 0; line-height: 1.25; }
  strong { display: block; font-size: 16px; font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  span { font-size: 12.5px; color: ${({ theme }) => theme.colors.gray}; }
`;

export const Account = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 5px 5px 6px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.bg};
  .avatar {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.black};
    color: #fff;
    font-weight: 700;
    font-size: 12.5px;
  }
  .who { line-height: 1.2; }
  .who strong { display: block; font-size: 13px; }
  .who span { font-size: 12px; color: ${({ theme }) => theme.colors.gray}; }
  @media (max-width: ${({ theme }) => theme.bp.sm}) { .who { display: none; } }
`;

export const Container = styled.main`
  max-width: 1160px;
  margin: 0 auto;
  padding: 28px 32px 56px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: ${({ theme }) => theme.bp.sm}) { padding: 20px 16px 40px; }
`;

export const Hero = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.035em; }
  p { margin-top: 6px; color: ${({ theme }) => theme.colors.gray}; max-width: 58ch; }
`;

export const Kpis = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  @media (max-width: ${({ theme }) => theme.bp.md}) { grid-template-columns: repeat(2, 1fr); }
`;

export const Kpi = styled.div`
  padding: 18px;
  border-radius: 18px;
  border: 1px solid ${({ $main, theme }) => ($main ? 'transparent' : theme.colors.border)};
  background: ${({ $main, theme }) => ($main ? theme.colors.primary : theme.colors.white)};
  color: ${({ $main, theme }) => ($main ? '#fff' : theme.colors.ink)};
  span { font-size: 13px; opacity: ${({ $main }) => ($main ? 0.9 : 0.7)}; }
  b { display: block; margin: 6px 0 2px; font-size: 30px; font-weight: 800; letter-spacing: -0.03em; }
  small { font-size: 12.5px; opacity: ${({ $main }) => ($main ? 0.85 : 0.6)}; }
`;

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 14px;
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: 1fr; }
`;

export const CargoCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.18s, box-shadow 0.18s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; box-shadow: ${({ theme }) => theme.shadow.md}; }
`;

export const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  strong { display: block; font-size: 16px; font-weight: 700; }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12.5px; }
`;

export const Route = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  span { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  svg { width: 15px; height: 15px; color: ${({ theme }) => theme.colors.primary}; }
  i {
    flex: 1;
    height: 2px;
    background: repeating-linear-gradient(90deg, ${({ theme }) => theme.colors.primary} 0 6px, transparent 6px 11px);
    position: relative;
    &::after {
      content: '';
      position: absolute;
      right: -2px;
      top: -3px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.black};
    }
  }
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 9px;
    background: ${({ theme }) => theme.colors.bg};
    font-size: 12.5px;
    color: ${({ theme }) => theme.colors.gray};
  }
  b { color: ${({ theme }) => theme.colors.ink}; }
  svg { width: 14px; height: 14px; }
`;

export const DriverBox = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 4px 12px;
  align-items: center;
  padding: 12px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primaryFaint};
  border: 1px solid ${({ theme }) => theme.colors.primarySoft};
  .avatar {
    grid-row: span 2;
    width: 38px;
    height: 38px;
    display: grid;
    place-items: center;
    border-radius: 11px;
    background: ${({ theme }) => theme.colors.black};
    color: #fff;
    svg { width: 18px; height: 18px; }
  }
  strong { display: block; font-size: 14px; }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12.5px; }
  small b { color: ${({ theme }) => theme.colors.ink}; }
  a, em {
    grid-column: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-style: normal;
  }
  a { color: ${({ theme }) => theme.colors.primary}; font-weight: 600; }
  a svg { width: 14px; height: 14px; }
  em { color: ${({ theme }) => theme.colors.gray}; }
`;

export const Waiting = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.gray};
  font-size: 13px;
  .pulse {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    animation: ${pulse} 1.6s ease-out infinite;
  }
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
  button { flex: 1; height: 38px; }
`;
