import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export default function useNavigationTheme() {
  const [theme, setTheme] = useState(DarkTheme);
  const colorScheme = useColorScheme();

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? DarkTheme : DefaultTheme);
  }, [colorScheme]);

  return theme;
}
