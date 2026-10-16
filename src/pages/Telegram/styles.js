import styled from 'styled-components';
import { Card } from '../../styles/ui';

export const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 18px;
  > div {
    padding: 18px 22px;
    & + div { border-left: 1px solid ${({ theme }) => theme.colors.border}; }
  }
  b { display: block; font-size: 24px; font-weight: 800; letter-spacing: -0.03em; }
  span { color: ${({ theme }) => theme.colors.gray}; }
  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    grid-template-columns: 1fr;
    > div + div { border-left: none; border-top: 1px solid ${({ theme }) => theme.colors.border}; }
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);
  gap: 16px;
  align-items: start;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

export const Channels = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

export const ChannelRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto auto;
  align-items: center;
  gap: 14px;
  padding: 14px 12px;
  border-radius: 14px;
  transition: background 0.15s;
  &:hover { background: ${({ theme }) => theme.colors.primaryFaint}; }
  > *:not(:last-child) { opacity: ${({ $off }) => ($off ? 0.55 : 1)}; }
  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    grid-template-columns: auto 1fr auto;
    > div:nth-child(3) { display: none; }
  }
`;

export const TypeIcon = styled.span`
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: ${({ $type, theme }) =>
    $type === 'Kanal' ? theme.colors.black : $type === 'Bot' ? theme.colors.grayBg : theme.colors.primarySoft};
  color: ${({ $type, theme }) =>
    $type === 'Kanal' ? '#fff' : $type === 'Bot' ? theme.colors.ink : theme.colors.primary};
  svg { width: 20px; height: 20px; }
`;

export const Info = styled.div`
  min-width: 0;
  strong { display: block; font-weight: 700; }
  span { color: ${({ theme }) => theme.colors.primary}; font-size: 13px; font-weight: 500; }
  small {
    display: block;
    color: ${({ theme }) => theme.colors.gray};
    font-size: 12.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const Members = styled.div`
  text-align: right;
  b { display: block; font-weight: 800; }
  span { font-size: 12px; color: ${({ theme }) => theme.colors.gray}; }
`;

export const Switch = styled.button`
  position: relative;
  width: 42px;
  height: 24px;
  border-radius: 999px;
  background: ${({ $on, theme }) => ($on ? theme.colors.primary : theme.colors.border)};
  transition: background 0.2s;
  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => ($on ? '21px' : '3px')};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: left 0.2s;
  }
  &:disabled { cursor: default; }
`;

export const RowActions = styled.div`
  display: flex;
  gap: 2px;
`;

export const Composer = styled(Card)`
  position: sticky;
  top: 92px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  > div:first-child { margin-bottom: 0; }
`;

/* Telegram chat ko'rinishidagi oldindan ko'rish */
export const Preview = styled.div`
  padding: 18px 14px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.primarySoft};
  background-image: radial-gradient(rgba(37, 99, 235, 0.18) 1px, transparent 1px);
  background-size: 14px 14px;
`;

export const Bubble = styled.div`
  position: relative;
  max-width: 92%;
  padding: 12px 14px 22px;
  border-radius: 16px 16px 16px 4px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: 0 1px 1px rgba(12, 27, 46, 0.08);
  white-space: pre-line;
  font-size: 13.5px;
  line-height: 1.6;
  time {
    position: absolute;
    right: 12px;
    bottom: 6px;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.grayLight};
  }
`;

/* ---------- Ulash qadamlari ---------- */
export const Steps = styled.ol`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const StepItem = styled.li`
  display: flex;
  gap: 14px;
  > i {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 10px;
    font-style: normal;
    font-weight: 800;
    font-size: 13px;
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
  > div { flex: 1; min-width: 0; }
  strong { display: block; font-size: 14.5px; margin-top: 4px; }
  p { font-size: 13px; color: ${({ theme }) => theme.colors.gray}; margin-top: 2px; }
`;

export const CodeLine = styled.code`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 9px 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.grayBg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ui-monospace, 'SFMono-Regular', Consolas, monospace;
  font-size: 12.5px;
  overflow-x: auto;
  white-space: nowrap;
  svg { width: 14px; height: 14px; flex-shrink: 0; color: ${({ theme }) => theme.colors.primary}; }
`;

export const ParsedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  > div {
    padding: 9px 11px;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.grayBg};
    min-width: 0;
  }
  span { display: block; font-size: 11.5px; color: ${({ theme }) => theme.colors.gray}; }
  b { display: block; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;
