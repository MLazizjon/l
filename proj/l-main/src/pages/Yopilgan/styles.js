import styled from 'styled-components';

/* Yuqoridagi qisqa statistika qatori */
export const Strip = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  @media (max-width: 1100px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: repeat(2, 1fr); }
`;

export const StripItem = styled.div`
  padding: 14px 16px;
  border-radius: 16px;
  background: ${({ $main, theme }) => ($main ? theme.colors.black : theme.colors.white)};
  color: ${({ $main }) => ($main ? '#fff' : 'inherit')};
  border: 1px solid ${({ $main, theme }) => ($main ? 'transparent' : theme.colors.border)};
  span { font-size: 12.5px; opacity: 0.7; }
  b { display: block; margin-top: 2px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; }
`;

export const Two = styled.div`
  white-space: nowrap;
  strong { display: block; font-weight: 600; color: ${({ theme }) => theme.colors.ink}; }
  small {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: ${({ theme }) => theme.colors.gray};
    font-size: 12.5px;
    svg { width: 13px; height: 13px; color: ${({ theme }) => theme.colors.primary}; }
  }
`;

export const Money = styled.div`
  white-space: nowrap;
  strong { display: block; }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12.5px; }
  small b { color: ${({ theme }) => theme.colors.primary}; }
`;

export const Detail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DSection = styled.section`
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  h4 {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 700;
    svg { width: 16px; height: 16px; color: ${({ theme }) => theme.colors.primary}; }
  }
  .driver {
    display: flex;
    align-items: center;
    gap: 12px;
    > div { flex: 1; display: flex; flex-direction: column; }
    strong { font-size: 15px; }
    span { color: ${({ theme }) => theme.colors.gray}; font-size: 13px; }
    a {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: ${({ theme }) => theme.colors.primary};
      font-weight: 600;
      font-size: 13px;
      svg { width: 13px; height: 13px; }
    }
    small { text-align: right; color: ${({ theme }) => theme.colors.gray}; font-size: 12px; }
  }
`;

export const DRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 0;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
  &:first-of-type { border-top: none; }
  span { color: ${({ theme }) => theme.colors.gray}; white-space: nowrap; }
  b { text-align: right; font-weight: ${({ $strong }) => ($strong ? 800 : 600)}; }
  ${({ $strong, theme }) => $strong && `b { color: ${theme.colors.primary}; font-size: 15px; }`}
`;
