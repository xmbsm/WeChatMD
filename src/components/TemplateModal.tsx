import { X } from 'lucide-react';
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
          "flex items-center justify-between p-4 border-b",
          isDark ? "border-gray-700" : "border-gray-200"
        )}>
          <h2 className={clsx(
            "text-xl font-bold",
            isDark ? "text-white" : "text-gray-800"
          )}>
            选择模板
          </h2>
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
                  {template.name.charAt(0)}
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
