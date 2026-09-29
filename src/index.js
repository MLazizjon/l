import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import App from './App';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <BrowserRouter>
        <DataProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </DataProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
