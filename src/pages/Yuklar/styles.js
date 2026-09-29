import styled from 'styled-components';

export const CargoCell = styled.div`
  min-width: 150px;
  strong { display: block; font-weight: 600; color: ${({ theme }) => theme.colors.ink}; }
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12.5px; }
`;

/* Qayerdan ●——● Qayerga */
export const RouteCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  font-weight: 500;
  i {
    position: relative;
    width: 46px;
    height: 2px;
    background: repeating-linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.primary} 0 5px,
      transparent 5px 9px
    );
    &::before, &::after {
      content: '';
      position: absolute;
      top: -3px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    &::before { left: -4px; background: ${({ theme }) => theme.colors.primary}; }
    &::after { right: -4px; background: ${({ theme }) => theme.colors.black}; }
  }
`;

export const Weight = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.grayBg};
  font-weight: 600;
  font-size: 13px;
`;

export const DriverTag = styled.div`
  font-weight: 500;
  white-space: nowrap;
  small { display: block; color: ${({ theme }) => theme.colors.gray}; font-size: 12px; }
`;
