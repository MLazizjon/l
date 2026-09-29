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
