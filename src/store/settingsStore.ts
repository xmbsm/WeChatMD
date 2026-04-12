import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FontSettings {
  fontFamily: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
}

interface SettingsState {
  // 字体设置
  fontSettings: FontSettings;
  
  // 主题设置
  themeMode: 'light' | 'dark' | 'system';
  
  // 设置方法
  setFontFamily: (fontFamily: string) => void;
  setFontSize: (fontSize: number) => void;
  setLetterSpacing: (letterSpacing: number) => void;
  setLineHeight: (lineHeight: number) => void;
  setThemeMode: (themeMode: 'light' | 'dark' | 'system') => void;
  
  // 应用设置
  applySettings: () => void;
}

const defaultFontSettings: FontSettings = {
  fontFamily: 'system',
  fontSize: 16,
  letterSpacing: 0,
  lineHeight: 1.5,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // 初始状态
      fontSettings: defaultFontSettings,
      themeMode: 'system',
      
      // 设置方法
      setFontFamily: (fontFamily) => set((state) => ({
        fontSettings: {
          ...state.fontSettings,
          fontFamily,
        },
      })),
      
      setFontSize: (fontSize) => set((state) => ({
        fontSettings: {
          ...state.fontSettings,
          fontSize: Math.max(12, Math.min(24, fontSize)),
        },
      })),
      
      setLetterSpacing: (letterSpacing) => set((state) => ({
        fontSettings: {
          ...state.fontSettings,
          letterSpacing: Math.max(0, Math.min(4, letterSpacing)),
        },
      })),
      
      setLineHeight: (lineHeight) => set((state) => ({
        fontSettings: {
          ...state.fontSettings,
          lineHeight: Math.max(1, Math.min(2, lineHeight)),
        },
      })),
      
      setThemeMode: (themeMode) => set({ themeMode }),
      
      // 应用设置
      applySettings: () => {
        const { fontSettings } = get();
        
        // 应用字体设置到文档
        document.documentElement.style.setProperty('--font-family', fontSettings.fontFamily === 'system' ? 'inherit' : fontSettings.fontFamily);
        document.documentElement.style.setProperty('--font-size', `${fontSettings.fontSize}px`);
        document.documentElement.style.setProperty('--letter-spacing', `${fontSettings.letterSpacing}px`);
        document.documentElement.style.setProperty('--line-height', fontSettings.lineHeight.toString());
      },
    }),
    {
      name: 'wechat-markdown-settings',
      onRehydrateStorage: () => (state) => {
        // 当存储被重新加载时应用设置
        if (state) {
          state.applySettings();
        }
      },
    }
  )
);
