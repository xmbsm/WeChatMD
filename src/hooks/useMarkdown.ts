import { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.min.css';
import { Theme, builtInThemes, loadCustomThemes, saveCustomThemes } from '../utils/themes';

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

const DEFAULT_CONTENT = `# 欢迎使用微信公众号 Markdown 编辑器

这是一个专为微信公众号设计的 Markdown 编辑器，支持实时预览和一键复制功能。

## 主要功能

- **实时预览**: 左侧编辑，右侧实时预览
- **微信样式**: 完全适配微信公众号排版
- **一键复制**: 复制后直接粘贴到微信编辑器
- **主题切换**: 支持深色/浅色模式
- **主题管理**: 多种内置样式，支持自定义

## 常用语法示例

### 列表
- 无序列表项 1
- 无序列表项 2
  - 嵌套项
  - 嵌套项

### 表格

| 功能 | 说明 | 状态 |
|------|------|------|
| 标题 | 支持多级标题 | ✅ |
| 列表 | 有序/无序列表 | ✅ |
| 代码 | 行内代码和代码块 | ✅ |
| 表格 | Markdown 表格 | ✅ |

### 代码块

\`\`\`javascript
function hello() {
  console.log("Hello, WeChat!");
}
\`\`\`

### 引用

> 这是一段引用文字，用来强调重要内容。
> 
> 可以包含多行。

---

开始编辑你的内容吧！
`;

const STORAGE_KEY = 'wechat-markdown-content';
const THEME_KEY = 'wechat-current-theme';

export function useMarkdown() {
  const [content, setContent] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || DEFAULT_CONTENT;
  });
  const [html, setHtml] = useState<string>('');
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem(THEME_KEY) || 'default';
  });
  const [customThemes, setCustomThemes] = useState<Theme[]>(() => {
    return loadCustomThemes();
  });

  useEffect(() => {
    const parsedHtml = marked.parse(content) as string;
    setHtml(parsedHtml);
  }, [content]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, content);
  }, [content]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, currentThemeId);
  }, [currentThemeId]);

  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const clearContent = useCallback(() => {
    if (window.confirm('确定要清空内容吗？')) {
      setContent('');
    }
  }, []);

  const getCurrentTheme = useCallback(() => {
    const allThemes = [...customThemes, ...builtInThemes];
    return allThemes.find(theme => theme.id === currentThemeId) || builtInThemes[0];
  }, [currentThemeId, customThemes]);

  const setCurrentTheme = useCallback((themeId: string) => {
    setCurrentThemeId(themeId);
  }, []);

  const addCustomTheme = useCallback((theme: Theme) => {
    const newCustomThemes = [...customThemes, theme];
    setCustomThemes(newCustomThemes);
    saveCustomThemes(newCustomThemes);
  }, [customThemes]);

  const updateCustomTheme = useCallback((themeId: string, updatedTheme: Theme) => {
    const newCustomThemes = customThemes.map(theme => 
      theme.id === themeId ? updatedTheme : theme
    );
    setCustomThemes(newCustomThemes);
    saveCustomThemes(newCustomThemes);
  }, [customThemes]);

  const deleteCustomTheme = useCallback((themeId: string) => {
    if (currentThemeId === themeId) {
      setCurrentThemeId('default');
    }
    const newCustomThemes = customThemes.filter(theme => theme.id !== themeId);
    setCustomThemes(newCustomThemes);
    saveCustomThemes(newCustomThemes);
  }, [customThemes, currentThemeId]);

  return {
    content,
    html,
    updateContent,
    clearContent,
    currentThemeId,
    setCurrentTheme,
    getCurrentTheme,
    customThemes,
    addCustomTheme,
    updateCustomTheme,
    deleteCustomTheme,
    builtInThemes
  };
}
