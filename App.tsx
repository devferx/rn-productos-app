import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Navigator} from './src/navigator/Navigator';
import {AuthProvider} from './src/context/AuthContext';

const AppState = ({children}: {children: React.ReactNode}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

const App = () => {
  return (
    <AppState>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </AppState>
  );
};

export default App;
