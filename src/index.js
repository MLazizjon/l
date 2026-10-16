import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeModeProvider } from './styles/ThemeMode';
import GlobalStyle from './styles/GlobalStyle';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { LangProvider } from './i18n';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LangProvider>
      <ThemeModeProvider>
        <GlobalStyle />
        <BrowserRouter>
          <DataProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </DataProvider>
        </BrowserRouter>
      </ThemeModeProvider>
    </LangProvider>
  </React.StrictMode>
);
