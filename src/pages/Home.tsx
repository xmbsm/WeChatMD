import { useState, useCallback, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../hooks/useTheme';
import { useMarkdown } from '../hooks/useMarkdown';
import { Toolbar } from '../components/Toolbar';
import { Editor, EditorRef } from '../components/Editor';
import { Preview, PreviewRef } from '../components/Preview';
import { Toast } from '../components/Toast';
import { TemplateModal } from '../components/TemplateModal';
import { ThemeManager } from '../components/ThemeManager';
import { SettingsPanel } from '../components/SettingsPanel';
import { Sidebar } from '../components/Sidebar';
import { copyRichText, downloadHtml, downloadPdf, uploadMarkdownFile, downloadMarkdown } from '../utils/copyHtml';
import { Article, loadArticles, saveArticles, createArticle, updateArticle, deleteArticle } from '../utils/articles';

export default function Home() {
  const { theme, toggleTheme, isDark } = useTheme();
  const { 
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
  } = useMarkdown();
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [themeManagerOpen, setThemeManagerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
  const isSyncingScroll = useRef(false);
  const editorRef = useRef<EditorRef>(null);
  const previewRef = useRef<PreviewRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  // 文章管理状态
  const [articles, setArticles] = useState<Article[]>(() => loadArticles());
  const [currentArticleId, setCurrentArticleId] = useState<string>(() => {
    const savedArticles = loadArticles();
    return savedArticles.length > 0 ? savedArticles[0].id : createArticle().id;
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 初始化文章
  useEffect(() => {
    if (articles.length === 0) {
      const newArticle = createArticle();
      const initialArticles = [newArticle];
      setArticles(initialArticles);
      setCurrentArticleId(newArticle.id);
      saveArticles(initialArticles);
    }
  }, []);

  // 当内容或主题变化时，更新当前文章
  useEffect(() => {
    const currentArticle = articles.find(a => a.id === currentArticleId);
    if (currentArticle && (currentArticle.content !== content || currentArticle.themeId !== currentThemeId)) {
      const updatedArticles = updateArticle(articles, currentArticleId, {
        content,
        themeId: currentThemeId
      });
      setArticles(updatedArticles);
      saveArticles(updatedArticles);
    }
  }, [content, currentThemeId, currentArticleId, articles]);

  // 文章管理函数
  const handleSelectArticle = useCallback((article: Article) => {
    setCurrentArticleId(article.id);
    updateContent(article.content);
    setCurrentTheme(article.themeId);
  }, [updateContent, setCurrentTheme]);

  const handleNewArticle = useCallback(() => {
    const newArticle = createArticle('新文章', currentThemeId);
    const updatedArticles = [newArticle, ...articles];
    setArticles(updatedArticles);
    setCurrentArticleId(newArticle.id);
    updateContent('');
    saveArticles(updatedArticles);
    showToast('新文章已创建！');
  }, [articles, currentThemeId, updateContent, showToast]);

  const handleDeleteArticle = useCallback((articleId: string) => {
    const articleIndex = articles.findIndex(a => a.id === articleId);
    const updatedArticles = deleteArticle(articles, articleId);
    
    if (updatedArticles.length > 0) {
      setArticles(updatedArticles);
      
      // 如果删除的是当前文章，切换到第一文章
      if (articleId === currentArticleId) {
        const newCurrentArticle = updatedArticles[0];
        setCurrentArticleId(newCurrentArticle.id);
        updateContent(newCurrentArticle.content);
        setCurrentTheme(newCurrentArticle.themeId);
      }
      
      saveArticles(updatedArticles);
      showToast('文章已删除！');
    } else {
      // 如果删除最后一篇文章，创建新文章
      const newArticle = createArticle();
      const initialArticles = [newArticle];
      setArticles(initialArticles);
      setCurrentArticleId(newArticle.id);
      updateContent('');
      setCurrentTheme('default');
      saveArticles(initialArticles);
      showToast('文章已删除！');
    }
  }, [articles, currentArticleId, updateContent, setCurrentTheme, showToast]);

  const handleRenameArticle = useCallback((articleId: string, newTitle: string) => {
    const updatedArticles = articles.map(article => {
      if (article.id === articleId) {
        return {
          ...article,
          title: newTitle,
          updatedAt: Date.now()
        };
      }
      return article;
    });
    setArticles(updatedArticles);
    saveArticles(updatedArticles);
    showToast('文章已重命名！');
  }, [articles, showToast]);

  const handleReorderArticles = useCallback((newArticles: Article[]) => {
    setArticles(newArticles);
    saveArticles(newArticles);
  }, []);

  const handleCopyTitle = useCallback((title: string) => {
    console.log('Attempting to copy title:', title);
    if (!title) {
      showToast('标题为空，无法复制');
      return;
    }
    
    // 尝试使用现代剪贴板 API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(title).then(() => {
        console.log('Title copied successfully:', title);
        showToast('标题已复制到剪贴板！');
      }).catch(err => {
        console.error('Failed to copy title with clipboard API:', err);
        // 回退到传统方法
        fallbackCopyTextToClipboard(title);
      });
    } else {
      // 回退到传统方法
      fallbackCopyTextToClipboard(title);
    }
  }, [showToast]);

  // 从 Markdown 内容中提取标题
  const extractTitleFromContent = (content: string): string => {
    // 首先尝试从文章对象中获取标题
    const currentArticle = articles.find(a => a.id === currentArticleId);
    if (currentArticle && currentArticle.title && currentArticle.title !== '新文章') {
      return currentArticle.title;
    }
    
    // 如果文章标题不存在或为默认值，从 Markdown 内容中提取
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      return titleMatch[1].trim();
    }
    
    // 默认标题
    return 'wechat-article';
  };

  // 传统复制方法作为回退
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 确保文本区域不可见
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        console.log('Title copied with fallback method:', text);
        showToast('标题已复制到剪贴板！');
      } else {
        console.error('Fallback copy failed');
        showToast('复制失败，请重试');
      }
    } catch (err) {
      console.error('Fallback copy error:', err);
      showToast('复制失败，请重试');
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleCopy = useCallback(async () => {
    const success = await copyRichText(html, getCurrentTheme().css);
    if (success) {
      showToast('已复制到剪贴板！');
    } else {
      showToast('复制失败，请重试');
    }
  }, [html, getCurrentTheme, showToast]);

  const handleDownloadHtml = useCallback(async () => {
    const title = extractTitleFromContent(content);
    await downloadHtml(html, `${title}.html`, getCurrentTheme().css);
    showToast('HTML 下载成功！');
  }, [html, content, getCurrentTheme, showToast, extractTitleFromContent]);

  const handleDownloadPdf = useCallback(async () => {
    try {
      const title = extractTitleFromContent(content);
      await downloadPdf(html, `${title}.pdf`, getCurrentTheme().css);
      showToast('PDF 下载成功！');
    } catch (err) {
      console.error('PDF download failed:', err);
      showToast('PDF 下载失败，请重试');
    }
  }, [html, content, getCurrentTheme, showToast, extractTitleFromContent]);

  const handleDownloadMarkdown = useCallback(() => {
    const title = extractTitleFromContent(content);
    downloadMarkdown(content, `${title}.md`);
    showToast('Markdown 下载成功！');
  }, [content, showToast, extractTitleFromContent]);

  const handleUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const content = await uploadMarkdownFile(file);
        updateContent(content);
        showToast('文件上传成功！');
      } catch (err) {
        console.error('File upload failed:', err);
        showToast('文件上传失败，请重试');
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [updateContent, showToast]);

  const handleSelectTemplate = useCallback((templateContent: string) => {
    updateContent(templateContent);
    showToast('模板应用成功！');
  }, [updateContent, showToast]);

  const handleSelectTheme = useCallback((themeId: string) => {
    setCurrentTheme(themeId);
    showToast('主题应用成功！');
  }, [setCurrentTheme, showToast]);

  const handleToggleScrollSync = useCallback(() => {
    setScrollSyncEnabled(!scrollSyncEnabled);
    showToast(scrollSyncEnabled ? '滚动同步已关闭' : '滚动同步已开启');
  }, [scrollSyncEnabled, showToast]);



  // 同步编辑器到预览器
  const syncEditorToPreview = () => {
    if (!scrollSyncEnabled) return;
    if (isSyncingScroll.current) return;
    if (!editorRef.current || !previewRef.current) return;
    
    isSyncingScroll.current = true;
    
    try {
      const editor = editorRef.current;
      const preview = previewRef.current;
      
      const editorMaxScroll = editor.scrollHeight - editor.clientHeight;
      const previewMaxScroll = preview.scrollHeight - preview.clientHeight;
      
      if (editorMaxScroll > 0 && previewMaxScroll > 0) {
        const ratio = editor.scrollTop / editorMaxScroll;
        preview.scrollTop = ratio * previewMaxScroll;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        isSyncingScroll.current = false;
      }, 50);
    }
  };

  // 同步预览器到编辑器
  const syncPreviewToEditor = () => {
    if (!scrollSyncEnabled) return;
    if (isSyncingScroll.current) return;
    if (!editorRef.current || !previewRef.current) {
      console.log('SyncPreviewToEditor: Missing refs:', !editorRef.current, !previewRef.current);
      return;
    }
    
    console.log('SyncPreviewToEditor called');
    isSyncingScroll.current = true;
    
    try {
      const editor = editorRef.current;
      const preview = previewRef.current;
      
      console.log('Preview scroll data:', preview.scrollTop, preview.scrollHeight, preview.clientHeight);
      console.log('Editor scroll data:', editor.scrollTop, editor.scrollHeight, editor.clientHeight);
      
      const editorMaxScroll = editor.scrollHeight - editor.clientHeight;
      const previewMaxScroll = preview.scrollHeight - preview.clientHeight;
      
      console.log('Max scroll values:', editorMaxScroll, previewMaxScroll);
      
      if (editorMaxScroll > 0 && previewMaxScroll > 0) {
        const ratio = preview.scrollTop / previewMaxScroll;
        const newEditorScrollTop = ratio * editorMaxScroll;
        console.log('Calculated new editor scroll top:', newEditorScrollTop);
        editor.scrollTop = newEditorScrollTop;
      }
    } catch (e) {
      console.error('Error in syncPreviewToEditor:', e);
    } finally {
      setTimeout(() => {
        isSyncingScroll.current = false;
      }, 50);
    }
  };

  // 使用 useEffect 添加滚动监听器，直接操作 DOM 元素
  useEffect(() => {
    // 等待组件完全渲染
    setTimeout(() => {
      // 找到编辑器元素
      const editor = document.querySelector('textarea');
      // 找到预览器的滚动容器
      const preview = document.querySelector('.flex-1.overflow-y-auto:nth-child(2)');
      
      if (editor && preview) {
        // 编辑器滚动同步到预览器
        const handleEditorScroll = () => {
          if (!scrollSyncEnabled) return;
          if (isSyncingScroll.current) return;
          
          isSyncingScroll.current = true;
          
          const editorRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
          const previewScrollTop = editorRatio * (preview.scrollHeight - preview.clientHeight);
          preview.scrollTop = previewScrollTop;
          
          setTimeout(() => {
            isSyncingScroll.current = false;
          }, 50);
        };
        
        // 预览器滚动同步到编辑器
        const handlePreviewScroll = () => {
          if (!scrollSyncEnabled) return;
          if (isSyncingScroll.current) return;
          
          isSyncingScroll.current = true;
          
          const previewRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
          const editorScrollTop = previewRatio * (editor.scrollHeight - editor.clientHeight);
          editor.scrollTop = editorScrollTop;
          
          setTimeout(() => {
            isSyncingScroll.current = false;
          }, 50);
        };
        
        // 添加滚动监听器
        editor.addEventListener('scroll', handleEditorScroll);
        preview.addEventListener('scroll', handlePreviewScroll);
        
        // 清理函数
        return () => {
          editor.removeEventListener('scroll', handleEditorScroll);
          preview.removeEventListener('scroll', handlePreviewScroll);
        };
      }
    }, 100);
  }, [scrollSyncEnabled]);

  return (
    <div className={clsx("flex flex-col h-screen w-full overflow-hidden", isDark && "dark")}>
      {/* 顶部工具栏 - 通栏显示 */}
      <Toolbar
        onClear={clearContent}
        onCopy={handleCopy}
        onDownloadHtml={handleDownloadHtml}
        onDownloadPdf={handleDownloadPdf}
        onDownloadMarkdown={handleDownloadMarkdown}
        onUpload={handleUpload}
        onOpenTemplates={() => setTemplateModalOpen(true)}
        onOpenThemes={() => setThemeManagerOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        scrollSyncEnabled={scrollSyncEnabled}
        onToggleScrollSync={handleToggleScrollSync}
      />

      {/* 主内容区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧栏 - 仅在桌面端显示 */}
        <div className="hidden md:block h-full">
          <Sidebar
            articles={articles}
            currentArticleId={currentArticleId}
            onSelectArticle={handleSelectArticle}
            onNewArticle={handleNewArticle}
            onDeleteArticle={handleDeleteArticle}
            onRenameArticle={handleRenameArticle}
            onCopyTitle={handleCopyTitle}
            onReorderArticles={handleReorderArticles}
            isDark={isDark}
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            themes={[...builtInThemes, ...customThemes]}
            showCloseButton={true}
          />
        </div>

        {/* 编辑和预览区域 */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* 移动端标签切换 */}
          <div className="md:hidden flex border-b" style={{ 
            borderColor: isDark ? '#374151' : '#e5e7eb',
            backgroundColor: isDark ? 'rgb(45 45 45)' : 'white'
          }}>
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'history' ? 'border-b-2 font-medium' : ''}`}
              style={{
                borderColor: activeTab === 'history' ? 'rgb(7 193 96)' : 'transparent',
                backgroundColor: activeTab === 'history' ? (isDark ? 'rgb(45 45 45)' : 'rgb(232 247 239)') : 'transparent',
                color: activeTab === 'history' ? 'rgb(7 193 96)' : (isDark ? '#9ca3af' : '#6b7280')
              }}
              onClick={() => setActiveTab('history')}
            >
              历史
            </button>
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'editor' ? 'border-b-2 font-medium' : ''}`}
              style={{
                borderColor: activeTab === 'editor' ? 'rgb(7 193 96)' : 'transparent',
                backgroundColor: activeTab === 'editor' ? (isDark ? 'rgb(45 45 45)' : 'rgb(232 247 239)') : 'transparent',
                color: activeTab === 'editor' ? 'rgb(7 193 96)' : (isDark ? '#9ca3af' : '#6b7280')
              }}
              onClick={() => setActiveTab('editor')}
            >
              编辑
            </button>
            <button
              className={`flex-1 py-3 text-center ${activeTab === 'preview' ? 'border-b-2 font-medium' : ''}`}
              style={{
                borderColor: activeTab === 'preview' ? 'rgb(7 193 96)' : 'transparent',
                backgroundColor: activeTab === 'preview' ? (isDark ? 'rgb(45 45 45)' : 'rgb(232 247 239)') : 'transparent',
                color: activeTab === 'preview' ? 'rgb(7 193 96)' : (isDark ? '#9ca3af' : '#6b7280')
              }}
              onClick={() => setActiveTab('preview')}
            >
              预览
            </button>
          </div>
          
          {/* 桌面端双栏布局 */}
          <div className="hidden md:flex flex-1 overflow-hidden">
            <div className="w-1/2 h-full border-r" style={{ 
              borderColor: isDark ? '#374151' : '#e5e7eb' 
            }}>
              <Editor 
                ref={editorRef}
                content={content} 
                onChange={updateContent} 
                isDark={isDark}
                scrollSyncEnabled={scrollSyncEnabled}
                onScroll={syncEditorToPreview}
              />
            </div>
            <div className="w-1/2 h-full">
              <Preview 
                ref={previewRef}
                html={html} 
                isDark={isDark} 
                themeCss={getCurrentTheme().css}
                markdownContent={content}
                scrollSyncEnabled={scrollSyncEnabled}
                onScroll={syncPreviewToEditor}
              />
            </div>
          </div>
          
          {/* 移动端单栏布局 */}
          <div className="md:hidden flex-1 overflow-hidden">
            {activeTab === 'editor' && (
              <Editor 
                ref={editorRef}
                content={content} 
                onChange={updateContent} 
                isDark={isDark}
                scrollSyncEnabled={false}
              />
            )}
            {activeTab === 'preview' && (
              <Preview 
                ref={previewRef}
                html={html} 
                isDark={isDark} 
                themeCss={getCurrentTheme().css}
                markdownContent={content}
                scrollSyncEnabled={false}
              />
            )}
            {activeTab === 'history' && (
              <div className="w-full h-full">
                <Sidebar
                  articles={articles}
                  currentArticleId={currentArticleId}
                  onSelectArticle={handleSelectArticle}
                  onNewArticle={handleNewArticle}
                  onDeleteArticle={handleDeleteArticle}
                  onRenameArticle={handleRenameArticle}
                  onCopyTitle={handleCopyTitle}
                  onReorderArticles={handleReorderArticles}
                  isDark={isDark}
                  isCollapsed={false}
                  onToggleCollapse={() => {}}
                  themes={[...builtInThemes, ...customThemes]}
                  showCloseButton={false}
                  width="100%"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Toast
        message={toastMessage}
        isVisible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      
      <TemplateModal
        isOpen={templateModalOpen}
        onClose={() => setTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        isDark={isDark}
      />
      
      <ThemeManager
        isOpen={themeManagerOpen}
        onClose={() => setThemeManagerOpen(false)}
        onSelectTheme={handleSelectTheme}
        currentThemeId={currentThemeId}
        customThemes={customThemes}
        builtInThemes={builtInThemes}
        onAddCustomTheme={addCustomTheme}
        onUpdateCustomTheme={updateCustomTheme}
        onDeleteCustomTheme={deleteCustomTheme}
        currentContent={content}
        isDark={isDark}
      />
      
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        isDark={isDark}
      />
      
      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        /* 滚动条样式 - 细型浅色 */
        ::-webkit-scrollbar {
          width: 2px;
          height: 2px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(229, 231, 235, 0.2);
          border-radius: 1px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.2);
          border-radius: 1px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.3);
        }
        /* 深色模式下的滚动条 */
        .dark ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.2);
        }
        .dark ::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.2);
        }
        .dark ::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.3);
        }
      `}</style>
    </div>
  );
}
