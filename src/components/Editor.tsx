import { clsx } from 'clsx';
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
  isDark: boolean;
  onScroll?: () => void;
  scrollSyncEnabled?: boolean;
}

export interface EditorRef {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  setSelection: (start: number, end: number) => void;
}

export const Editor = forwardRef<EditorRef, EditorProps>(({ content, onChange, isDark, onScroll, scrollSyncEnabled = false }, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isScrolling = useRef(false);

  useImperativeHandle(ref, () => ({
    get scrollTop() {
      return textareaRef.current?.scrollTop || 0;
    },
    set scrollTop(value: number) {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = value;
      }
    },
    get scrollHeight() {
      return textareaRef.current?.scrollHeight || 0;
    },
    get clientHeight() {
      return textareaRef.current?.clientHeight || 0;
    },
    setSelection: (start: number, end: number) => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, end);
      }
    }
  }));

  const handleScroll = () => {
    if (isScrolling.current || !scrollSyncEnabled || !onScroll || !textareaRef.current) return;
    isScrolling.current = true;
    onScroll();
    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const clipboardData = e.clipboardData || (window as any).clipboardData;
    
    // 检查是否有图片
    const items = clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleImagePaste(file);
            return;
          }
        }
      }
    }

    // 检查是否有富文本
    const html = clipboardData?.getData('text/html');
    if (html) {
      e.preventDefault();
      handleRichTextPaste(html);
      return;
    }

    // 普通文本直接粘贴
  };

  const handleImagePaste = (file: File) => {
    // 创建图片URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      if (imageUrl && textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const newContent = content.substring(0, start) + `![Image](${imageUrl})` + content.substring(end);
        onChange(newContent);
        
        // 聚焦并设置光标位置
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            const newPosition = start + `![Image](${imageUrl})`.length;
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRichTextPaste = (html: string) => {
    // 创建临时DOM元素来解析HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // 清洗和转换为Markdown
    const markdown = convertHtmlToMarkdown(tempDiv);
    
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const newContent = content.substring(0, start) + markdown + content.substring(end);
      onChange(newContent);
      
      // 聚焦并设置光标位置
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = start + markdown.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };

  const convertHtmlToMarkdown = (element: HTMLElement): string => {
    let markdown = '';
    
    // 处理子元素
    Array.from(element.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        switch (child.tagName.toLowerCase()) {
          case 'h1':
            markdown += `# ${child.textContent?.trim()}\n\n`;
            break;
          case 'h2':
            markdown += `## ${child.textContent?.trim()}\n\n`;
            break;
          case 'h3':
            markdown += `### ${child.textContent?.trim()}\n\n`;
            break;
          case 'h4':
            markdown += `#### ${child.textContent?.trim()}\n\n`;
            break;
          case 'h5':
            markdown += `##### ${child.textContent?.trim()}\n\n`;
            break;
          case 'h6':
            markdown += `###### ${child.textContent?.trim()}\n\n`;
            break;
          case 'p':
            markdown += `${processInlineElements(child)}\n\n`;
            break;
          case 'ul':
            markdown += processList(child, '- ');
            break;
          case 'ol':
            markdown += processList(child, (index) => `${index + 1}. `);
            break;
          case 'pre':
            const codeElement = child.querySelector('code');
            const codeText = codeElement?.textContent || child.textContent;
            markdown += `\`\`\`\n${codeText?.trim()}\n\`\`\`\n\n`;
            break;
          case 'blockquote':
            const quoteText = child.textContent?.trim() || '';
            const quoteLines = quoteText.split('\n');
            quoteLines.forEach(line => {
              markdown += `> ${line.trim()}\n`;
            });
            markdown += '\n';
            break;
          case 'img':
            const src = child.getAttribute('src');
            const alt = child.getAttribute('alt') || 'Image';
            if (src) {
              markdown += `![${alt}](${src})\n\n`;
            }
            break;
          default:
            // 处理其他元素
            markdown += processInlineElements(child);
            break;
        }
      }
    });
    
    // 处理纯文本节点
    if (!element.children.length && element.textContent) {
      markdown += element.textContent.trim() + '\n\n';
    }
    
    return markdown.trim();
  };

  const processInlineElements = (element: HTMLElement): string => {
    let text = '';
    
    Array.from(element.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        text += node.textContent || '';
      } else if (node instanceof HTMLElement) {
        switch (node.tagName.toLowerCase()) {
          case 'strong':
          case 'b':
            text += `**${processInlineElements(node)}**`;
            break;
          case 'em':
          case 'i':
            text += `*${processInlineElements(node)}*`;
            break;
          case 'a':
            const href = node.getAttribute('href');
            const linkText = processInlineElements(node);
            if (href) {
              text += `[${linkText}](${href})`;
            } else {
              text += linkText;
            }
            break;
          case 'code':
            text += `\`${node.textContent || ''}\``;
            break;
          default:
            text += processInlineElements(node);
            break;
        }
      }
    });
    
    return text;
  };

  const processList = (listElement: HTMLElement, bullet: string | ((index: number) => string)): string => {
    let markdown = '';
    const listItems = listElement.querySelectorAll('li');
    
    listItems.forEach((item, index) => {
      const bulletText = typeof bullet === 'function' ? bullet(index) : bullet;
      const itemContent = processInlineElements(item as HTMLElement);
      markdown += `${bulletText}${itemContent.trim()}\n`;
      
      // 处理嵌套列表
      const nestedLists = item.querySelectorAll('ul, ol');
      nestedLists.forEach((nestedList) => {
        const nestedBullet = nestedList.tagName.toLowerCase() === 'ul' ? '  - ' : (i: number) => `  ${i + 1}. `;
        markdown += processList(nestedList as HTMLElement, nestedBullet);
      });
    });
    
    markdown += '\n';
    return markdown;
  };

  // 暴露setSelection方法到window对象，供Preview组件使用
  useEffect(() => {
    (window as any).__editorSetSelection = (start: number, end: number) => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, end);
      }
    };
    return () => {
      delete (window as any).__editorSetSelection;
    };
  }, []);

  return (
    <div className={clsx(
      "flex flex-col h-full",
      isDark ? "bg-[#1e1e1e]" : "bg-gray-50"
    )}>
      <div className={clsx(
        "px-4 py-3 border-b text-sm font-medium",
        isDark 
          ? "bg-[#2d2d2d] border-gray-700 text-gray-300" 
          : "bg-white border-gray-200 text-gray-600"
      )}>
        Markdown 编辑区
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onPaste={handlePaste}
        className={clsx(
          "flex-1 w-full p-4 resize-none outline-none font-mono text-sm leading-relaxed",
          isDark 
            ? "bg-[#1e1e1e] text-gray-100 placeholder-gray-600" 
            : "bg-gray-50 text-gray-800 placeholder-gray-400"
        )}
        placeholder="在这里输入 Markdown 内容..."
        spellCheck={false}
      />
    </div>
  );
});

Editor.displayName = 'Editor';
