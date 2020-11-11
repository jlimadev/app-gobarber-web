import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { IntlProvider } from './i18n';
import AppProvider from './hooks';
import GlobalStyle from './styles/global';
import Routes from './routes';

const App: React.FC = () => {
  return (
    <IntlProvider>
      <BrowserRouter>
        <AppProvider>
          <Routes />
        </AppProvider>
        <GlobalStyle />
      </BrowserRouter>
    </IntlProvider>
  );
};

export default App;
