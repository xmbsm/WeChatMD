import { X, Layout } from 'lucide-react';
import { clsx } from 'clsx';
import { templates, Template } from '../utils/templates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (content: string) => void;
  isDark: boolean;
}

export function TemplateModal({ isOpen, onClose, onSelectTemplate, isDark }: TemplateModalProps) {
  if (!isOpen) return null;

  const handleSelect = (template: Template) => {
    if (window.confirm('使用此模板将替换当前内容，确定继续吗？')) {
      onSelectTemplate(template.content);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className={clsx(
        "relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-xl shadow-2xl",
        isDark ? "bg-[#2d2d2d]" : "bg-white"
      )}>
        <div className={clsx(
          "flex items-center justify-between px-6 py-4 border-b",
          isDark ? "border-gray-700" : "border-gray-200"
        )}>
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#07c160]" />
            <h2 className={clsx(
              "text-lg font-bold",
              isDark ? "text-white" : "text-gray-800"
            )}>
              选择模板
            </h2>
          </div>
          <button
            onClick={onClose}
            className={clsx(
              "p-2 rounded-lg transition-colors",
              isDark 
                ? "text-gray-400 hover:bg-gray-700 hover:text-white" 
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelect(template)}
                className={clsx(
                  "text-left p-4 rounded-lg border-2 transition-all duration-200 hover:scale-[1.02]",
                  isDark
                    ? "border-gray-700 hover:border-[#07c160] bg-[#1e1e1e]"
                    : "border-gray-200 hover:border-[#07c160] bg-gray-50"
                )}
              >
                <div 
                  className="w-full h-24 rounded-lg mb-3 flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: template.thumbnailColor }}
                >
                  {template.id === 'default' ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      通用模板
                    </div>
                  ) : template.id === 'tech' ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      技术教程
                    </div>
                  ) : template.id === 'news' ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      新闻资讯
                    </div>
                  ) : template.id === 'product' ? (
                    <div className="flex items-center gap-2">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      产品介绍
                    </div>
                  ) : (
                    template.name.charAt(0)
                  )}
                </div>
                <h3 className={clsx(
                  "font-semibold mb-1",
                  isDark ? "text-white" : "text-gray-800"
                )}>
                  {template.name}
                </h3>
                <p className={clsx(
                  "text-sm",
                  isDark ? "text-gray-400" : "text-gray-500"
                )}>
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
