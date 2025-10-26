import React, { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { store, persistor, RootState } from './src/store/store';
import { NavigationContainer } from '@react-navigation/native';

import { AppNavigator } from './src/navigation/AppNavigator';
import { ActivityTracker } from './src/components/ActivityTracker';
import { ThemedStatusBar } from './src/components/ThemedStatusBar';
import { autoLockService } from './src/services/autoLock';
import { ThemeProvider } from './src/context/ThemeContext';
import { lockApp, unlockApp } from './src/features/lock/lockSlice';
import { navigationRef } from './src/navigation/navigationRef';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View } from 'react-native';
import { GestureListenerWrapper } from './src/components/GestureListenerWrapper';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function LockInitializer() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  useEffect(() => {
    if (isAuthenticated) {
      // User just logged in - initialize lock system
      console.log('User logged in - initializing auto-lock system...');

      // Always reset the lock service for a fresh start
      autoLockService.cleanup();
      autoLockService.initialize();
      autoLockService.enableLock();

      const updateReduxLockState = (isLocked: boolean) => {
        if (isLocked) store.dispatch(lockApp());
        else store.dispatch(unlockApp());
      };

      autoLockService.addListener(updateReduxLockState);

      return () => {
        // Cleanup when user logs out
        autoLockService.removeListener(updateReduxLockState);
      };
    } else {
      // User logged out - cleanup lock system
      console.log('User logged out - cleaning up auto-lock system...');
      autoLockService.cleanup();
      autoLockService.disableLock();
      store.dispatch(unlockApp());
    }
  }, [isAuthenticated]); // This will run every time isAuthenticated changes

  return null;
}

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SafeAreaProvider>
              <ThemedStatusBar />
              <LockInitializer />
              <ActivityTracker>
                <GestureListenerWrapper>
                  <NavigationContainer ref={navigationRef}>
                    <AppNavigator />
                  </NavigationContainer>
                </GestureListenerWrapper>
              </ActivityTracker>
              <Toast />
            </SafeAreaProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
