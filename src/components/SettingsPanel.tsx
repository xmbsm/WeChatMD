import { Settings, X, Type, Text, GripVertical, Palette } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useSettingsStore } from '../store/settingsStore';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export function SettingsPanel({ isOpen, onClose, isDark }: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState('font');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // 使用设置存储
  const {
    fontSettings,
    themeMode,
    setFontFamily,
    setFontSize,
    setLetterSpacing,
    setLineHeight,
    setThemeMode,
    applySettings
  } = useSettingsStore();

  const navigationSections = [
    {
      id: 'font',
      label: '字体',
      icon: <Type className="w-4 h-4" />,
    },
    {
      id: 'font-size',
      label: '字号',
      icon: <Text className="w-4 h-4" />,
    },
    {
      id: 'spacing',
      label: '间距',
      icon: <GripVertical className="w-4 h-4" />,
    },
    {
      id: 'theme',
      label: '主题',
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section && contentRef.current) {
      contentRef.current.scrollTo({
        top: section.offsetTop - 20,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const sections = navigationSections.map(({ id }) => {
        const element = document.getElementById(id);
        if (!element) return { id, top: 0, bottom: 0 };
        const rect = element.getBoundingClientRect();
        return {
          id,
          top: rect.top,
          bottom: rect.bottom,
        };
      });

      const currentSection = sections.find((section) => {
        return section.top <= 30 && section.bottom >= 30;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div
        className={clsx(
          "relative w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl overflow-hidden flex flex-col",
          isDark ? "bg-[#2d2d2d] text-white" : "bg-white text-gray-800"
        )}
      >
        {/* 头部 */}
        <div className={clsx(
          "flex items-center justify-between px-6 py-4 border-b",
          isDark ? "border-gray-700" : "border-gray-200"
        )}>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#07c160]" />
            <h2 className="text-lg font-bold">设置</h2>
          </div>
          <button
            onClick={onClose}
            className={clsx(
              "p-2 rounded-lg transition-all",
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 主体内容 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 侧边导航 */}
          <div className={clsx(
            "w-64 border-r p-4 overflow-y-auto",
            isDark ? "border-gray-700 bg-[#373737]" : "border-gray-200 bg-gray-50"
          )}>
            <div className={clsx(
              "text-sm font-semibold mb-4 px-2",
              isDark ? "text-gray-400" : "text-gray-500"
            )}>
              快速导航
            </div>
            <nav className="space-y-1">
              {navigationSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={clsx(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left",
                    activeSection === section.id
                      ? "bg-[#07c160] text-white"
                      : isDark
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    {section.icon}
                  </div>
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* 设置内容 */}
          <div
            ref={contentRef}
            className="flex-1 overflow-y-auto p-6"
          >
            {/* 字体设置 */}
            <section id="font" className="mb-8 scroll-mt-20">
              <div className={clsx(
                "flex items-center gap-2 mb-4",
                isDark ? "text-gray-200" : "text-gray-800"
              )}>
                <Type className="w-5 h-5" />
                <h3 className="text-lg font-semibold">字体</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: '默认字体', value: 'system' },
                  { name: '微软雅黑', value: 'microsoft yahei' },
                  { name: '苹方', value: 'pingfang sc' },
                  { name: '宋体', value: 'songti' },
                  { name: '黑体', value: 'heiti' },
                  { name: 'Arial', value: 'arial' },
                  { name: 'Helvetica', value: 'helvetica' },
                  { name: 'Georgia', value: 'georgia' },
                ].map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setFontFamily(font.value)}
                    className={clsx(
                      "flex flex-col items-center justify-center p-4 rounded-lg border transition-all",
                      fontSettings.fontFamily === font.value
                        ? "border-[#07c160] bg-[rgba(7,193,96,0.1)]"
                        : isDark
                        ? "border-gray-700 hover:border-[#07c160]"
                        : "border-gray-200 hover:border-[#07c160]"
                    )}
                  >
                    <div
                      className="text-2xl mb-2"
                      style={{ fontFamily: font.value === 'system' ? 'inherit' : font.value }}
                    >
                      Aa
                    </div>
                    <div className={clsx(
                      "text-sm",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                      {font.name}
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* 字号设置 */}
            <section id="font-size" className="mb-8 scroll-mt-20">
              <div className={clsx(
                "flex items-center gap-2 mb-4",
                isDark ? "text-gray-200" : "text-gray-800"
              )}>
                <Text className="w-5 h-5" />
                <h3 className="text-lg font-semibold">字号</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={clsx(
                      "text-sm",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                      正文大小
                    </span>
                    <span className={clsx(
                      "text-sm font-medium",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      {fontSettings.fontSize}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSettings.fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: isDark ? '#374151' : '#e5e7eb',
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={clsx(
                      "text-sm",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                      标题大小
                    </span>
                    <span className={clsx(
                      "text-sm font-medium",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      {Math.round(fontSettings.fontSize * 1.5)}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="36"
                    value={Math.round(fontSettings.fontSize * 1.5)}
                    onChange={(e) => setFontSize(Math.round(Number(e.target.value) / 1.5))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: isDark ? '#374151' : '#e5e7eb',
                    }}
                  />
                </div>
              </div>
            </section>

            {/* 间距设置 */}
            <section id="spacing" className="mb-8 scroll-mt-20">
              <div className={clsx(
                "flex items-center gap-2 mb-4",
                isDark ? "text-gray-200" : "text-gray-800"
              )}>
                <GripVertical className="w-5 h-5" />
                <h3 className="text-lg font-semibold">间距</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={clsx(
                      "text-sm",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                      行高
                    </span>
                    <span className={clsx(
                      "text-sm font-medium",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      {fontSettings.lineHeight.toFixed(1)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2"
                    step="0.1"
                    value={fontSettings.lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: isDark ? '#374151' : '#e5e7eb',
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className={clsx(
                      "text-sm",
                      isDark ? "text-gray-400" : "text-gray-600"
                    )}>
                      字间距
                    </span>
                    <span className={clsx(
                      "text-sm font-medium",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      {fontSettings.letterSpacing}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.1"
                    value={fontSettings.letterSpacing}
                    onChange={(e) => setLetterSpacing(Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: isDark ? '#374151' : '#e5e7eb',
                    }}
                  />
                </div>
              </div>
            </section>

            {/* 主题设置 */}
            <section id="theme" className="mb-8 scroll-mt-20">
              <div className={clsx(
                "flex items-center gap-2 mb-4",
                isDark ? "text-gray-200" : "text-gray-800"
              )}>
                <Palette className="w-5 h-5" />
                <h3 className="text-lg font-semibold">主题</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: '浅色模式', value: 'light' },
                  { name: '深色模式', value: 'dark' },
                  { name: '跟随系统', value: 'system' },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setThemeMode(theme.value as 'light' | 'dark' | 'system')}
                    className={clsx(
                      "flex flex-col items-center justify-center p-4 rounded-lg border transition-all",
                      themeMode === theme.value
                        ? "border-[#07c160] bg-[rgba(7,193,96,0.1)]"
                        : isDark
                        ? "border-gray-700 hover:border-[#07c160]"
                        : "border-gray-200 hover:border-[#07c160]"
                    )}
                  >
                    <div
                      className="w-16 h-16 rounded-full mb-2 flex items-center justify-center text-2xl font-bold"
                      style={{
                        backgroundColor: theme.value === 'dark' ? '#1e1e1e' : '#ffffff',
                        color: theme.value === 'dark' ? '#ffffff' : '#1e1e1e',
                        border: theme.value === 'system' ? '2px solid #07c160' : 'none',
                      }}
                    >
                      {theme.value === 'system' ? 'SY' : theme.value.charAt(0).toUpperCase()}
                    </div>
                    <div className={clsx(
                      "text-sm",
                      isDark ? "text-gray-300" : "text-gray-700"
                    )}>
                      {theme.name}
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 底部 */}
        <div className={clsx(
          "flex items-center justify-end px-6 py-4 border-t",
          isDark ? "border-gray-700" : "border-gray-200"
        )}>
          <button
            onClick={() => {
              applySettings();
              onClose();
            }}
            className={clsx(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              "bg-[#07c160] text-white hover:bg-[#06ad56] hover:shadow-lg"
            )}
          >
            应用设置
          </button>
        </div>
      </div>
    </div>
  );
}
