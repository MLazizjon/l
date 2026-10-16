import styled, { keyframes } from 'styled-components';

const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
`;

export const Box = styled.div`
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: ${rise} 0.45s ease both;

  form { width: 100%; display: flex; flex-direction: column; gap: 16px; animation: ${rise} 0.3s ease both; }
  input { width: 100%; }
  select {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
    appearance: none;
    cursor: pointer;
  }
  button[type='submit']:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const BackLink = styled.a`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
  font-size: 13.5px;
  svg { width: 16px; height: 16px; transition: transform 0.15s; }
  &:hover { color: ${({ theme }) => theme.colors.primary}; svg { transform: translateX(-3px); } }
`;

export const Tabs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.grayBg};
`;

export const Tab = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border-radius: 11px;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? theme.colors.ink : theme.colors.gray)};
  background: ${({ $active }) => ($active ? '#fff' : 'transparent')};
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadow.md : 'none')};
  transition: all 0.18s;
  svg { width: 17px; height: 17px; }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 14px;
  .full { grid-column: 1 / -1; }
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: 1fr; }
`;

/* Login bor / yo'qligi haqida jonli maslahat */
export const LoginHint = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: -6px;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $ok, theme }) => ($ok ? theme.colors.primary : theme.colors.gray)};
  svg { width: 15px; height: 15px; flex-shrink: 0; }
  button {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(6px);
`;

export const Step = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 8px;
  i {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 12px;
    background: #fff;
    color: ${({ theme }) => theme.colors.primary};
    svg { width: 19px; height: 19px; }
  }
  &:nth-child(2) i { background: #000; color: #fff; }
  strong { display: block; font-size: 15px; }
  span { font-size: 12.5px; opacity: 0.85; }
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

/* Hamkor turi: zavod / broker / logistika kompaniyasi */
export const TypePick = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
  button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 6px;
    border-radius: 14px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background: #fff;
    color: ${({ theme }) => theme.colors.gray};
    font-size: 12.5px;
    font-weight: 600;
    line-height: 1.2;
    text-align: center;
    transition: all 0.15s;
    svg { width: 20px; height: 20px; }
  }
  button[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryFaint};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
