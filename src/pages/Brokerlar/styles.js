import styled from 'styled-components';
import { Search } from '../../styles/ui';

export const SearchBox = styled(Search)`
  max-width: 360px;
  background: ${({ theme }) => theme.colors.white};
  border-color: ${({ theme }) => theme.colors.border};
`;

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

export const BrokerCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  opacity: ${({ $inactive }) => ($inactive ? 0.7 : 1)};
  transition: border-color 0.18s, box-shadow 0.18s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

export const Top = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const Company = styled.div`
  h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.02em; }
  p { color: ${({ theme }) => theme.colors.gray}; }
`;

export const Contact = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.ink};
  svg { width: 15px; height: 15px; color: ${({ theme }) => theme.colors.primary}; }
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.primaryFaint};
  border: 1px solid ${({ theme }) => theme.colors.primarySoft};
  > div {
    padding: 12px;
    text-align: center;
    & + div { border-left: 1px solid ${({ theme }) => theme.colors.primarySoft}; }
  }
  b { display: block; font-size: 16px; font-weight: 800; }
  span { font-size: 12px; color: ${({ theme }) => theme.colors.gray}; }
`;

export const CardActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  > button:first-child { flex: 1; }
`;
