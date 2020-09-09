import React from 'react';
import SignIn from './pages/SignIn';
import GlobalStyle from './styles/global';
import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <>
      <SignUp />
      <GlobalStyle />
    </>
  );
};

export default App;
