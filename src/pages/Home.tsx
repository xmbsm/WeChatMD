import { useState, useCallback, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useMarkdown } from '../hooks/useMarkdown';
import { Toolbar } from '../components/Toolbar';
import { Editor, EditorRef } from '../components/Editor';
import { Preview, PreviewRef } from '../components/Preview';
import { Toast } from '../components/Toast';
import { TemplateModal } from '../components/TemplateModal';
import { ThemeManager } from '../components/ThemeManager';
import { copyRichText, downloadHtml, downloadPdf, uploadMarkdownFile } from '../utils/copyHtml';

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
  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const isSyncingScroll = useRef(false);
  const editorRef = useRef<EditorRef>(null);
  const previewRef = useRef<PreviewRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  }, []);

  const handleCopy = useCallback(async () => {
    const success = await copyRichText(html, getCurrentTheme().css);
    if (success) {
      showToast('已复制到剪贴板！');
    } else {
      showToast('复制失败，请重试');
    }
  }, [html, getCurrentTheme, showToast]);

  const handleDownloadHtml = useCallback(() => {
    downloadHtml(html, 'wechat-article.html', getCurrentTheme().css);
    showToast('HTML 下载成功！');
  }, [html, getCurrentTheme, showToast]);

  const handleDownloadPdf = useCallback(async () => {
    try {
      await downloadPdf(html, 'wechat-article.pdf', getCurrentTheme().css);
      showToast('PDF 下载成功！');
    } catch (err) {
      console.error('PDF download failed:', err);
      showToast('PDF 下载失败，请重试');
    }
  }, [html, getCurrentTheme, showToast]);

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

  // 更精确的滚动同步实现
  const handleEditorScroll = useCallback(() => {
    if (isSyncingScroll.current || !scrollSyncEnabled) return;
    isSyncingScroll.current = true;

    try {
      const editor = editorRef.current;
      if (!editor) return;

      // 简单但有效的方法：基于内容高度比例同步
      // 这种方法在大多数情况下能提供较好的同步效果
      const preview = previewRef.current;
      if (preview) {
        const editorScrollHeight = editor.scrollHeight;
        const previewScrollHeight = preview.scrollHeight;
        const editorClientHeight = editor.clientHeight;
        const previewClientHeight = preview.clientHeight;
        
        // 计算编辑器的滚动比例
        const editorScrollRatio = editor.scrollTop / (editorScrollHeight - editorClientHeight);
        // 应用到预览
        const previewScrollTarget = editorScrollRatio * (previewScrollHeight - previewClientHeight);
        preview.scrollTop = Math.max(0, previewScrollTarget);
      }
    } catch (error) {
      console.error('Editor scroll sync error:', error);
    }

    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  }, [scrollSyncEnabled]);

  const handlePreviewScroll = useCallback(() => {
    if (isSyncingScroll.current || !scrollSyncEnabled) return;
    isSyncingScroll.current = true;

    try {
      const editor = editorRef.current;
      const preview = previewRef.current;
      if (!editor || !preview) return;

      // 简单但有效的方法：基于内容高度比例同步
      // 这种方法在大多数情况下能提供较好的同步效果
      const editorScrollHeight = editor.scrollHeight;
      const previewScrollHeight = preview.scrollHeight;
      const editorClientHeight = editor.clientHeight;
      const previewClientHeight = preview.clientHeight;
      
      // 计算预览的滚动比例
      const previewScrollRatio = preview.scrollTop / (previewScrollHeight - previewClientHeight);
      // 应用到编辑器
      const editorScrollTarget = previewScrollRatio * (editorScrollHeight - editorClientHeight);
      editor.scrollTop = Math.max(0, editorScrollTarget);
    } catch (error) {
      console.error('Preview scroll sync error:', error);
    }

    requestAnimationFrame(() => {
      isSyncingScroll.current = false;
    });
  }, [scrollSyncEnabled]);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.txt"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Toolbar
        onClear={clearContent}
        onCopy={handleCopy}
        onDownloadHtml={handleDownloadHtml}
        onDownloadPdf={handleDownloadPdf}
        onUpload={handleUpload}
        onOpenTemplates={() => setTemplateModalOpen(true)}
        onOpenThemes={() => setThemeManagerOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        scrollSyncEnabled={scrollSyncEnabled}
        onToggleScrollSync={handleToggleScrollSync}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 h-full border-r" style={{ 
          borderColor: isDark ? '#374151' : '#e5e7eb' 
        }}>
          <Editor 
            ref={editorRef}
            content={content} 
            onChange={updateContent} 
            isDark={isDark}
            onScroll={handleEditorScroll}
            scrollSyncEnabled={scrollSyncEnabled}
          />
        </div>
        <div className="w-1/2 h-full">
          <Preview 
            ref={previewRef}
            html={html} 
            isDark={isDark} 
            themeCss={getCurrentTheme().css}
            markdownContent={content}
            onScroll={handlePreviewScroll}
            scrollSyncEnabled={scrollSyncEnabled}
          />
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
      `}</style>
    </div>
  );
}
