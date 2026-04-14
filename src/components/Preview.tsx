import { clsx } from 'clsx';
import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { useSettingsStore } from '../store/settingsStore';

interface PreviewProps {
  html: string;
  isDark: boolean;
  themeCss?: string;
  markdownContent?: string;
  previewScrollRef: React.RefObject<HTMLDivElement>;
  onScroll?: () => void;
  scrollSyncEnabled?: boolean;
  onSelectContent?: (start: number, end: number) => void;
}

export interface PreviewRef {
}

export const Preview = forwardRef<PreviewRef, PreviewProps>(({ html, isDark, themeCss, markdownContent, previewScrollRef, onScroll, scrollSyncEnabled = false, onSelectContent }, ref) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  
  const { fontSettings } = useSettingsStore();

  useImperativeHandle(ref, () => ({}));

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      themeVariables: {
        dark: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#3b82f6',
          lineColor: '#e5e7eb',
          secondaryColor: '#374151',
          tertiaryColor: '#1f2937'
        },
        default: {
          primaryColor: '#3b82f6',
          primaryTextColor: '#000000',
          primaryBorderColor: '#3b82f6',
          lineColor: '#374151',
          secondaryColor: '#f3f4f6',
          tertiaryColor: '#ffffff'
        }
      }
    });
    
    const renderMermaid = () => {
      if (contentRef.current) {
        mermaid.run({
          nodes: contentRef.current.querySelectorAll('.mermaid')
        });
      }
    };
    
    const applyDarkModeStyles = () => {
      if (contentRef.current) {
        const elements = contentRef.current.querySelectorAll('*');
        elements.forEach(element => {
          const el = element as HTMLElement;
          
          if (isDark) {
            if (el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' ||
                el.tagName === 'H4' || el.tagName === 'H5' || el.tagName === 'H6' || el.tagName === 'LI') {
              el.style.color = '#e5e7eb';
            }
            
            if (el.tagName === 'A') {
              el.style.color = '#3b82f6';
            }
            
            if (el.tagName === 'PRE' || el.classList.contains('code')) {
              el.style.backgroundColor = '#1e293b';
              el.style.color = '#e5e7eb';
              el.style.borderColor = '#334155';
            }
            
            if (el.tagName === 'BLOCKQUOTE') {
              el.style.backgroundColor = '#1e293b';
              el.style.borderLeftColor = '#3b82f6';
              el.style.color = '#e5e7eb';
            }
            
            if (el.tagName === 'TABLE') {
              el.style.borderColor = '#334155';
            }
            if (el.tagName === 'TH' || el.tagName === 'TD') {
              el.style.borderColor = '#334155';
              el.style.color = '#e5e7eb';
            }
          } else {
            if (el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'H3' ||
                el.tagName === 'H4' || el.tagName === 'H5' || el.tagName === 'H6' || el.tagName === 'LI') {
              el.style.color = '';
            }
            
            if (el.tagName === 'A') {
              el.style.color = '';
            }
            
            if (el.tagName === 'PRE' || el.classList.contains('code')) {
              el.style.backgroundColor = '';
              el.style.color = '';
              el.style.borderColor = '';
            }
            
            if (el.tagName === 'BLOCKQUOTE') {
              el.style.backgroundColor = '';
              el.style.borderLeftColor = '';
              el.style.color = '';
            }
            
            if (el.tagName === 'TABLE') {
              el.style.borderColor = '';
            }
            if (el.tagName === 'TH' || el.tagName === 'TD') {
              el.style.borderColor = '';
              el.style.color = '';
            }
          }
        });
      }
    };
    
    renderMermaid();
    applyDarkModeStyles();
    
    const observer = new MutationObserver(() => {
      renderMermaid();
      applyDarkModeStyles();
    });
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, [isDark, fontSettings]);

  useEffect(() => {
    if (!onSelectContent || !contentRef.current) return;
    
    const handleClick = (e: MouseEvent) => {
      console.log('=== Preview clicked ===');
      
      const target = e.target as HTMLElement;
      
      if (!markdownContent) {
        console.warn('markdownContent is missing');
        return;
      }
      
      const handleElementClick = (element: HTMLElement): boolean => {
        if (element.tagName === 'IMG') {
          const src = element.getAttribute('src');
          if (src) {
            const regex = /!\[.*?\]\((.*?)\)/g;
            let match;
            while ((match = regex.exec(markdownContent)) !== null) {
              if (match[1] === src) {
                const start = match.index;
                const end = start + match[0].length;
                onSelectContent(start, end);
                console.log('Selected image:', start, end, match[0]);
                return true;
              }
            }
            
            if (src.startsWith('data:image/')) {
              const base64Prefix = src.substring(0, 50);
              const regex = /!\[.*?\]\((data:image\/.*?)\)/g;
              let match;
              while ((match = regex.exec(markdownContent)) !== null) {
                if (match[1].startsWith(base64Prefix)) {
                  const start = match.index;
                  const end = start + match[0].length;
                  onSelectContent(start, end);
                  console.log('Selected base64 image:', start, end, match[0]);
                  return true;
                }
              }
            }
          }
          return false;
        }
        
        const text = element.textContent || '';
        const trimmedText = text.trim();
        
        if (!trimmedText) return false;
        
        const searchText = trimmedText.substring(0, 30);
        const index = markdownContent.indexOf(searchText);
        
        if (index !== -1) {
          let start = index;
          let end = index + searchText.length;
          
          const nextLineBreak = markdownContent.indexOf('\n', end);
          if (nextLineBreak !== -1) {
            end = nextLineBreak;
          } else {
            end = markdownContent.length;
          }
          
          const prevLineBreak = markdownContent.lastIndexOf('\n', start);
          if (prevLineBreak !== -1) {
            start = prevLineBreak + 1;
          } else {
            start = 0;
          }
          
          onSelectContent(start, end);
          console.log('Selected content:', start, end, markdownContent.substring(start, end));
          return true;
        }
        
        return false;
      };

      let currentElement: HTMLElement | null = target;
      while (currentElement && currentElement !== contentRef.current) {
        if (handleElementClick(currentElement)) {
          return;
        }
        currentElement = currentElement.parentElement;
      }
    };
    
    contentRef.current.addEventListener('click', handleClick);
    
    return () => {
      contentRef.current?.removeEventListener('click', handleClick);
    };
  }, [onSelectContent, markdownContent]);

  return (
    <div className={clsx(
      "flex flex-col h-full",
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
        onScroll={scrollSyncEnabled ? onScroll : undefined}
      >
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <style dangerouslySetInnerHTML={{ __html: `
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
        `}} />
        <div className={clsx(
          "mx-auto shadow-sm rounded-lg p-6 md:p-8 min-h-full",
          viewMode === 'mobile' ? "max-w-[375px]" :
          viewMode === 'tablet' ? "max-w-[768px]" :
          "max-w-[960px]",
          isDark ? "bg-[#1f2937] text-gray-200" : "bg-white text-gray-800"
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
