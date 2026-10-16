import styled from 'styled-components';

export const Summary = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  @media (max-width: 1100px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: repeat(2, 1fr); }
`;

export const SumItem = styled.div`
  padding: 14px 16px;
  border-radius: 16px;
  background: ${({ $main, theme }) => ($main ? theme.colors.primary : theme.colors.white)};
  color: ${({ $main }) => ($main ? '#fff' : 'inherit')};
  border: 1px solid ${({ $main, theme }) => ($main ? 'transparent' : theme.colors.border)};
  span { font-size: 12.5px; opacity: 0.75; }
  b { display: block; margin-top: 2px; font-size: 22px; font-weight: 800; letter-spacing: -0.02em; }
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 14px;
`;

export const StaffCard = styled.button`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border-radius: 20px;
  text-align: left;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.md};
    transform: translateY(-2px);
  }
`;

export const Top = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  > div { flex: 1; min-width: 0; }
  strong { display: block; font-size: 16px; font-weight: 700; }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12.5px; }
  .place {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 999px;
    font-weight: 800;
    font-size: 13px;
    background: ${({ theme }) => theme.colors.grayBg};
    color: ${({ theme }) => theme.colors.gray};
    svg { width: 14px; height: 14px; }
  }
  .place.first { background: ${({ theme }) => theme.colors.black}; color: #fff; }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  border-radius: 14px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
  border: 1px solid ${({ theme }) => theme.colors.border};
  > div { padding: 10px 12px; background: ${({ theme }) => theme.colors.white}; }
  span { display: block; font-size: 11.5px; color: ${({ theme }) => theme.colors.gray}; }
  b { font-size: 16px; font-weight: 800; white-space: nowrap; }
`;

export const Progress = styled.div`
  height: 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.grayBg};
  overflow: hidden;
  div {
    width: ${({ $w }) => $w}%;
    height: 100%;
    border-radius: inherit;
    background: ${({ theme }) => theme.colors.primary};
    transition: width 0.5s ease;
  }
`;

export const Spark = styled.div`
  height: 70px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  > div { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; gap: 4px; height: 100%; }
  i {
    width: 100%;
    max-width: 30px;
    border-radius: 6px;
    background: ${({ theme }) => theme.colors.primarySoft};
  }
  i.cur { background: ${({ theme }) => theme.colors.primary}; }
  span { font-size: 11px; color: ${({ theme }) => theme.colors.grayLight}; }
`;

export const CardFoot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  font-weight: 600;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.primary};
  svg { width: 16px; height: 16px; transition: transform 0.18s; }
  ${StaffCard}:hover & svg { transform: translateX(4px); }
`;
