import { useTheme } from '../context/ThemeContext';

export const useColors = () => {
  const { colors } = useTheme();
  return colors;
};

export const useIsDarkMode = () => {
  const { isDarkMode } = useTheme();
  return isDarkMode;
};

export const useToggleDarkMode = () => {
  const { toggleDarkMode } = useTheme();
  return toggleDarkMode;
};
