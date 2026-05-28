import { useState } from 'react';
import { Plus, Trash2, Search, Menu, X, MoreVertical, Copy, Edit3 } from 'lucide-react';
import { clsx } from 'clsx';
import { Article, formatDate } from '../utils/articles';
import { Theme, builtInThemes } from '../utils/themes';

interface SidebarProps {
  articles: Article[];
  currentArticleId: string;
  onSelectArticle: (article: Article) => void;
  onNewArticle: () => void;
  onDeleteArticle: (articleId: string) => void;
  onRenameArticle: (articleId: string, newTitle: string) => void;
  onCopyTitle: (title: string) => void;
  onReorderArticles: (articles: Article[]) => void;
  isDark: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  themes: Theme[];
  showCloseButton?: boolean;
  width?: string;
}

export function Sidebar({
  articles,
  currentArticleId,
  onSelectArticle,
  onNewArticle,
  onDeleteArticle,
  onRenameArticle,
  onCopyTitle,
  onReorderArticles,
  isDark,
  isCollapsed,
  onToggleCollapse,
  themes,
  showCloseButton = true,
  width = '280px'
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpenArticleId, setMenuOpenArticleId] = useState<string | null>(null);
  const [renameArticleId, setRenameArticleId] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [draggedArticle, setDraggedArticle] = useState<Article | null>(null);

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getThemeName = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    return theme?.name || '默认主题';
  };

  const handleDelete = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const article = articles.find(a => a.id === articleId);
    if (article) {
      setArticleToDelete(article);
      setDeleteModalOpen(true);
      setMenuOpenArticleId(null);
    }
  };

  const handleDeleteConfirm = () => {
    if (articleToDelete) {
      onDeleteArticle(articleToDelete.id);
      setDeleteModalOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setArticleToDelete(null);
  };

  const handleMenuToggle = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenArticleId(menuOpenArticleId === articleId ? null : articleId);
  };

  const handleCopyTitle = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyTitle(title);
    setMenuOpenArticleId(null);
  };

  const handleRenameStart = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenameArticleId(article.id);
    setRenameTitle(article.title);
    setMenuOpenArticleId(null);
  };

  const handleRenameSubmit = (articleId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (renameTitle.trim()) {
      onRenameArticle(articleId, renameTitle.trim());
      setRenameArticleId(null);
      setRenameTitle('');
    }
  };

  // 拖动排序相关函数
  const handleDragStart = (article: Article, e: React.DragEvent) => {
    e.stopPropagation();
    setDraggedArticle(article);
    e.dataTransfer.setData('text/plain', article.id);
  };

  const handleDragEnd = () => {
    setDraggedArticle(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (targetArticle: Article, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedArticle || draggedArticle.id === targetArticle.id) return;
    
    const newArticles = [...articles];
    const draggedIndex = newArticles.findIndex(a => a.id === draggedArticle.id);
    const targetIndex = newArticles.findIndex(a => a.id === targetArticle.id);
    
    newArticles.splice(draggedIndex, 1);
    newArticles.splice(targetIndex, 0, draggedArticle);
    
    onReorderArticles(newArticles);
    setDraggedArticle(null);
  };

  if (isCollapsed) {
    return (
      <div 
        className="flex flex-col items-center py-4 border-r"
        style={{ 
          width: '60px',
          backgroundColor: isDark ? 'rgb(45 45 45)' : 'white',
          borderColor: isDark ? '#374151' : '#e5e7eb'
        }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
            color: isDark ? '#d1d5db' : '#4b5563',
          }}
          className="p-2 rounded-lg mb-4 hover:bg-gray-700 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={onNewArticle}
          style={{
            color: isDark ? '#d1d5db' : '#4b5563',
          }}
          className="p-2 rounded-lg hover:bg-gray-700 hover:text-white"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className={clsx(
      "flex flex-col h-full transition-all duration-300",
      "md:border-r",
      isDark ? "bg-[#2d2d2d] md:border-gray-700" : "bg-white md:border-gray-200"
    )} style={{ width }}>
      {/* 顶部工具栏 */}
      <div className={clsx(
        "flex items-center justify-between px-4 border-b text-sm font-medium",
        isDark 
          ? "bg-[#2d2d2d] border-gray-700 text-gray-300" 
          : "bg-white border-gray-200 text-gray-600"
      )} style={{ height: '45px' }}>
        历史记录
        <div className="flex items-center gap-2">
          <button
            onClick={onNewArticle}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              isDark ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
            )}
            title="新建文章"
          >
            <Plus className="w-5 h-5" />
          </button>
          {showCloseButton && (
            <button
              onClick={onToggleCollapse}
              className={clsx(
                "p-2 rounded-lg transition-colors",
                isDark ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              )}
              title="折叠侧边栏"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 搜索框 */}
      <div className="p-4">
        <div className="relative">
          <Search className={clsx(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
            isDark ? "text-gray-400" : "text-gray-400"
          )} />
          <input
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={clsx(
              "w-full pl-10 pr-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2",
              isDark
                ? "bg-[#252525] border-gray-700 text-white placeholder-gray-500 focus:border-[#07c160] focus:ring-[#07c160]/20"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-[#07c160] focus:ring-[#07c160]/20"
            )}
          />
        </div>
      </div>

      {/* 文章列表 */}
      <div className="flex-1 overflow-y-auto p-4 pt-0 pb-32">
        {filteredArticles.length === 0 ? (
          <div className={clsx(
            "text-center py-8",
            isDark ? "text-gray-500" : "text-gray-400"
          )}>
            {searchQuery ? '未找到匹配的文章' : '暂无文章'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                draggable
                onDragStart={(e) => handleDragStart(article, e)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(article, e)}
                className={clsx(
                  "relative p-4 rounded-xl cursor-pointer transition-all duration-200 group",
                  currentArticleId === article.id
                    ? (isDark ? "bg-[#3c3c3c] border-2 border-[#07c160]" : "bg-[rgb(232_247_239)] border-2 border-[#07c160]")
                    : (isDark ? "bg-[#252525] border-2 border-transparent hover:bg-[#3c3c3c]" : "bg-[rgb(249_250_251)] border-2 border-transparent hover:bg-[rgb(232_247_239)]"),
                  draggedArticle?.id === article.id && "opacity-50"
                )}
              >
                {renameArticleId === article.id ? (
                  <form onSubmit={(e) => handleRenameSubmit(article.id, e)} className="space-y-2">
                    <input
                      type="text"
                      value={renameTitle}
                      onChange={(e) => setRenameTitle(e.target.value)}
                      className={clsx(
                        "w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2",
                        isDark
                          ? "bg-[#252525] border-gray-700 text-white focus:border-[#07c160] focus:ring-[#07c160]/20"
                          : "bg-white border-gray-300 text-gray-800 focus:border-[#07c160] focus:ring-[#07c160]/20"
                      )}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setRenameArticleId(null);
                          setRenameTitle('');
                        }}
                        className={clsx(
                          "px-3 py-1 text-sm rounded-lg",
                          isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
                        )}
                      >
                        取消
                      </button>
                      <button
                        type="submit"
                        className={clsx(
                          "px-3 py-1 text-sm rounded-lg",
                          "bg-[#07c160] text-white"
                        )}
                      >
                        确认
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className={clsx(
                          "text-sm mb-2",
                          isDark ? "text-gray-400" : "text-gray-500"
                        )}>
                          {formatDate(article.updatedAt)}
                        </div>
                        <div className={clsx(
                          "text-lg font-bold mb-2 truncate",
                          currentArticleId === article.id
                            ? (isDark ? "text-white" : "text-gray-900")
                            : (isDark ? "text-gray-200" : "text-gray-800")
                        )}>
                          {article.title}
                        </div>
                        <div className={clsx(
                          "text-sm font-medium",
                          currentArticleId === article.id ? "text-[#07c160]" : "text-[#07c160]"
                        )}>
                          {getThemeName(article.themeId)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleMenuToggle(article.id, e)}
                        className={clsx(
                          "p-2 rounded-lg transition-all duration-200 mt-0.5",
                          isDark ? "text-gray-400 hover:bg-gray-700 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-800"
                        )}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* 菜单弹窗 */}
                    {menuOpenArticleId === article.id && (
                      <div className={clsx(
                        "absolute top-0 right-0 mt-16 mr-2 w-48 rounded-lg shadow-lg z-50 transition-all duration-200",
                        isDark ? "bg-[#2d2d2d] border border-gray-700" : "bg-white border border-gray-200"
                      )}>
                        <div className="py-1">
                          <button
                            onClick={(e) => handleCopyTitle(article.title, e)}
                            className={clsx(
                              "w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors",
                              isDark ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-800"
                            )}
                          >
                            <Copy className="w-4 h-4" />
                            复制标题
                          </button>
                          <button
                            onClick={(e) => handleRenameStart(article, e)}
                            className={clsx(
                              "w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors",
                              isDark ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-800"
                            )}
                          >
                            <Edit3 className="w-4 h-4" />
                            重命名
                          </button>
                          <button
                            onClick={(e) => handleDelete(article.id, e)}
                            className={clsx(
                              "w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors",
                              isDark ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-800"
                            )}
                          >
                            <Trash2 className="w-4 h-4" />
                            删除
                          </button>
                        </div>
                      </div>
                    )}
                    

                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


      
      {/* 删除确认弹窗 */}
      {deleteModalOpen && articleToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={clsx(
            "w-80 rounded-lg shadow-lg p-6 transition-all duration-200",
            isDark ? "bg-[#2d2d2d] border border-gray-700" : "bg-white"
          )}>
            <h3 className={clsx(
              "text-lg font-bold mb-4",
              isDark ? "text-white" : "text-gray-900"
            )}>
              删除记录
            </h3>
            <p className={clsx(
              "mb-6",
              isDark ? "text-gray-300" : "text-gray-600"
            )}>
              确定要删除「{articleToDelete.title}」吗？此操作不可撤销。
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleDeleteCancel}
                className={clsx(
                  "px-4 py-2 rounded-lg transition-colors",
                  isDark
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                )}
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className={clsx(
                  "px-4 py-2 rounded-lg transition-colors",
                  "bg-red-500 text-white hover:bg-red-600"
                )}
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
