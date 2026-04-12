import { Copy, Trash2, Download, Sun, Moon, HelpCircle, FileText, Upload, FileSpreadsheet, Layout, Palette, RefreshCcw } from 'lucide-react';
import { clsx } from 'clsx';

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
  return (
    <div className={clsx(
      "flex items-center justify-between px-4 py-3 border-b shrink-0",
      isDark 
        ? "bg-[#2d2d2d] border-gray-700" 
        : "bg-white border-gray-200"
    )}>
      <div className="flex items-center gap-2">
        <h1 className={clsx(
          "text-lg font-bold",
          isDark ? "text-white" : "text-gray-800"
        )}>
          微信 Markdown 编辑器
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
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
          <span className="hidden sm:inline">模板</span>
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
          <span className="hidden sm:inline">主题</span>
        </button>

        <button
          onClick={onToggleScrollSync}
          className={clsx(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            scrollSyncEnabled
              ? (isDark ? "bg-[#07c160]/20 text-[#07c160]" : "bg-[#e8f7ef] text-[#07c160]")
              : (isDark ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800")
          )}
          title={scrollSyncEnabled ? "关闭滚动同步" : "开启滚动同步"}
        >
          <RefreshCcw className="w-4 h-4" />
          <span className="hidden sm:inline">同步</span>
        </button>

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
          <span className="hidden sm:inline">上传</span>
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
          <span className="hidden sm:inline">清空</span>
        </button>
        
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
            <span className="hidden sm:inline">下载</span>
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
    </div>
  );
}
