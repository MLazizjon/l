import styled, { keyframes } from 'styled-components';

const drive = keyframes`
  0%   { left: 0%; }
  45%  { left: calc(100% - 44px); }
  55%  { left: calc(100% - 44px); }
  100% { left: 0%; }
`;

const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
`;

export const Wrap = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  background: ${({ theme }) => theme.colors.white};
  @media (max-width: ${({ theme }) => theme.bp.md}) { grid-template-columns: 1fr; }
`;

export const Visual = styled.aside`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 40px;
  margin: 16px;
  padding: 40px;
  border-radius: 28px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;

  /* nozik yo'l chiziqlari foni */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(circle at 70% 40%, #000 20%, transparent 75%);
    pointer-events: none;
  }
  > * { position: relative; }

  @media (max-width: ${({ theme }) => theme.bp.md}) { display: none; }
`;

export const VisualTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .logo {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 14px;
    background: #fff;
    color: ${({ theme }) => theme.colors.primary};
    svg { width: 22px; height: 22px; }
  }
  strong { font-size: 20px; font-weight: 800; letter-spacing: -0.03em; }
`;

export const Route = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 26px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(6px);
`;

export const Stop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-direction: ${({ $end }) => ($end ? 'row-reverse' : 'row')};
  text-align: ${({ $end }) => ($end ? 'right' : 'left')};
  i {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.25);
    flex-shrink: 0;
  }
  strong { display: block; font-size: 15px; }
  span { font-size: 12px; opacity: 0.8; }
`;

export const Line = styled.div`
  position: relative;
  height: 44px;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    border-top: 2px dashed rgba(255, 255, 255, 0.55);
  }
`;

export const Mover = styled.span`
  position: absolute;
  top: 0;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: #000;
  color: #fff;
  animation: ${drive} 7s ease-in-out infinite;
  svg { width: 20px; height: 20px; }
`;

export const VisualText = styled.div`
  max-width: 440px;
  h2 {
    font-size: clamp(28px, 3vw, 40px);
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -0.035em;
  }
  p { margin-top: 14px; font-size: 15px; opacity: 0.88; }
`;

export const FormSide = styled.div`
  display: grid;
  place-items: center;
  padding: 40px 24px;
`;

export const FormBox = styled.form`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  animation: ${rise} 0.45s ease both;
`;

export const Heading = styled.div`
  margin-bottom: 8px;
  h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.035em; }
  p { color: ${({ theme }) => theme.colors.gray}; margin-top: 4px; }
`;

export const InputWrap = styled.label`
  display: flex;
  flex-direction: column;
  gap: 7px;
  > span { font-weight: 600; font-size: 13px; }
  > div {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 50px;
    padding: 0 14px;
    border-radius: 14px;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => theme.colors.bg};
    transition: all 0.15s;
    &:focus-within {
      border-color: ${({ theme }) => theme.colors.primary};
      background: #fff;
      box-shadow: 0 0 0 4px ${({ theme }) => theme.colors.primarySoft};
    }
    > svg { width: 18px; height: 18px; color: ${({ theme }) => theme.colors.grayLight}; flex-shrink: 0; }
  }
  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 15px;
  }
  button {
    display: grid;
    place-items: center;
    color: ${({ theme }) => theme.colors.grayLight};
    svg { width: 18px; height: 18px; }
    &:hover { color: ${({ theme }) => theme.colors.primary}; }
  }
`;

export const ErrorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 500;
  svg { width: 17px; height: 17px; flex-shrink: 0; }
`;

export const Submit = styled.button`
  height: 52px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.black};
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  transition: background 0.18s, transform 0.1s;
  &:hover { background: ${({ theme }) => theme.colors.primary}; }
  &:active { transform: translateY(1px); }
`;

export const DemoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  > span { color: ${({ theme }) => theme.colors.gray}; font-size: 13px; }
  > div { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
`;

export const DemoBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  transition: all 0.15s;
  svg { width: 17px; height: 17px; color: ${({ theme }) => theme.colors.primary}; }
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primaryFaint};
  }
`;
