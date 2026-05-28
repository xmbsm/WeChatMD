import { useState, useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

type Theme = 'light' | 'dark';

export function useTheme() {
  const { themeMode, setThemeMode } = useSettingsStore();
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // 应用主题到文档
  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
  };

  // 当主题模式或系统主题变化时更新实际主题
  useEffect(() => {
    const updateTheme = () => {
      let newTheme: Theme;
      if (themeMode === 'system') {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newTheme = themeMode as Theme;
      }
      applyTheme(newTheme);
    };

    updateTheme();

    // 监听系统主题变化
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => updateTheme();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themeMode]);

  const toggleTheme = () => {
    const newThemeMode = theme === 'light' ? 'dark' : 'light';
    setThemeMode(newThemeMode);
    // 直接应用主题，避免闪烁
    applyTheme(newThemeMode as Theme);
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark'
  };
} 