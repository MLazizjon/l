import styled from 'styled-components';

export const TruckCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  small { color: ${({ theme }) => theme.colors.gray}; font-size: 12.5px; }
`;

/* O'zbekiston davlat raqami ko'rinishida */
export const Plate = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 26px;
  padding: 0 8px 0 0;
  border: 1.5px solid ${({ theme }) => theme.colors.black};
  border-radius: 6px;
  background: #fff;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  em {
    height: 100%;
    display: grid;
    place-items: center;
    padding: 0 5px;
    font-style: normal;
    font-size: 9px;
    font-weight: 800;
    color: #fff;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

export const TripCount = styled.span`
  display: inline-grid;
  place-items: center;
  min-width: 30px;
  height: 26px;
  padding: 0 8px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;

/* Hozirgi joyi, yo'nalishi va qachon yangilangani */
export const Location = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  b, span { display: inline-flex; align-items: center; gap: 5px; }
  b { font-weight: 600; }
  b svg { width: 14px; height: 14px; color: ${({ theme }) => theme.colors.primary}; }
  span { font-size: 12.5px; color: ${({ theme }) => theme.colors.ink}; }
  span svg { width: 12px; height: 12px; color: ${({ theme }) => theme.colors.gray}; }
  small { font-size: 11.5px; color: ${({ theme }) => theme.colors.grayLight}; }
`;

export const Cabinet = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  white-space: nowrap;
  svg { width: 14px; height: 14px; color: ${({ theme }) => theme.colors.primary}; }
`;
