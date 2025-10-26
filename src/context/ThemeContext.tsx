import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mmkvStorage } from '../storage/mmkv';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: typeof lightColors;
}

// Light theme colors
export const lightColors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  background: '#FFFFFF',
  backgroundSecondary: '#F2F2F7',
  textPrimary: '#000000',
  textSecondary: '#8E8E93',
  textTertiary: '#C7C7CC',
  border: '#C6C6C8',
  separator: '#E5E5EA',
  dark: '#1C1C1E',
  cardBg: '#FFFFFF',
};

// Dark theme colors
export const darkColors = {
  primary: '#0A84FF',
  secondary: '#5E5CE6',
  success: '#30D158',
  warning: '#FF9F0A',
  danger: '#FF453A',
  background: '#000000',
  backgroundSecondary: '#1C1C1E',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#48484A',
  border: '#38383A',
  separator: '#38383A',
  dark: '#000000',
  cardBg: '#1C1C1E',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'theme_dark_mode';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Get initial theme from storage or default to false
    const stored = mmkvStorage.getItem(STORAGE_KEY);
    return stored === 'true';
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      // Persist to storage
      mmkvStorage.setItem(STORAGE_KEY, newValue.toString());
      return newValue;
    });
  };

  const colors = isDarkMode ? darkColors : lightColors;

  const contextValue: ThemeContextType = {
    isDarkMode,
    toggleDarkMode,
    colors,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
