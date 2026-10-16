import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
`;

export const SourceCard = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ $on, theme }) => ($on ? theme.colors.border : '#FFD5D5')};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: border-color 0.2s;
  .ico {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: ${({ $on, theme }) => ($on ? theme.colors.primarySoft : theme.colors.dangerSoft)};
    color: ${({ $on, theme }) => ($on ? theme.colors.primary : theme.colors.danger)};
    svg { width: 22px; height: 22px; }
  }
  .txt { flex: 1; min-width: 0; line-height: 1.35; }
  strong { display: block; font-size: 15.5px; }
  span { display: block; font-size: 13px; color: ${({ $on, theme }) => ($on ? theme.colors.success : theme.colors.danger)}; font-weight: 600; }
  small { font-size: 12.5px; color: ${({ theme }) => theme.colors.gray}; }
`;
