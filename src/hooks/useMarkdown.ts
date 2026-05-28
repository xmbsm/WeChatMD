import { useState, useEffect, useMemo, useCallback } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.min.css';
import { Theme, builtInThemes, loadCustomThemes, saveCustomThemes, DEFAULT_PREVIEW_CONTENT } from '../utils/themes';

function renderWithLineNumbers(markdown: string): string {
  const tokens = marked.lexer(markdown);
  let result = '';
  let searchOffset = 0;

  for (const token of tokens) {
    if (token.type === 'space') continue;

    const offset = markdown.indexOf(token.raw, searchOffset);
    const line = offset === -1 ? 0 : markdown.substring(0, offset).split('\n').length - 1;
    if (offset !== -1) {
      searchOffset = offset + token.raw.length;
    }

    const rendered = marked.parse(token.raw) as string;
    const injected = rendered.replace(
      /<(h[1-6]|p|blockquote|ul|ol|pre|hr|table)\b([^>]*)>/,
      (match, tag, attrs) => `<${tag}${attrs} data-line="${line}">`
    );

    if (injected !== rendered) {
      result += injected;
    } else {
      result += `<div data-line="${line}">${rendered}</div>`;
    }
  }

  return result;
}

marked.setOptions({
  breaks: true,
  gfm: true
});

marked.use({
  renderer: {
    code({ text, lang }) {
      if (lang === 'mermaid') {
        return `<div class="mermaid"><pre style="display:none">${text}</pre></div>`;
      }
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
      const highlighted = hljs.highlight(text, { language }).value;
      return `<pre><code class="hljs ${language}">${highlighted}</code></pre>`;
    }
  }
});

// 使用包含图片的默认预览内容
const DEFAULT_CONTENT = DEFAULT_PREVIEW_CONTENT;

const STORAGE_KEY = 'wechat-markdown-content';
const THEME_KEY = 'wechat-current-theme';

export function useMarkdown() {
  const [content, setContent] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved !== null ? saved : DEFAULT_CONTENT;
  });
  const html = useMemo(() => renderWithLineNumbers(content), [content]);
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return localStorage.getItem(THEME_KEY) || 'default';
  });
  const [customThemes, setCustomThemes] = useState<Theme[]>(() => {
    return loadCustomThemes();
  });

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
