import styled from 'styled-components';

export const Group = styled.section`
  & + & {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px dashed ${({ theme }) => theme.colors.border};
  }
`;

export const GroupTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray};
  svg { width: 15px; height: 15px; color: ${({ theme }) => theme.colors.primary}; }
`;

export const ErrorLine = styled.p`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.danger};
  font-size: 13px;
`;
