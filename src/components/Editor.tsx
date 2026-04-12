import { clsx } from 'clsx';
import { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

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
  const [showMermaidMenu, setShowMermaidMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 插入 Markdown 语法
  const insertMarkdown = (before: string, after: string = before) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + before + selectedText + after + content.substring(end);
      onChange(newContent);
      
      // 聚焦并设置光标位置
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = start + before.length + selectedText.length;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
        }
      }, 0);
    }
  };
  
  // 插入链接
  const insertLink = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = content.substring(start, end) || '链接文本';
      const linkUrl = prompt('请输入链接地址:', 'https://');
      
      if (linkUrl) {
        const newContent = content.substring(0, start) + `[${selectedText}](${linkUrl})` + content.substring(end);
        onChange(newContent);
        
        // 聚焦并设置光标位置
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            const newPosition = start + `[${selectedText}](${linkUrl})`.length;
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    }
  };
  
  // 插入图片
  const insertImage = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const altText = content.substring(start, end) || '图片描述';
      const imageUrl = prompt('请输入图片地址:', 'https://');
      
      if (imageUrl) {
        const newContent = content.substring(0, start) + `![${altText}](${imageUrl})` + content.substring(end);
        onChange(newContent);
        
        // 聚焦并设置光标位置
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            const newPosition = start + `![${altText}](${imageUrl})`.length;
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    }
  };
  
  // 插入代码块
  const insertCodeBlock = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = content.substring(start, end);
      const newContent = content.substring(0, start) + '```\n' + selectedText + '\n```' + content.substring(end);
      onChange(newContent);
      
      // 聚焦并设置光标位置
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = start + 4; // 跳过 ```\n
          textareaRef.current.setSelectionRange(newPosition, newPosition + selectedText.length);
        }
      }, 0);
    }
  };
  
  // 插入 Mermaid 图表
  const insertMermaid = (type: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      let mermaidCode = '';
      switch (type) {
        case 'flowchart':
          mermaidCode = `graph TD\n  A[开始] --> B[处理]\n  B --> C[结束]`;
          break;
        case 'sequence':
          mermaidCode = `sequenceDiagram\n  participant A as 客户端\n  participant B as 服务器\n  A->>B: 发送请求\n  B-->>A: 返回响应`;
          break;
        case 'gantt':
          mermaidCode = `gantt\n  title 项目计划\n  section 任务\n  任务1: active, 2024-01-01, 30d\n  任务2: 2024-02-01, 30d`;
          break;
        case 'class':
          mermaidCode = `classDiagram\n  class Person {\n    +string name\n    +int age\n    +void sayHello()\n  }`;
          break;
        case 'pie':
          mermaidCode = `pie\n  title 饼图示例\n  "A": 30\n  "B": 70`;
          break;
        case 'state':
          mermaidCode = `stateDiagram\n  [*] --> 状态1\n  状态1 --> 状态2\n  状态2 --> [*]`;
          break;
        case 'er':
          mermaidCode = `erDiagram\n  CUSTOMER ||--o{ ORDER : places\n  ORDER ||--|{ LINE-ITEM : contains\n  CUSTOMER }|--|{ DELIVERY-ADDRESS : uses`;
          break;
        case 'user-journey':
          mermaidCode = `journey\n  title 用户旅程\n  section 开始\n    A: 开始使用\n  section 过程\n    B: 浏览内容\n    C: 互动\n  section 结束\n    D: 完成`;
          break;
        default:
          mermaidCode = `graph TD\n  A[开始] --> B[处理]\n  B --> C[结束]`;
      }
      
      const newContent = content.substring(0, start) + '```mermaid\n' + mermaidCode + '\n```' + content.substring(end);
      onChange(newContent);
      
      // 聚焦并设置光标位置
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          const newPosition = start + 11; // 跳过 ```mermaid\n
          textareaRef.current.setSelectionRange(newPosition, newPosition + mermaidCode.length);
        }
      }, 0);
    }
  };

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

  // 使用useEffect添加滚动监听器
  useEffect(() => {
    // 直接在textarea元素上添加滚动事件监听器
    const handleScroll = () => {
      if (scrollSyncEnabled && onScroll) {
        onScroll();
      }
    };
    
    // 查找textarea元素
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);
      
      return () => {
        textarea.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollSyncEnabled, onScroll]);

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

  // 模拟实时保存
  useEffect(() => {
    setLastSaved(new Date());
  }, [content]);

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
      
      {/* 编辑工具栏 */}
      <div className={clsx(
        "flex items-center px-4 py-2 border-b",
        isDark 
          ? "bg-[#252525] border-gray-700" 
          : "bg-white border-gray-200"
      )}>
        <button 
          onClick={() => insertMarkdown('**', '**')}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="粗体"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bold" aria-hidden="true"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"></path></svg>
        </button>
        <button 
          onClick={() => insertMarkdown('*', '*')}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="斜体"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-italic" aria-hidden="true"><line x1="19" y1="4" x2="10" y2="4"></line><line x1="14" y1="20" x2="5" y2="20"></line><line x1="15" y1="4" x2="9" y2="20"></line></svg>
        </button>
        <button 
          onClick={() => insertMarkdown('~~', '~~')}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="删除线"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-strikethrough" aria-hidden="true"><path d="M16 4H9a3 3 0 0 0-2.83 4"></path><path d="M14 12a4 4 0 0 1 0 8H6"></path><line x1="4" x2="20" y1="12" y2="12"></line></svg>
        </button>
        <button 
          onClick={() => insertMarkdown('# ')}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="标题"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heading" aria-hidden="true"><path d="M6 12h12"></path><path d="M6 20V4"></path><path d="M18 20V4"></path></svg>
        </button>
        <div className="relative mx-1">
          <button 
            onClick={() => setShowListMenu(!showListMenu)}
            className={clsx(
              "px-2 py-1 rounded",
              isDark 
                ? "hover:bg-[#374151] text-gray-300" 
                : "hover:bg-gray-100 text-gray-600"
            )}
            title="列表"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
          </button>
          <div className={clsx(
            "absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md z-10",
            showListMenu ? 'block' : 'hidden',
            isDark 
              ? "bg-[#2d2d2d] shadow-gray-700" 
              : "bg-white shadow-gray-200"
          )}>
            <div className="p-2">
              <div className="font-medium mb-2" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>列表类型</div>
              <div className="grid grid-cols-1 gap-1">
                <button 
                  onClick={() => {
                    insertMarkdown('- ');
                    setShowListMenu(false);
                  }}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  无序列表
                </button>
                <button 
                  onClick={() => {
                    insertMarkdown('1. ');
                    setShowListMenu(false);
                  }}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  有序列表
                </button>
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={() => insertMarkdown('> ')}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="引用"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-quote" aria-hidden="true"><path d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path><path d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"></path></svg>
        </button>
        <button 
          onClick={insertLink}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="链接"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        </button>
        <button 
          onClick={() => insertMarkdown('---')}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="分割线"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus" aria-hidden="true"><path d="M5 12h14"></path></svg>
        </button>
        <button 
          onClick={insertImage}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="图片"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
        </button>
        <button 
          onClick={insertCodeBlock}
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="代码块"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-code" aria-hidden="true"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        </button>
        <div className="relative mx-1">
          <button 
            onClick={() => setShowMermaidMenu(!showMermaidMenu)}
            className={clsx(
              "px-2 py-1 rounded",
              isDark 
                ? "hover:bg-[#374151] text-gray-300" 
                : "hover:bg-gray-100 text-gray-600"
            )}
            title="图表"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chart-bar" aria-hidden="true"><line x1="12" y1="20" x2="12" y2="10"></line><line x1="18" y1="20" x2="18" y2="4"></line><line x1="6" y1="20" x2="6" y2="16"></line></svg>
          </button>
          <div className={clsx(
            "absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md z-10",
            showMermaidMenu ? 'block' : 'hidden',
            isDark 
              ? "bg-[#2d2d2d] shadow-gray-700" 
              : "bg-white shadow-gray-200"
          )}>
            <div className="p-2">
              <div className="font-medium mb-2" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>图表类型</div>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  onClick={() => insertMermaid('flowchart')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  流程图
                </button>
                <button 
                  onClick={() => insertMermaid('sequence')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  时序图
                </button>
                <button 
                  onClick={() => insertMermaid('gantt')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  甘特图
                </button>
                <button 
                  onClick={() => insertMermaid('class')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  类图
                </button>
                <button 
                  onClick={() => insertMermaid('pie')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  饼图
                </button>
                <button 
                  onClick={() => insertMermaid('state')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  状态图
                </button>
                <button 
                  onClick={() => insertMermaid('er')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  ER图
                </button>
                <button 
                  onClick={() => insertMermaid('user-journey')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  用户旅程
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-1">
          <button 
            onClick={() => setShowTableMenu(!showTableMenu)}
            className={clsx(
              "px-2 py-1 rounded",
              isDark 
                ? "hover:bg-[#374151] text-gray-300" 
                : "hover:bg-gray-100 text-gray-600"
            )}
            title="表格"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-table" aria-hidden="true"><path d="M12 3v18"></path><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path></svg>
          </button>
          <div className={clsx(
            "absolute left-0 top-full mt-1 w-48 bg-white shadow-lg rounded-md z-10",
            showTableMenu ? 'block' : 'hidden',
            isDark 
              ? "bg-[#2d2d2d] shadow-gray-700" 
              : "bg-white shadow-gray-200"
          )}>
            <div className="p-2">
              <div className="font-medium mb-2" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>表格类型</div>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  onClick={() => insertMarkdown('| 列1 | 列2 |\n| --- | --- |\n| 内容1 | 内容2 |')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  2列表格
                </button>
                <button 
                  onClick={() => insertMarkdown('| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容1 | 内容2 | 内容3 |')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  3列表格
                </button>
                <button 
                  onClick={() => insertMarkdown('| 列1 | 列2 | 列3 | 列4 |\n| --- | --- | --- | --- |\n| 内容1 | 内容2 | 内容3 | 内容4 |')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  4列表格
                </button>
                <button 
                  onClick={() => insertMarkdown('| 标题 | 内容 |\n| --- | --- |\n| 项目1 | 描述1 |\n| 项目2 | 描述2 |\n| 项目3 | 描述3 |')}
                  className={clsx(
                    "px-2 py-1 text-left rounded",
                    isDark 
                      ? "hover:bg-[#3c3c3c] text-gray-300" 
                      : "hover:bg-gray-100 text-gray-600"
                  )}
                >
                  项目表格
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="relative mx-1">
          <button 
            onClick={() => setShowIconMenu(!showIconMenu)}
            className={clsx(
              "px-2 py-1 rounded",
              isDark 
                ? "hover:bg-[#374151] text-gray-300" 
                : "hover:bg-gray-100 text-gray-600"
            )}
            title="图标"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
          </button>
          <div className={clsx(
            "absolute left-0 top-full mt-1 w-64 bg-white shadow-lg rounded-md z-10",
            showIconMenu ? 'block' : 'hidden',
            isDark 
              ? "bg-[#2d2d2d] shadow-gray-700" 
              : "bg-white shadow-gray-200"
          )}>
            <div className="p-2">
              <div className="font-medium mb-2" style={{ color: isDark ? '#e5e7eb' : '#374151' }}>常用图标</div>
              <div className="grid grid-cols-6 gap-2">
                {['✅', '❌', '⚠️', 'ℹ️', '⭐', '🔥', '💡', '🎉', '📌', '🔗', '📊', '📈', '📋', '📁', '📄', '📧', '📱', '💻', '🌐', '🚀'].map((icon) => (
                  <button 
                    key={icon}
                    onClick={() => insertMarkdown(icon)}
                    className={clsx(
                      "px-2 py-1 rounded text-center",
                      isDark 
                        ? "hover:bg-[#374151] text-gray-300" 
                        : "hover:bg-gray-100 text-gray-600"
                    )}
                    title={icon}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <button 
          className={clsx(
            "px-2 py-1 mx-1 rounded",
            isDark 
              ? "hover:bg-[#3c3c3c] text-gray-300" 
              : "hover:bg-gray-100 text-gray-600"
          )}
          title="帮助"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-help-circle" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><path d="M12 17h.01"></path></svg>
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          setIsEditing(true);
          onChange(e.target.value);
          
          // 清除之前的超时
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }
          
          // 300毫秒后模拟保存完成
          saveTimeoutRef.current = setTimeout(() => {
            setIsEditing(false);
            setLastSaved(new Date());
          }, 300);
        }}
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
      
      {/* 行数、字数和保存状态显示 */}
      <div className={clsx(
        "px-4 py-2 text-xs flex justify-between items-center",
        isDark 
          ? "bg-[#252525] text-gray-400" 
          : "bg-white text-gray-500"
      )}>
        <div className="flex items-center">
          行数: {content.split('\n').length}
          <span className={clsx(
            "mx-2",
            isDark ? "text-gray-600" : "text-gray-300"
          )}>•</span>
          字数: {content.length}
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ 
            backgroundColor: isEditing ? '#f59e0b' : (lastSaved ? '#07c160' : '#9ca3af'),
            animation: isEditing ? 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none'
          }}></span>
          {isEditing ? '编辑中' : (lastSaved ? '已保存' : '未保存')}
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
});

Editor.displayName = 'Editor';
