import styled from 'styled-components';

export const City = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  svg { width: 15px; height: 15px; color: ${({ theme }) => theme.colors.primary}; }
`;

export const Volume = styled.div`
  b { display: block; font-weight: 700; }
  span { font-size: 12.5px; color: ${({ theme }) => theme.colors.gray}; }
`;

export const Cabinet = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  white-space: nowrap;
  svg { width: 14px; height: 14px; color: ${({ theme }) => theme.colors.primary}; }
  em {
    margin-left: 4px;
    padding: 2px 7px;
    border-radius: 6px;
    font-style: normal;
    font-size: 11px;
    font-weight: 600;
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
