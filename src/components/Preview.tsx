import { clsx } from 'clsx';
import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

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
  const isScrolling = useRef(false);

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

  const handleScroll = () => {
    if (isScrolling.current || !scrollSyncEnabled || !onScroll || !previewRef.current) return;
    isScrolling.current = true;
    onScroll();
    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

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
      <div 
        ref={previewRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8"
        onScroll={handleScroll}
      >
        {themeCss && <style dangerouslySetInnerHTML={{ __html: themeCss }} />}
        <div className="max-w-[680px] mx-auto bg-white shadow-sm rounded-lg p-6 md:p-8 min-h-full">
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
