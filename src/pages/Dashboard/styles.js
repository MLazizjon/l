import styled, { keyframes } from 'styled-components';

const grow = keyframes`from { transform: scaleY(0); } to { transform: scaleY(1); }`;
const roll = keyframes`
  0% { left: 0%; }
  100% { left: calc(100% - 28px); }
`;

export const Hero = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  h1 {
    font-size: clamp(26px, 3vw, 34px);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.1;
  }
  p { color: ${({ theme }) => theme.colors.gray}; margin-top: 6px; font-size: 15px; }
`;

export const Kpis = styled.div`
  display: grid;
  grid-template-columns: 1.3fr repeat(3, 1fr);
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 22px;
  padding: 6px;
  gap: 6px;
  @media (max-width: 1100px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: 1fr; }
`;

export const Kpi = styled.div`
  padding: 18px 20px;
  border-radius: 17px;
  background: ${({ $main, theme }) => ($main ? theme.colors.primary : 'transparent')};
  color: ${({ $main, theme }) => ($main ? '#fff' : theme.colors.ink)};
  > span {
    display: block;
    font-weight: 500;
    color: ${({ $main, theme }) => ($main ? 'rgba(255,255,255,0.85)' : theme.colors.gray)};
  }
  b {
    display: block;
    margin: 6px 0 4px;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1.1;
    i {
      font-style: normal;
      font-size: 16px;
      font-weight: 600;
      margin-left: 4px;
      color: ${({ theme }) => theme.colors.grayLight};
    }
  }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 13px; }
`;

export const Delta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px 3px 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 12.5px;
  font-weight: 600;
  svg { width: 15px; height: 15px; }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  .chart { grid-column: span 8; }
  .status { grid-column: span 4; }
  .trips { grid-column: span 5; }
  .drivers { grid-column: span 4; }
  .brokers { grid-column: span 3; }

  @media (max-width: 1200px) {
    .chart, .trips { grid-column: span 12; }
    .status, .drivers, .brokers { grid-column: span 6; }
    .brokers { grid-column: span 12; }
  }
  @media (max-width: ${({ theme }) => theme.bp.md}) {
    > * { grid-column: span 12 !important; }
  }
`;

export const Chart = styled.div`
  height: 240px;
  display: flex;
  align-items: flex-end;
  gap: 14px;
  padding-top: 20px;
  background-image: linear-gradient(${({ theme }) => theme.colors.border} 1px, transparent 1px);
  background-size: 100% 25%;
`;

export const Bar = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  em {
    font-style: normal;
    font-size: 12px;
    font-weight: 700;
    color: ${({ $current, theme }) => ($current ? theme.colors.ink : theme.colors.grayLight)};
  }
  > div {
    width: 100%;
    max-width: 56px;
    height: ${({ $h }) => Math.max($h, 3)}%;
    border-radius: 12px 12px 6px 6px;
    background: ${({ $current, theme }) => ($current ? theme.colors.primary : theme.colors.primarySoft)};
    transform-origin: bottom;
    animation: ${grow} 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) both;
    transition: background 0.15s;
  }
  &:hover > div { background: ${({ theme }) => theme.colors.primary}; }
  span {
    font-size: 12.5px;
    font-weight: 600;
    color: ${({ $current, theme }) => ($current ? theme.colors.ink : theme.colors.gray)};
  }
`;

export const StatusStack = styled.div`
  display: flex;
  gap: 4px;
  height: 14px;
  margin-bottom: 18px;
  > div { border-radius: 6px; min-width: 6px; }
  .blue { background: ${({ theme }) => theme.colors.primary}; }
  .dark { background: ${({ theme }) => theme.colors.black}; }
  .gray { background: ${({ theme }) => theme.colors.border}; }
  .danger { background: ${({ theme }) => theme.colors.danger}; }
`;

export const StatusLegend = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
  li { display: flex; align-items: center; justify-content: space-between; }
  b { font-size: 18px; font-weight: 800; }
`;

export const Trips = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Trip = styled.div`
  padding: 14px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  .top { display: flex; justify-content: space-between; gap: 10px; }
  .top strong { font-weight: 700; }
  .top span { font-weight: 600; color: ${({ theme }) => theme.colors.primary}; font-size: 13px; }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12.5px; }
`;

export const TripRoute = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  margin: 10px 0 6px;
  > span { font-weight: 600; font-size: 13px; }
  > div {
    position: relative;
    height: 28px;
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      border-top: 2px dashed ${({ theme }) => theme.colors.primary};
      opacity: 0.45;
    }
  }
  i {
    position: absolute;
    top: 0;
    width: 28px;
    height: 28px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    background: ${({ theme }) => theme.colors.black};
    color: #fff;
    animation: ${roll} 6s ease-in-out infinite alternate;
    svg { width: 15px; height: 15px; }
  }
`;

export const DriverList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DriverRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  strong { display: block; font-weight: 600; font-size: 13.5px; }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12px; }
  & + & { border-top: 1px solid ${({ theme }) => theme.colors.border}; }
`;

export const BrokerRow = styled.div`
  & + & { margin-top: 16px; }
  .label {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
    strong {
      font-weight: 600;
      font-size: 13.5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    span { font-weight: 700; font-size: 13px; white-space: nowrap; }
  }
  .track {
    height: 8px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.grayBg};
    overflow: hidden;
    div {
      height: 100%;
      width: ${({ $w }) => $w}%;
      border-radius: inherit;
      background: ${({ $first, theme }) => ($first ? theme.colors.black : theme.colors.primary)};
    }
  }
`;
