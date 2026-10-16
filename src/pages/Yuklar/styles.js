import styled from 'styled-components';

export const CargoCell = styled.div`
  min-width: 170px;
  max-width: 240px;
  strong { display: block; font-weight: 600; color: ${({ theme }) => theme.colors.ink}; white-space: nowrap; }
  small {
    display: block;
    color: ${({ theme }) => theme.colors.gray};
    font-size: 12.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/* Qayerdan ●——● Qayerga */
export const RouteCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-weight: 500;
  i {
    position: relative;
    width: 46px;
    height: 2px;
    background: repeating-linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary} 0 5px,
      transparent 5px 9px
    );
    &::before, &::after {
      content: '';
      position: absolute;
      top: -3px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    &::before { left: -4px; background: ${({ theme }) => theme.colors.primary}; }
    &::after { right: -4px; background: ${({ theme }) => theme.colors.black}; }
  }
`;

export const Weight = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.grayBg};
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
`;

export const DriverTag = styled.div`
  font-weight: 500;
  white-space: nowrap;
  small { display: block; color: ${({ theme }) => theme.colors.gray}; font-size: 12px; }
`;

/* ---------- Manba tablari: Zavod / Broker ---------- */
export const SourceTabs = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  align-self: flex-start;
`;

export const SourceTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.gray)};
  background: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  transition: all 0.18s;
  svg { width: 17px; height: 17px; }
  b {
    min-width: 22px;
    height: 22px;
    padding: 0 7px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    font-size: 12px;
    background: ${({ $active, theme }) => ($active ? 'rgba(255,255,255,0.22)' : theme.colors.grayBg)};
    color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.ink)};
  }
  &:hover { color: ${({ $active, theme }) => ($active ? '#fff' : theme.colors.ink)}; }
`;

export const NewTag = styled.span`
  margin-left: 6px;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.black};
  color: #fff;
  vertical-align: 2px;
`;

export const Owner = styled.div`
  white-space: nowrap;
  strong { display: block; font-weight: 600; }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12px; }
`;

export const CloseBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  background: ${({ theme }) => theme.colors.black};
  color: #fff;
  white-space: nowrap;
  transition: background 0.15s;
  svg { width: 15px; height: 15px; }
  &:hover { background: ${({ theme }) => theme.colors.primary}; }
`;

/* ---------- Yopish oynasi ---------- */
export const Summary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primaryFaint};
  border: 1px solid ${({ theme }) => theme.colors.primarySoft};
  strong { display: block; font-size: 15px; }
  span { display: inline-flex; align-items: center; gap: 5px; color: ${({ theme }) => theme.colors.gray}; font-size: 13px; }
  span svg { width: 14px; height: 14px; }
  b { font-size: 16px; white-space: nowrap; }
`;

export const SectionLabel = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 0 10px;
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.ink};
  svg { width: 16px; height: 16px; color: ${({ theme }) => theme.colors.primary}; }
`;

export const DriverCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  .info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
  strong { font-size: 14.5px; }
  .info span { display: inline-flex; align-items: center; gap: 5px; font-size: 12.5px; color: ${({ theme }) => theme.colors.gray}; }
  .info span b { color: ${({ theme }) => theme.colors.ink}; }
  .info span svg { width: 13px; height: 13px; }
`;

export const Profit = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 14px 16px;
  border-radius: 14px;
  background: ${({ $neg, theme }) => ($neg ? theme.colors.dangerSoft : theme.colors.black)};
  color: ${({ $neg, theme }) => ($neg ? theme.colors.danger : '#fff')};
  svg { width: 18px; height: 18px; }
  span { flex: 1; font-weight: 500; }
  b { font-size: 17px; }
`;

/* ---------- Dispetcher uchun ko'rsatkichlar ---------- */
export const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  @media (max-width: ${({ theme }) => theme.bp.md}) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`;

export const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid ${({ $main, theme }) => ($main ? 'transparent' : theme.colors.border)};
  background: ${({ $main, theme }) => ($main ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryHover})` : theme.colors.white)};
  color: ${({ $main, theme }) => ($main ? '#fff' : theme.colors.ink)};
  box-shadow: ${({ $main, theme }) => ($main ? `0 14px 30px -16px ${theme.colors.primary}` : theme.shadow.sm)};
  .ico {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 13px;
    background: ${({ $main, theme }) => ($main ? 'rgba(255,255,255,0.18)' : theme.colors.primarySoft)};
    color: ${({ $main, theme }) => ($main ? '#fff' : theme.colors.primary)};
    svg { width: 21px; height: 21px; }
  }
  b { display: block; font-size: 26px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; }
  small { font-size: 12.5px; opacity: ${({ $main }) => ($main ? 0.88 : 0.65)}; }
`;

export const TgLink = styled.a`
  display: inline-grid;
  place-items: center;
  margin-left: 6px;
  vertical-align: -2px;
  color: ${({ theme }) => theme.colors.primary};
  svg { width: 13px; height: 13px; }
`;
