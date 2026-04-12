import { clsx } from 'clsx';
import { useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import mermaid from 'mermaid';

interface PreviewProps {
  html: string;
  isDark: boolean;
  themeCss?: string;
  markdownContent?: string;
  onScroll?: () => void;
  scrollSyncEnabled?: boolean;
}

export interface PreviewRef {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

export const Preview = forwardRef<PreviewRef, PreviewProps>(({ html, isDark, themeCss, markdownContent, onScroll, scrollSyncEnabled = false }, ref) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useImperativeHandle(ref, () => ({
    get scrollTop() {
      return previewRef.current?.scrollTop || 0;
    },
    set scrollTop(value: number) {
      if (previewRef.current) {
        previewRef.current.scrollTop = value;
      }
    },
    get scrollHeight() {
      return previewRef.current?.scrollHeight || 0;
    },
    get clientHeight() {
      return previewRef.current?.clientHeight || 0;
    }
  }));

  // 渲染 Mermaid 图表
  useEffect(() => {
    // 初始化 Mermaid
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
    
    // 渲染 Mermaid 图表
    const renderMermaid = () => {
      if (contentRef.current) {
        mermaid.run({
          nodes: contentRef.current.querySelectorAll('.mermaid')
        });
      }
    };
    
    // 初次渲染
    renderMermaid();
    
    // 监听内容变化，重新渲染
    const observer = new MutationObserver(renderMermaid);
    if (contentRef.current) {
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true
      });
    }
    
    return () => {
      observer.disconnect();
    };
  }, [isDark]);

  // 使用useEffect添加滚动监听器
  useEffect(() => {
    // 直接在预览器的滚动容器上添加滚动事件监听器
    const handleScroll = () => {
      if (scrollSyncEnabled && onScroll) {
        onScroll();
      }
    };
    
    // 查找预览器的滚动容器
    const previewContainer = document.getElementById('wechat-preview')?.parentElement?.parentElement;
    if (previewContainer) {
      previewContainer.addEventListener('scroll', handleScroll);
      
      return () => {
        previewContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollSyncEnabled, onScroll]);

  const handleContentClick = (e: React.MouseEvent) => {
    if (!markdownContent) return;
    
    const target = e.target as HTMLElement;
    const editorSetSelection = (window as any).__editorSetSelection;
    
    if (!editorSetSelection) {
      console.warn('Editor selection method not available');
      return;
    }
    
    // 简化的点击处理逻辑，参考 Raphael Publish 的实现方式
    const handleElementClick = (element: HTMLElement): boolean => {
      // 专门处理图片元素
      if (element.tagName === 'IMG') {
        const src = element.getAttribute('src');
        if (src) {
          // 查找 Markdown 中的图片语法
          const regex = /!\[.*?\]\((.*?)\)/g;
          let match;
          while ((match = regex.exec(markdownContent)) !== null) {
            if (match[1] === src) {
              const start = match.index;
              const end = start + match[0].length;
              editorSetSelection(start, end);
              console.log('Selected image:', start, end, match[0]);
              return true;
            }
          }
          
          // 如果是 base64 图片，尝试匹配部分内容
          if (src.startsWith('data:image/')) {
            const base64Prefix = src.substring(0, 50);
            const regex = /!\[.*?\]\((data:image\/.*?)\)/g;
            let match;
            while ((match = regex.exec(markdownContent)) !== null) {
              if (match[1].startsWith(base64Prefix)) {
                const start = match.index;
                const end = start + match[0].length;
                editorSetSelection(start, end);
                console.log('Selected base64 image:', start, end, match[0]);
                return true;
              }
            }
          }
        }
        return false;
      }
      
      // 处理其他元素
      const text = element.textContent || '';
      const trimmedText = text.trim();
      
      if (!trimmedText) return false;
      
      // 基于文本内容在 Markdown 中查找对应位置
      // 这种方法更简单但更可靠
      const searchText = trimmedText.substring(0, 30); // 使用前30个字符进行搜索
      const index = markdownContent.indexOf(searchText);
      
      if (index !== -1) {
        // 找到文本位置后，尝试扩展选择范围
        let start = index;
        let end = index + searchText.length;
        
        // 向后扩展到行尾
        const nextLineBreak = markdownContent.indexOf('\n', end);
        if (nextLineBreak !== -1) {
          end = nextLineBreak;
        } else {
          end = markdownContent.length;
        }
        
        // 向前扩展到行首
        const prevLineBreak = markdownContent.lastIndexOf('\n', start);
        if (prevLineBreak !== -1) {
          start = prevLineBreak + 1;
        } else {
          start = 0;
        }
        
        // 对于列表项，确保包含列表标记
        const lineContent = markdownContent.substring(start, end).trim();
        if (lineContent.startsWith('- ') || lineContent.startsWith('* ') || /^\d+\. /.test(lineContent)) {
          // 已经是完整的列表项
        } else {
          // 尝试找到包含当前文本的完整行
          const lines = markdownContent.split('\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(searchText.substring(0, 20))) {
              const lineStart = markdownContent.indexOf(lines[i]);
              const lineEnd = lineStart + lines[i].length;
              start = lineStart;
              end = lineEnd;
              break;
            }
          }
        }
        
        editorSetSelection(start, end);
        console.log('Selected content:', start, end, markdownContent.substring(start, end));
        return true;
      }
      
      return false;
    };

    // 从点击目标向上查找可处理的元素
    let currentElement: HTMLElement | null = target;
    while (currentElement && currentElement !== contentRef.current) {
      if (handleElementClick(currentElement)) {
        return; // 找到并处理后立即返回
      }
      currentElement = currentElement.parentElement;
    }
    
    // 如果没有找到匹配的元素，尝试查找最近的元素
    if (contentRef.current) {
      const allElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, pre, table, blockquote, img');
      let closestElement: HTMLElement | null = null;
      let minDistance = Infinity;
      
      allElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const clickRect = target.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow((rect.left + rect.width / 2) - (clickRect.left + clickRect.width / 2), 2) +
          Math.pow((rect.top + rect.height / 2) - (clickRect.top + clickRect.height / 2), 2)
        );
        
        if (distance < minDistance) {
          minDistance = distance;
          closestElement = element as HTMLElement;
        }
      });
      
      if (closestElement) {
        console.log('Using closest element:', closestElement.tagName);
        handleElementClick(closestElement);
      }
    }
  };

  return (
    <div className={clsx(
      "flex flex-col h-full",
      isDark ? "bg-[#252525]" : "bg-gray-100"
    )}>
      <div className={clsx(
        "px-4 py-3 border-b text-sm font-medium",
        isDark 
          ? "bg-[#2d2d2d] border-gray-700 text-gray-300" 
          : "bg-white border-gray-200 text-gray-600"
      )}>
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
        ref={previewRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
      >
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <div className={clsx(
          "mx-auto bg-white shadow-sm rounded-lg p-6 md:p-8 min-h-full",
          viewMode === 'mobile' ? "max-w-[375px]" :
          viewMode === 'tablet' ? "max-w-[768px]" :
          "max-w-[960px]"
        )}>
          <div 
            ref={contentRef}
            id="wechat-preview"
            dangerouslySetInnerHTML={{ __html: html }}
            onClick={handleContentClick}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
