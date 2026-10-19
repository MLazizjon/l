import styled from 'styled-components';

/* Hozirgi joy va holatni yangilash kartasi */
export const LocationCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 22px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  @media (max-width: ${({ theme }) => theme.bp.sm}) { padding: 16px; }
`;

export const LocNow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.primaryFaint};
  border: 1px solid ${({ theme }) => theme.colors.primarySoft};
  .pin {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    svg { width: 22px; height: 22px; }
  }
  > div { flex: 1; min-width: 0; line-height: 1.3; }
  small { font-size: 12.5px; color: ${({ theme }) => theme.colors.gray}; }
  strong { display: block; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; }
  span {
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
    font-size: 12.5px;
    color: ${({ theme }) => theme.colors.gray};
    svg { width: 13px; height: 13px; }
  }
`;

export const LocForm = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: 1fr; }
`;

/* Bo'shman / Dam olyapman */
export const StatusPick = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    padding: 8px 12px;
    border-radius: 14px;
    border: 1.5px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray};
    font-weight: 600;
    font-size: 14px;
    text-align: center;
    transition: all 0.15s;
    svg { width: 18px; height: 18px; flex-shrink: 0; }
  }
  button[aria-checked='true'] {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryFaint};
    color: ${({ theme }) => theme.colors.primary};
  }
  @media (max-width: ${({ theme }) => theme.bp.sm}) { grid-template-columns: 1fr; }
`;

export const Saved = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success};
  svg { width: 16px; height: 16px; }
`;

export const SectionTitle = styled.h2`
  margin-top: 6px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
`;
