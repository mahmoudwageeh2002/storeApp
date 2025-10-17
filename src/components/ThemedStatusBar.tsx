import React from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ThemedStatusBar: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <StatusBar
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
    />
  );
};
