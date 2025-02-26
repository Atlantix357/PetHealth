import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { requestNotificationPermissions } from './src/services/notificationService';
import AppNavigator from './src/navigation/AppNavigator';

// Create a custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#26A69A',
    accent: '#FF6F61',
  },
};

export default function App() {
  useEffect(() => {
    // Request notification permissions when app starts
    requestNotificationPermissions();
  }, []);

  return (
    <PaperProvider theme={theme}>
      <StatusBar backgroundColor="#26A69A" barStyle="light-content" />
      <AppNavigator />
    </PaperProvider>
  );
}
