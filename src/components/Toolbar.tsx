import { Copy, Trash2, Download, Sun, Moon, HelpCircle, FileText, Upload, FileSpreadsheet, Layout, Palette, RefreshCcw, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

interface ToolbarProps {
  onClear: () => void;
  onCopy: () => void;
  onDownloadHtml: () => void;
  onDownloadPdf: () => void;
  onUpload: () => void;
  onOpenTemplates: () => void;
  onOpenThemes: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  scrollSyncEnabled: boolean;
  onToggleScrollSync: () => void;
}

export function Toolbar({ 
  onClear, 
  onCopy, 
  onDownloadHtml, 
  onDownloadPdf, 
  onUpload, 
  onOpenTemplates, 
  onOpenThemes, 
  isDark, 
  onToggleTheme,
  scrollSyncEnabled,
  onToggleScrollSync
}: ToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className={clsx(
      "flex items-center justify-between px-6 py-3 border-b shrink-0 relative w-full",
      isDark 
        ? "bg-[#2d2d2d] border-gray-700" 
        : "bg-white border-gray-200"
    )} style={{ width: '100%' }}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#07c160]">
          <span className="text-white font-bold">W</span>
        </div>
        <h1 className={clsx(
          "text-lg font-bold",
          isDark ? "text-white" : "text-gray-800"
        )}>
          微信 Markdown 编辑器
        </h1>
      </div>
      
      {/* 桌面端工具栏 */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={onUpload}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          title="上传 MD 文件"
        >
          <Upload className="w-4 h-4" />
          <span>上传</span>
        </button>

        <button
          onClick={onToggleScrollSync}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            scrollSyncEnabled
              ? (isDark ? "bg-[#3c3c3c] text-[rgb(7_193_96)]" : "bg-[rgb(232_247_239)] text-[rgb(7_193_96)]")
              : (isDark ? "text-gray-300 hover:bg-[#3c3c3c] hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800")
          )}
          title={scrollSyncEnabled ? "关闭滚动同步" : "开启滚动同步"}
        >
          {scrollSyncEnabled ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link2"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-unlink2"><path d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2"></path></svg>
          )}
          <span>滚动同步</span>
        </button>

        <button
          onClick={onOpenThemes}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          title="主题管理"
        >
          <Palette className="w-4 h-4" />
          <span>主题</span>
        </button>

        <button
          onClick={onOpenTemplates}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          title="选择模板"
        >
          <Layout className="w-4 h-4" />
          <span>模板</span>
        </button>

        <button
          onClick={onClear}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          title="清空内容"
        >
          <Trash2 className="w-4 h-4" />
          <span>清空</span>
        </button>
        
        <div className="relative group">
          <button
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isDark
                ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            )}
            title="下载"
          >
            <Download className="w-4 h-4" />
            <span>下载</span>
          </button>
          <div className={clsx(
            "absolute right-0 top-full mt-1 min-w-[140px] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10",
            isDark ? "bg-[#1e1e1e] border border-gray-700" : "bg-white border border-gray-200"
          )}>
            <button
              onClick={onDownloadHtml}
              className={clsx(
                "w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors first:rounded-t-lg",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>HTML</span>
            </button>
            <button
              onClick={onDownloadPdf}
              className={clsx(
                "w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors last:rounded-b-lg",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
        
        <button
          onClick={onCopy}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "bg-[#07c160] text-white hover:bg-[#06ad56] hover:shadow-lg hover:scale-105 active:scale-95"
          )}
          title="一键复制到微信公众号"
        >
          <Copy className="w-4 h-4" />
          <span>一键复制</span>
        </button>
        
        <div className="w-px h-6 mx-1" style={{ 
          backgroundColor: isDark ? '#374151' : '#e5e7eb' 
        }} />
        
        <button
          onClick={onToggleTheme}
          className={clsx(
            "p-2 rounded-lg transition-all duration-200",
            isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          title={isDark ? "切换到浅色模式" : "切换到深色模式"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <a
          href="https://www.markdownguide.org/basic-syntax/"
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            "p-2 rounded-lg transition-all duration-200",
            isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          title="Markdown 语法帮助"
        >
          <HelpCircle className="w-5 h-5" />
        </a>
      </div>
      
      {/* 移动端工具栏 */}
      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={onCopy}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            "bg-[#07c160] text-white hover:bg-[#06ad56] active:scale-95"
          )}
          title="一键复制到微信公众号"
        >
          <Copy className="w-4 h-4" />
          <span>复制</span>
        </button>
        
        <button
          onClick={onToggleTheme}
          className={clsx(
            "p-2 rounded-lg transition-all duration-200",
            isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          title={isDark ? "切换到浅色模式" : "切换到深色模式"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        
        <button
          onClick={toggleMenu}
          className={clsx(
            "p-2 rounded-lg transition-all duration-200",
            isDark
              ? "text-gray-300 hover:bg-gray-700 hover:text-white"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
          )}
          title="更多选项"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      
      {/* 移动端下拉菜单 */}
      {menuOpen && (
        <div className={clsx(
          "absolute top-full left-0 right-0 z-50 shadow-lg border-t w-full",
          isDark ? "bg-[#2d2d2d] border-gray-700" : "bg-white border-gray-200"
        )} style={{ width: '100%' }}>
          <div className="p-3 space-y-1">
            <button
              onClick={() => { onUpload(); closeMenu(); }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Upload className="w-5 h-5" />
              <span className="text-base">上传 MD 文件</span>
            </button>
            
            <button
              onClick={() => { onToggleScrollSync(); closeMenu(); }}
              className={clsx(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
            scrollSyncEnabled
              ? (isDark ? "bg-[#3c3c3c] text-[rgb(7_193_96)]" : "bg-[rgb(232_247_239)] text-[rgb(7_193_96)]")
              : (isDark ? "text-gray-300 hover:bg-[#3c3c3c] hover:text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900")
          )}
            >
              {scrollSyncEnabled ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link2"><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 1 1 0 10h-2"></path><line x1="8" x2="16" y1="12" y2="12"></line></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-unlink2"><path d="M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2"></path></svg>
              )}
              <span className="text-base">{scrollSyncEnabled ? '关闭滚动同步' : '开启滚动同步'}</span>
            </button>
            
            <button
              onClick={() => { onOpenThemes(); closeMenu(); }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Palette className="w-5 h-5" />
              <span className="text-base">主题管理</span>
            </button>
            
            <button
              onClick={() => { onOpenTemplates(); closeMenu(); }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Layout className="w-5 h-5" />
              <span className="text-base">选择模板</span>
            </button>
            
            <div className={clsx(
              "h-px my-2",
              isDark ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <button
              onClick={() => { onDownloadHtml(); closeMenu(); }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <FileText className="w-5 h-5" />
              <span className="text-base">下载 HTML</span>
            </button>
            
            <button
              onClick={() => { onDownloadPdf(); closeMenu(); }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span className="text-base">下载 PDF</span>
            </button>
            
            <div className={clsx(
              "h-px my-2",
              isDark ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <button
              onClick={() => { onCopy(); closeMenu(); }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                "bg-[#07c160] text-white hover:bg-[#06ad56]"
              )}
            >
              <Copy className="w-5 h-5" />
              <span className="text-base">一键复制到微信公众号</span>
            </button>
            
            <button
              onClick={() => { onClear(); closeMenu(); }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-base">清空内容</span>
            </button>
            
            <div className={clsx(
              "h-px my-2",
              isDark ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <a
              href="https://www.markdownguide.org/basic-syntax/"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200",
                isDark
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={closeMenu}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="text-base">Markdown 语法帮助</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
