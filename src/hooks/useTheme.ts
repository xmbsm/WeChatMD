import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

type Theme = 'light' | 'dark';

export function useTheme() {
  const { themeMode, setThemeMode } = useSettingsStore();

  const getEffectiveTheme = (): Theme => {
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode as Theme;
  };

  const [theme, setTheme] = useState<Theme>(getEffectiveTheme);

  useEffect(() => {
    const newTheme = getEffectiveTheme();
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const updated = getEffectiveTheme();
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(updated);
        localStorage.setItem('theme', updated);
        setTheme(updated);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };
}
