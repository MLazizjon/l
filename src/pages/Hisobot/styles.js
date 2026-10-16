import styled from 'styled-components';

export const Totals = styled.div`
  display: grid;
  grid-template-columns: 1.3fr repeat(3, 1fr);
  gap: 6px;
  padding: 6px;
  border-radius: 22px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  @media (max-width: 1100px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: 1fr; }
`;

export const Total = styled.div`
  padding: 18px 20px;
  border-radius: 17px;
  background: ${({ $main, theme }) => ($main ? theme.colors.black : 'transparent')};
  color: ${({ $main, theme }) => ($main ? '#fff' : theme.colors.ink)};
  span {
    display: block;
    font-weight: 500;
    color: ${({ $main, theme }) => ($main ? 'rgba(255,255,255,0.7)' : theme.colors.gray)};
  }
  b {
    display: block;
    margin: 6px 0 2px;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.04em;
    color: ${({ $main, theme }) => ($main ? theme.colors.primary : 'inherit')};
  }
  small {
    font-size: 13px;
    color: ${({ $main, theme }) => ($main ? 'rgba(255,255,255,0.6)' : theme.colors.gray)};
  }
`;

export const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

export const Share = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  > div {
    width: 120px;
    height: 8px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.grayBg};
    overflow: hidden;
  }
  i {
    display: block;
    height: 100%;
    width: ${({ $w }) => $w}%;
    border-radius: inherit;
    background: ${({ theme }) => theme.colors.primary};
  }
  span { font-weight: 600; font-size: 13px; min-width: 36px; }
`;

export const RouteName = styled.span`
  font-weight: 600;
  white-space: nowrap;
`;
