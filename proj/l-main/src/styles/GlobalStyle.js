import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root { height: 100%; }

  body {
    font-family: 'Onest', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    font-feature-settings: 'tnum' 1;
  }

  button, input, select, textarea { font: inherit; color: inherit; }
  button { cursor: pointer; border: none; background: none; }
  a { color: inherit; text-decoration: none; }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  ::selection { background: ${({ theme }) => theme.colors.primarySoft}; }

  ::-webkit-scrollbar { width: 10px; height: 10px; }
  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 10px;
    border: 3px solid ${({ theme }) => theme.colors.bg};
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation: none !important; transition: none !important; }
  }
`;

export default GlobalStyle;
