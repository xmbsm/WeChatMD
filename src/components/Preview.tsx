import { clsx } from 'clsx';
import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import mermaid from 'mermaid';
import Darkmode from 'mp-darkmode';
import { useSettingsStore } from '../store/settingsStore';

interface PreviewProps {
  html: string;
  isDark: boolean;
  themeCss?: string;
  markdownContent?: string;
  previewScrollRef: React.RefObject<HTMLDivElement>;
  onSelectContent?: (start: number, end: number) => void;
}

export interface PreviewRef {
}

let darkmodeConfigured = false;

const DARK_MODE_CSS = `
  #wechat-preview {
    background-color: #191919 !important;
    color: #a3a3a3 !important;
  }
  #wechat-preview p,
  #wechat-preview h1,
  #wechat-preview h2,
  #wechat-preview h3,
  #wechat-preview h4,
  #wechat-preview h5,
  #wechat-preview h6,
  #wechat-preview li,
  #wechat-preview td,
  #wechat-preview th,
  #wechat-preview span,
  #wechat-preview div,
  #wechat-preview strong,
  #wechat-preview em,
  #wechat-preview del {
    color: #a3a3a3 !important;
  }
  #wechat-preview a {
    color: #576b95 !important;
  }
  #wechat-preview pre {
    background-color: #2d2d2d !important;
    border-color: #3a3a3a !important;
    color: #a3a3a3 !important;
  }
  #wechat-preview pre code {
    background-color: transparent !important;
    color: #a3a3a3 !important;
  }
  #wechat-preview code {
    background-color: #2d2d2d !important;
    color: #a3a3a3 !important;
    border-color: #3a3a3a !important;
  }
  #wechat-preview blockquote {
    background-color: #2d2d2d !important;
    border-left-color: #5aaa7a !important;
    color: #a3a3a3 !important;
  }
  #wechat-preview blockquote p {
    color: #a3a3a3 !important;
  }
  #wechat-preview table {
    border-color: #3a3a3a !important;
  }
  #wechat-preview th,
  #wechat-preview td {
    border-color: #3a3a3a !important;
    color: #a3a3a3 !important;
  }
  #wechat-preview hr {
    border-color: #3a3a3a !important;
  }
  #wechat-preview img {
    opacity: 0.92;
  }
`;

const DARK_HLJS_CSS = `
  #wechat-preview .hljs-keyword,
  #wechat-preview .hljs-selector-tag,
  #wechat-preview .hljs-literal {
    color: #5aaa7a !important;
  }
  #wechat-preview .hljs-title,
  #wechat-preview .hljs-title.function_ {
    color: #6db88a !important;
  }
  #wechat-preview .hljs-string,
  #wechat-preview .hljs-regexp,
  #wechat-preview .hljs-addition {
    color: #7ac49a !important;
  }
  #wechat-preview .hljs-number,
  #wechat-preview .hljs-built_in {
    color: #5a9a7a !important;
  }
  #wechat-preview .hljs-comment,
  #wechat-preview .hljs-quote {
    color: #4a8a6a !important;
    font-style: italic !important;
  }
  #wechat-preview .hljs-variable,
  #wechat-preview .hljs-template-variable {
    color: #5aaa7a !important;
  }
  #wechat-preview .hljs-attr,
  #wechat-preview .hljs-attribute {
    color: #5a9a7a !important;
  }
  #wechat-preview .hljs-type,
  #wechat-preview .hljs-class .hljs-title {
    color: #6db88a !important;
  }
  #wechat-preview .hljs-symbol,
  #wechat-preview .hljs-bullet {
    color: #7ac49a !important;
  }
  #wechat-preview .hljs-meta {
    color: #5aaa7a !important;
  }
  #wechat-preview .hljs-deletion {
    color: #e06c75 !important;
  }
  #wechat-preview pre code.hljs {
    background: transparent !important;
  }
`;

const LIGHT_HLJS_CSS = `
  #wechat-preview pre code.hljs {
    background: transparent;
  }
  #wechat-preview .hljs-keyword,
  #wechat-preview .hljs-selector-tag,
  #wechat-preview .hljs-literal {
    color: #0d7a3e;
  }
  #wechat-preview .hljs-title,
  #wechat-preview .hljs-title.function_ {
    color: #068a4a;
  }
  #wechat-preview .hljs-string,
  #wechat-preview .hljs-regexp,
  #wechat-preview .hljs-addition {
    color: #1a9f5c;
  }
  #wechat-preview .hljs-number,
  #wechat-preview .hljs-built_in {
    color: #2d8659;
  }
  #wechat-preview .hljs-comment,
  #wechat-preview .hljs-quote {
    color: #6db88a;
    font-style: italic;
  }
  #wechat-preview .hljs-variable,
  #wechat-preview .hljs-template-variable {
    color: #1a7a4a;
  }
  #wechat-preview .hljs-attr,
  #wechat-preview .hljs-attribute {
    color: #2d8659;
  }
  #wechat-preview .hljs-type,
  #wechat-preview .hljs-class .hljs-title {
    color: #0a6e36;
  }
  #wechat-preview .hljs-symbol,
  #wechat-preview .hljs-bullet {
    color: #39d98a;
  }
  #wechat-preview .hljs-meta {
    color: #5aaa7a;
  }
  #wechat-preview .hljs-deletion {
    color: #c0392b;
  }
`;

export const Preview = forwardRef<PreviewRef, PreviewProps>(({ html, isDark, themeCss, markdownContent, previewScrollRef, onSelectContent }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;
  
  const { fontSettings } = useSettingsStore();

  useImperativeHandle(ref, () => ({}));

  const resetDarkModeInlineStyles = () => {
    if (!contentRef.current) return;
    const elements = contentRef.current.querySelectorAll('*');
    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.removeProperty('color');
      htmlEl.style.removeProperty('background-color');
      htmlEl.style.removeProperty('border-left-color');
      htmlEl.style.removeProperty('border-right-color');
      htmlEl.style.removeProperty('border-top-color');
      htmlEl.style.removeProperty('border-bottom-color');
      htmlEl.style.removeProperty('text-shadow');
      htmlEl.style.removeProperty('box-shadow');
    });
  };

  const materializeComputedStyles = () => {
    if (!contentRef.current) return;
    const elements = contentRef.current.querySelectorAll('*');
    elements.forEach(el => {
      const htmlEl = el as HTMLElement;
      const computed = window.getComputedStyle(htmlEl);

      if (computed.color && computed.color !== 'rgba(0, 0, 0, 0)') {
        htmlEl.style.color = computed.color;
      }
      if (computed.backgroundColor &&
          computed.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
          computed.backgroundColor !== 'transparent') {
        htmlEl.style.backgroundColor = computed.backgroundColor;
      }
      const borderColors = [
        { prop: 'borderLeftColor' as const, value: computed.borderLeftColor },
        { prop: 'borderRightColor' as const, value: computed.borderRightColor },
        { prop: 'borderTopColor' as const, value: computed.borderTopColor },
        { prop: 'borderBottomColor' as const, value: computed.borderBottomColor },
      ];
      borderColors.forEach(({ prop, value }) => {
        if (value && value !== 'rgba(0, 0, 0, 0)' && value !== 'rgb(0, 0, 0)') {
          (htmlEl.style as unknown as Record<string, string>)[prop] = value;
        }
      });
    });
  };

  const applyDarkMode = () => {
    if (!contentRef.current || !isDarkRef.current) return;

    resetDarkModeInlineStyles();

    requestAnimationFrame(() => {
      if (!contentRef.current || !isDarkRef.current) return;

      materializeComputedStyles();

      try {
        const nodes = contentRef.current.querySelectorAll('*');
        if (!darkmodeConfigured) {
          Darkmode.run(nodes, {
            mode: 'dark',
            defaultLightTextColor: '#191919',
            defaultLightBgColor: '#ffffff',
            defaultDarkTextColor: '#a3a3a3',
            defaultDarkBgColor: '#191919',
            error: (err: Error) => {
              console.error('Darkmode error:', err);
            }
          });
          darkmodeConfigured = true;
        } else {
          Darkmode.run(nodes, { mode: 'dark' });
        }
      } catch (e) {
        console.error('Failed to apply mp-darkmode:', e);
      }
    });
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
    });

    const renderMermaidDiagrams = async () => {
      if (!contentRef.current) return;
      const mermaidNodes = contentRef.current.querySelectorAll('.mermaid');
      if (mermaidNodes.length === 0) return;

      for (const node of mermaidNodes) {
        const el = node as HTMLElement;
        if (el.getAttribute('data-processed')) continue;

        const preEl = el.querySelector('pre');
        const definition = preEl ? preEl.textContent : el.textContent || '';
        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;

        try {
          const { svg } = await mermaid.render(id, definition);
          el.innerHTML = svg;
          el.setAttribute('data-processed', 'true');
        } catch (e) {
          el.innerHTML = `<pre style="color: #c0392b; font-size: 12px; padding: 8px;">图表渲染失败: ${(e as Error).message}</pre>`;
          el.setAttribute('data-processed', 'true');
        }
      }
    };

    renderMermaidDiagrams();

    if (isDark) {
      applyDarkMode();
    } else {
      resetDarkModeInlineStyles();
    }
  }, [isDark, fontSettings, html, themeCss]);

  useEffect(() => {
    if (!onSelectContent || !contentRef.current) return;
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!markdownContent) return;

      let currentElement: HTMLElement | null = target;
      while (currentElement && currentElement !== contentRef.current) {
        const lineAttr = currentElement.getAttribute('data-line');
        if (lineAttr !== null) {
          const lineNumber = parseInt(lineAttr, 10);
          if (!isNaN(lineNumber)) {
            const lines = markdownContent.split('\n');

            let start = 0;
            for (let i = 0; i < lineNumber; i++) {
              start += (lines[i] || '').length + 1;
            }

            let lastLine = lineNumber;
            const tagName = currentElement.tagName.toLowerCase();
            if (['ul', 'ol'].includes(tagName)) {
              for (let i = lineNumber + 1; i < lines.length; i++) {
                const trimmed = lines[i].trim();
                if (!trimmed) break;
                if (!trimmed.startsWith('- ') && !trimmed.startsWith('* ') && !/^\d+\.\s/.test(trimmed)) break;
                lastLine = i;
              }
            } else if (tagName === 'blockquote') {
              for (let i = lineNumber + 1; i < lines.length; i++) {
                if (!lines[i].trimStart().startsWith('>')) break;
                lastLine = i;
              }
            } else if (tagName === 'table') {
              for (let i = lineNumber + 1; i < lines.length; i++) {
                if (!lines[i].trimStart().startsWith('|')) break;
                lastLine = i;
              }
            } else if (tagName === 'pre') {
              for (let i = lineNumber + 1; i < lines.length; i++) {
                lastLine = i;
                if (lines[i].trimStart().startsWith('```')) break;
              }
            } else {
              for (let i = lineNumber + 1; i < lines.length; i++) {
                const trimmed = lines[i].trim();
                if (!trimmed) break;
                if (trimmed.startsWith('#') || trimmed.startsWith('- ') || trimmed.startsWith('* ') || 
                    trimmed.startsWith('>') || trimmed.startsWith('```') || trimmed.startsWith('---') ||
                    trimmed.startsWith('|') || trimmed.startsWith('![') || /^\d+\.\s/.test(trimmed)) break;
                lastLine = i;
              }
            }

            let end = 0;
            for (let i = 0; i <= lastLine; i++) {
              end += (lines[i] || '').length + 1;
            }
            end = Math.max(0, end - 1);

            onSelectContent(start, end);
            return;
          }
        }
        currentElement = currentElement.parentElement;
      }
    };
    
    contentRef.current.addEventListener('click', handleClick);
    
    return () => {
      contentRef.current?.removeEventListener('click', handleClick);
    };
  }, [onSelectContent, markdownContent]);

  const fontSettingsCss = `
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
  `;

  return (
    <div className={clsx(
      "flex flex-col h-full min-h-0",
      isDark ? "bg-[#252525]" : "bg-gray-100"
    )}>
      <div className={clsx(
        "px-4 border-b text-sm font-medium",
        isDark 
          ? "bg-[#2d2d2d] border-gray-700 text-gray-300" 
          : "bg-white border-gray-200 text-gray-600"
      )} style={{ height: '45px', display: 'flex', alignItems: 'center' }}>
        微信公众号预览
      </div>
      <div className={clsx(
        "flex items-center px-4 py-2 border-b",
        isDark 
          ? "bg-[#252525] border-gray-700" 
          : "bg-white border-gray-200"
      )} style={{ height: '43px' }}>
        <div className="flex space-x-1">
          <button
            onClick={() => setViewMode('mobile')}
            className={clsx(
              "px-2 py-1 mx-1 rounded",
              viewMode === 'mobile'
                ? (isDark ? "bg-[#3c3c3c] text-[rgb(7_193_96)]" : "bg-[rgb(232_247_239)] text-[rgb(7_193_96)]")
                : isDark ? "hover:bg-[#3c3c3c] text-gray-300" : "hover:bg-gray-100 text-gray-600"
            )}
            title="手机视图"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smartphone" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={clsx(
              "px-2 py-1 mx-1 rounded",
              viewMode === 'tablet'
                ? (isDark ? "bg-[#3c3c3c] text-[rgb(7_193_96)]" : "bg-[rgb(232_247_239)] text-[rgb(7_193_96)]")
                : isDark ? "hover:bg-[#3c3c3c] text-gray-300" : "hover:bg-gray-100 text-gray-600"
            )}
            title="平板视图"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tablet" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
          </button>
          <button
            onClick={() => setViewMode('desktop')}
            className={clsx(
              "px-2 py-1 mx-1 rounded",
              viewMode === 'desktop'
                ? (isDark ? "bg-[#3c3c3c] text-[rgb(7_193_96)]" : "bg-[rgb(232_247_239)] text-[rgb(7_193_96)]")
                : isDark ? "hover:bg-[#3c3c3c] text-gray-300" : "hover:bg-gray-100 text-gray-600"
            )}
            title="桌面视图"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          </button>
        </div>
      </div>
      <div 
        ref={previewScrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
      >
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <style dangerouslySetInnerHTML={{ __html: isDark ? DARK_HLJS_CSS : LIGHT_HLJS_CSS }} />
        <style dangerouslySetInnerHTML={{ __html: fontSettingsCss }} />
        {isDark && <style dangerouslySetInnerHTML={{ __html: DARK_MODE_CSS }} />}
        <div className={clsx(
          "mx-auto shadow-sm rounded-lg p-6 md:p-8 min-h-full",
          viewMode === 'mobile' ? "max-w-[375px]" :
          viewMode === 'tablet' ? "max-w-[768px]" :
          "max-w-[960px]",
          isDark ? "bg-[#191919] text-[#a3a3a3]" : "bg-white text-gray-800"
        )}>
          <div 
            ref={contentRef}
            id="wechat-preview"
            dangerouslySetInnerHTML={{ __html: html }}
            className="cursor-pointer"
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
