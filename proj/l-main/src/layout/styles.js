import styled from 'styled-components';

export const Shell = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: ${({ $collapsed, theme }) =>
      $collapsed ? theme.sidebar.collapsed : theme.sidebar.width} 1fr;
  transition: grid-template-columns 0.25s ease;

  @media (max-width: ${({ theme }) => theme.bp.md}) {
    grid-template-columns: 1fr;
  }
`;

export const Main = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const Content = styled.main`
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding: 28px 32px 48px;

  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    padding: 20px 16px 40px;
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(12, 27, 46, 0.35);
`;
