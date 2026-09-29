import styled from 'styled-components';

export const RoleTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  background: ${({ $admin, theme }) => ($admin ? theme.colors.black : theme.colors.primarySoft)};
  color: ${({ $admin, theme }) => ($admin ? '#fff' : theme.colors.primary)};
  svg { width: 15px; height: 15px; }
`;

export const You = styled.span`
  margin-left: 6px;
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  vertical-align: middle;
`;

export const Hint = styled.p`
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: 13px;
  background: ${({ $error, theme }) => ($error ? theme.colors.dangerSoft : theme.colors.bg)};
  color: ${({ $error, theme }) => ($error ? theme.colors.danger : theme.colors.gray)};
`;

export const Danger = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  h3 { font-size: 15px; font-weight: 700; }
  p { color: ${({ theme }) => theme.colors.gray}; font-size: 13px; }
`;
