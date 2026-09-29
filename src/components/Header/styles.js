import styled from 'styled-components';

export const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 30;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 32px;
  background: rgba(246, 249, 252, 0.82);
  backdrop-filter: saturate(160%) blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: ${({ theme }) => theme.bp.sm}) { padding: 0 16px; }
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const MenuBtn = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  svg { width: 20px; height: 20px; }
  @media (max-width: ${({ theme }) => theme.bp.md}) { display: grid; }
`;

export const Crumbs = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.grayLight};
  white-space: nowrap;
  strong { color: ${({ theme }) => theme.colors.ink}; font-weight: 700; }
  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    span { display: none; }
  }
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DateChip = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.gray};
  font-weight: 500;
  svg { width: 16px; height: 16px; color: ${({ theme }) => theme.colors.primary}; }
  @media (max-width: ${({ theme }) => theme.bp.md}) { display: none; }
`;

export const RoleBadge = styled.span`
  height: 26px;
  display: inline-flex;
  align-items: center;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${({ $admin, theme }) => ($admin ? theme.colors.black : theme.colors.primarySoft)};
  color: ${({ $admin, theme }) => ($admin ? '#fff' : theme.colors.primary)};
`;

export const Profile = styled.div`
  position: relative;

  > button {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 42px;
    padding: 0 10px 0 4px;
    border-radius: 14px;
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.border};
    transition: border-color 0.15s;
    &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
    > svg { width: 16px; height: 16px; color: ${({ theme }) => theme.colors.gray}; }
  }

  .avatar {
    width: 32px;
    height: 32px;
    display: grid;
    place-items: center;
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    font-weight: 700;
    font-size: 12px;
  }
  .name {
    font-weight: 600;
    @media (max-width: ${({ theme }) => theme.bp.sm}) { display: none; }
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 230px;
  padding: 6px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow.lg};

  .head {
    padding: 10px 12px 12px;
    margin-bottom: 4px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    strong { display: block; }
    span { color: ${({ theme }) => theme.colors.gray}; font-size: 13px; }
  }
`;

export const DropItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.danger};
  svg { width: 17px; height: 17px; }
  &:hover { background: ${({ theme }) => theme.colors.dangerSoft}; }
`;
