import { useState, useEffect, useCallback } from 'react';
import { X, FileText, Eye, Plus, Upload, Download, Copy, Trash2, Check, Palette } from 'lucide-react';
import { clsx } from 'clsx';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { Theme, builtInThemes, DEFAULT_PREVIEW_CONTENT } from '../utils/themes';
import { useSettingsStore } from '../store/settingsStore';

marked.setOptions({
  breaks: true,
  gfm: true
});

marked.use({
  renderer: {
    code({ text, lang }) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    }
  }
});

interface ThemeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTheme: (themeId: string) => void;
  currentThemeId: string;
  customThemes: Theme[];
  builtInThemes: Theme[];
  onAddCustomTheme: (theme: Theme) => void;
  onUpdateCustomTheme: (themeId: string, theme: Theme) => void;
  onDeleteCustomTheme: (themeId: string) => void;
  currentContent: string;
  isDark: boolean;
}

type PreviewMode = 'current' | 'example';

export function ThemeManager({ 
  isOpen, 
  onClose, 
  onSelectTheme,
  currentThemeId,
  customThemes,
  builtInThemes,
  onAddCustomTheme,
  onUpdateCustomTheme,
  onDeleteCustomTheme,
  currentContent,
  isDark
}: ThemeManagerProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string>('default');
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('current');
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [renderKey, setRenderKey] = useState<number>(0);
  
  // 获取字体设置
  const { fontSettings } = useSettingsStore();

  useEffect(() => {
    if (isOpen) {
      setSelectedThemeId(currentThemeId);
      setRenderKey(prev => prev + 1);
    }
  }, [isOpen, currentThemeId]);

  const allThemes = [...customThemes, ...builtInThemes];
  const selectedTheme = allThemes.find(t => t.id === selectedThemeId) || builtInThemes[0];
  const isBuiltInTheme = builtInThemes.some(t => t.id === selectedThemeId);

  useEffect(() => {
    setRenderKey(prev => prev + 1);
  }, [selectedTheme, fontSettings]);



  useEffect(() => {
    let html;
    if (previewMode === 'current') {
      html = marked.parse(currentContent) as string;
    } else {
      html = marked.parse(DEFAULT_PREVIEW_CONTENT) as string;
    }
    setPreviewHtml(html);
  }, [previewMode, currentContent]);

  const handleCreateTheme = () => {
    const newTheme: Theme = {
      id: `custom-${Date.now()}`,
      name: '自定义主题',
      description: '我的自定义样式',
      css: `/* 自定义主题 */

#wechat-preview {
  font-size: 16px;
  color: #000000;
  padding: 0 8px;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

#wechat-preview h1 {
  font-size: 26px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 16px;
  color: #000000;
}

#wechat-preview h2 {
  font-size: 22px;
  font-weight: bold;
  margin-top: 24px;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 4px solid #07c160;
  color: #000000;
}

#wechat-preview p {
  font-size: 16px;
  line-height: 1.8;
  margin: 12px 0;
  color: #333333;
}

#wechat-preview blockquote {
  border-left: 4px solid #07c160;
  padding: 12px 16px;
  margin: 16px 0;
  color: #666666;
  background: #f7f7f7;
}

#wechat-preview a {
  color: #07c160;
  text-decoration: none;
}

#wechat-preview code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  color: #e83e8c;
  font-family: monospace;
}

#wechat-preview pre {
  background: #282c34;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

#wechat-preview pre code {
  background: transparent;
  color: #abb2bf;
}

#wechat-preview table {
  width: 100% !important;
  border-collapse: collapse;
  margin: 16px 0;
}

#wechat-preview table th,
#wechat-preview table td {
  border: 1px solid #ddd;
  padding: 8px 16px;
}

#wechat-preview table th {
  background: #f7f7f7;
  font-weight: bold;
}
`,
      isCustom: true
    };
    onAddCustomTheme(newTheme);
    setSelectedThemeId(newTheme.id);
    setEditingTheme(newTheme);
  };

  const handleDuplicateTheme = () => {
    if (!selectedTheme) return;
    const newTheme: Theme = {
      ...selectedTheme,
      id: `custom-${Date.now()}`,
      name: `${selectedTheme.name} (副本)`,
      isCustom: true
    };
    onAddCustomTheme(newTheme);
    setSelectedThemeId(newTheme.id);
    setEditingTheme(newTheme);
  };

  const handleDeleteTheme = (themeId: string) => {
    if (window.confirm('确定要删除这个主题吗？')) {
      onDeleteCustomTheme(themeId);
      if (selectedThemeId === themeId) {
        setSelectedThemeId('default');
        setEditingTheme(null);
      }
    }
  };

  const handleUpdateTheme = (field: keyof Theme, value: string) => {
    if (!editingTheme) return;
    const updated = { ...editingTheme, [field]: value };
    setEditingTheme(updated);
    onUpdateCustomTheme(updated.id, updated);
  };

  const handleExportTheme = () => {
    if (!selectedTheme) return;
    const data = JSON.stringify(selectedTheme, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTheme.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const theme = JSON.parse(e.target?.result as string) as Theme;
        theme.id = `custom-${Date.now()}`;
        theme.isCustom = true;
        onAddCustomTheme(theme);
        setSelectedThemeId(theme.id);
      } catch (err) {
        alert('导入失败，请确保是有效的主题文件');
      }
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className={clsx(
        "relative w-full max-w-6xl h-[85vh] overflow-hidden rounded-2xl shadow-2xl flex flex-col",
        isDark ? "bg-[#1e1e1e]" : "bg-white"
      )}>
        <div className={clsx(
          "flex items-center justify-between px-6 py-4 border-b shrink-0",
          isDark ? "border-gray-700" : "border-gray-200"
        )}>
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#07c160]" />
            <h2 className={clsx(
              "text-lg font-bold",
              isDark ? "text-white" : "text-gray-800"
            )}>
              主题管理
            </h2>
          </div>
          <button
            onClick={onClose}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              isDark 
                ? "text-gray-400 hover:bg-gray-700 hover:text-white" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className={clsx(
            "w-64 border-r overflow-y-auto shrink-0 p-4",
            isDark ? "border-gray-700 bg-[#252525]" : "border-gray-200 bg-gray-50"
          )}>
            <div className="space-y-3">
              <button
                onClick={handleCreateTheme}
                className={clsx(
                  "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all",
                  "bg-gradient-to-r from-[#07c160] to-[#06ad56] text-white",
                  "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                <Plus className="w-4 h-4" />
                <span>新建自定义主题</span>
              </button>

              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImportTheme(file);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
                <span className={clsx(
                  "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all",
                  isDark
                    ? "bg-[#2d2d2d] text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                )}>
                  <Upload className="w-4 h-4" />
                  <span>导入主题</span>
                </span>
              </label>

              <div className="mt-6">
                <h3 className={clsx(
                  "text-xs font-semibold uppercase tracking-wider mb-3 px-1",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  自定义主题
                </h3>
                <div className="space-y-1.5">
                  {customThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={clsx(
                        "group flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all",
                        selectedThemeId === theme.id
                          ? (isDark ? "bg-[#07c160]/20 text-[#07c160]" : "bg-[#e8f7ef] text-[#07c160]")
                          : (isDark ? "text-gray-300 hover:bg-[#2d2d2d]" : "text-gray-700 hover:bg-white")
                      )}
                      onClick={() => {
                        setSelectedThemeId(theme.id);
                        setEditingTheme(theme);
                        setRenderKey(prev => prev + 1);
                      }}
                    >
                      <span className="font-medium truncate text-sm">{theme.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTheme(theme.id);
                        }}
                        className={clsx(
                          "opacity-0 group-hover:opacity-100 p-1 rounded transition-all",
                          "hover:bg-red-500/20 hover:text-red-500"
                        )}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className={clsx(
                  "text-xs font-semibold uppercase tracking-wider mb-3 px-1",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  内置主题
                </h3>
                <div className="space-y-1.5">
                  {builtInThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className={clsx(
                        "px-3 py-2 rounded-xl cursor-pointer transition-all",
                        selectedThemeId === theme.id
                          ? (isDark ? "bg-[#07c160]/20 text-[#07c160]" : "bg-[#e8f7ef] text-[#07c160]")
                          : (isDark ? "text-gray-300 hover:bg-[#2d2d2d]" : "text-gray-700 hover:bg-white")
                      )}
                      onClick={() => {
                        setSelectedThemeId(theme.id);
                        setEditingTheme(null);
                        setRenderKey(prev => prev + 1);
                      }}
                    >
                      <span className="font-medium truncate text-sm">{theme.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col border-r overflow-hidden">
            <div className={clsx(
              "flex items-center gap-2 px-4 py-3 border-b shrink-0",
              isDark ? "border-gray-700 bg-[#252525]" : "border-gray-200 bg-gray-50"
            )}>
              <button
                onClick={() => setPreviewMode('current')}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  previewMode === 'current'
                    ? (isDark ? "bg-[#07c160] text-white" : "bg-[#07c160] text-white")
                    : (isDark ? "text-gray-400 hover:text-white hover:bg-[#2d2d2d]" : "text-gray-600 hover:text-gray-900 hover:bg-white")
                )}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>当前文章</span>
              </button>
              <button
                onClick={() => setPreviewMode('example')}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  previewMode === 'example'
                    ? (isDark ? "bg-[#07c160] text-white" : "bg-[#07c160] text-white")
                    : (isDark ? "text-gray-400 hover:text-white hover:bg-[#2d2d2d]" : "text-gray-600 hover:text-gray-900 hover:bg-white")
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>示例内容</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-[680px] mx-auto bg-white shadow-sm rounded-lg min-h-full">
                <iframe
                  key={renderKey}
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                    <head>
                      <meta charset="utf-8">
                      <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        ${selectedTheme.css}
                        
                        /* 覆盖主题样式，应用用户设置 */
                        #wechat-preview,
                        #wechat-preview *,
                        #wechat-preview p,
                        #wechat-preview h1,
                        #wechat-preview h2,
                        #wechat-preview h3,
                        #wechat-preview h4,
                        #wechat-preview h5,
                        #wechat-preview h6,
                        #wechat-preview li,
                        #wechat-preview blockquote,
                        #wechat-preview blockquote p,
                        #wechat-preview table,
                        #wechat-preview table th,
                        #wechat-preview table td {
                          font-family: ${fontSettings.fontFamily === 'system' ? 'inherit' : fontSettings.fontFamily} !important;
                          line-height: ${fontSettings.lineHeight} !important;
                          letter-spacing: ${fontSettings.letterSpacing}px !important;
                        }
                        
                        #wechat-preview,
                        #wechat-preview p,
                        #wechat-preview li,
                        #wechat-preview blockquote,
                        #wechat-preview blockquote p,
                        #wechat-preview table,
                        #wechat-preview table th,
                        #wechat-preview table td {
                          font-size: ${fontSettings.fontSize}px !important;
                        }
                        
                        #wechat-preview h1 {
                          font-size: ${fontSettings.fontSize * 1.625}px !important;
                        }
                        
                        #wechat-preview h2 {
                          font-size: ${fontSettings.fontSize * 1.375}px !important;
                        }
                        
                        #wechat-preview h3 {
                          font-size: ${fontSettings.fontSize * 1.25}px !important;
                        }
                        
                        #wechat-preview h4 {
                          font-size: ${fontSettings.fontSize * 1.125}px !important;
                        }
                        
                        #wechat-preview h5 {
                          font-size: ${fontSettings.fontSize}px !important;
                        }
                        
                        #wechat-preview h6 {
                          font-size: ${fontSettings.fontSize * 0.875}px !important;
                        }
                        
                        body {
                          padding: 24px 32px;
                        }
                      </style>
                    </head>
                    <body>
                      <div id="wechat-preview">${previewHtml}</div>
                    </body>
                    </html>
                  `}
                  className="w-full min-h-[600px] border-0 rounded-lg"
                  title="主题预览"
                />
              </div>
            </div>
            <div className={clsx(
              "flex items-center justify-between px-6 py-4 border-t shrink-0",
              isDark ? "border-gray-700" : "border-gray-200"
            )}>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDuplicateTheme}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    isDark
                      ? "bg-[#2d2d2d] text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  )}
                >
                  <Copy className="w-4 h-4" />
                  <span>复制</span>
                </button>
                {!isBuiltInTheme && (
                  <button
                    onClick={handleExportTheme}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      isDark
                        ? "bg-[#2d2d2d] text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                    )}
                  >
                    <Download className="w-4 h-4" />
                    <span>导出</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className={clsx(
                    "px-6 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isDark
                      ? "bg-[#2d2d2d] text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  )}
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    onSelectTheme(selectedTheme.id);
                    onClose();
                  }}
                  className={clsx(
                    "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                    "bg-gradient-to-r from-[#07c160] to-[#06ad56] text-white",
                    "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <Check className="w-4 h-4" />
                  <span>应用主题</span>
                </button>
              </div>
            </div>
          </div>

          <div className={clsx(
            "w-80 overflow-y-auto shrink-0 p-4",
            isDark ? "bg-[#252525]" : "bg-gray-50"
          )}>
            <div className="space-y-4">
              <div>
                <label className={clsx(
                  "block text-sm font-semibold mb-2",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}>
                  主题名称
                </label>
                <input
                  type="text"
                  value={editingTheme?.name || selectedTheme.name}
                  onChange={(e) => editingTheme && handleUpdateTheme('name', e.target.value)}
                  disabled={!editingTheme}
                  className={clsx(
                    "w-full px-4 py-2.5 rounded-xl text-sm transition-all outline-none",
                    isDark
                      ? (editingTheme 
                          ? "bg-[#1e1e1e] text-white border border-gray-600 focus:border-[#07c160]"
                          : "bg-[#2d2d2d] text-gray-500 border border-gray-700 cursor-not-allowed")
                      : (editingTheme
                          ? "bg-white text-gray-900 border border-gray-300 focus:border-[#07c160]"
                          : "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed")
                  )}
                />
              </div>

              <div>
                <label className={clsx(
                  "block text-sm font-semibold mb-2",
                  isDark ? "text-gray-300" : "text-gray-700"
                )}>
                  CSS 样式
                </label>
                <textarea
                  value={editingTheme?.css || selectedTheme.css}
                  onChange={(e) => editingTheme && handleUpdateTheme('css', e.target.value)}
                  disabled={!editingTheme}
                  className={clsx(
                    "w-full h-[600px] md:h-[700px] px-4 py-3 rounded-xl text-sm font-mono transition-all outline-none resize-none",
                    isDark
                      ? (editingTheme 
                          ? "bg-[#1e1e1e] text-gray-100 border border-gray-600 focus:border-[#07c160]"
                          : "bg-[#2d2d2d] text-gray-500 border border-gray-700 cursor-not-allowed")
                      : (editingTheme
                          ? "bg-white text-gray-900 border border-gray-300 focus:border-[#07c160]"
                          : "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed")
                  )}
                />
                {!editingTheme && (
                  <div className={clsx(
                    "mt-2 text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg",
                    isDark ? "bg-[#07c160]/10 text-[#07c160]" : "bg-[#e8f7ef] text-[#07c160]"
                  )}>
                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    <span>内置主题不可编辑，点击"复制"按钮可以基于此主题创建自定义主题</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
