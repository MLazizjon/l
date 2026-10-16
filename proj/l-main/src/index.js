import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import App from './App';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LangProvider>
        <BrowserRouter>
          <DataProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </DataProvider>
        </BrowserRouter>
      </LangProvider>
    </ThemeProvider>
  </React.StrictMode>
);
