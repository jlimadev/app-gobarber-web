import React from 'react';
import SignIn from './pages/SignIn';
import GlobalStyle from './styles/global';
import SignUp from './pages/SignUp';

const App: React.FC = () => {
  return (
    <>
      <SignIn />
      <GlobalStyle />
    </>
  );
};

export default App;
