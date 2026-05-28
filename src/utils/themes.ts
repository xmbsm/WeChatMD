export interface Theme {
  id: string;
  name: string;
  description: string;
  css: string;
  isCustom?: boolean;
}

export interface StyleDeclaration {
  [key: string]: string;
}

export interface GlobalStyles {
  page: StyleDeclaration;
  body: StyleDeclaration;
  paragraph: StyleDeclaration;
  headings: Record<'h1' | 'h2' | 'h3' | 'h4', StyleDeclaration>;
}

export interface TemplateMeta {
  version: number;
  group: string;
  icon: string | null;
  source: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  description: string;
  meta: TemplateMeta;
  globalStyles: GlobalStyles;
  selectorStyles: Record<string, StyleDeclaration>;
  advancedStyles: Record<string, StyleDeclaration>;
}

export const DEFAULT_PREVIEW_CONTENT = `# Markdown 样式完全指南

> 本文档展示了 Markdown 支持的所有语法样式，可用于测试编辑器的渲染效果。

---

## 标题样式

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

---

## 文本样式

**粗体文本** 用于强调重要内容。

*斜体文本* 用于轻微强调。

~~删除线文本~~ 表示已废弃的内容。

**粗体和*斜体*嵌套** 可以组合使用。

行内代码使用反引号：\`console.log('hello')\`

---

## 引用块

> 这是一段引用文本，可以用来标注重要信息或引用他人的话。
>
> 引用块内可以包含 **粗体**、*斜体* 和 \`行内代码\`。
>
> > 引用块也支持嵌套。

---

## 列表

### 无序列表

- 第一项：苹果
- 第二项：香蕉
- 第三项：橙子
  - 嵌套子项：红橙
  - 嵌套子项：血橙
- 第四项：葡萄

### 有序列表

1. 准备开发环境
2. 安装依赖包
3. 配置项目
   1. 设置环境变量
   2. 配置数据库连接
4. 启动服务

### 任务列表

- [x] 完成需求分析
- [x] 编写技术方案
- [ ] 开发核心功能
- [ ] 编写单元测试
- [ ] 部署上线

---

## 代码块

### JavaScript

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  let a = 0, b = 1;
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}

console.log(fibonacci(10)); // 55
\`\`\`

### Python

\`\`\`python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder(root):
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)
\`\`\`

### CSS

\`\`\`css
.container {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
\`\`\`

---

## 表格

| 功能 | 描述 | 状态 |
| --- | --- | --- |
| Markdown 解析 | 支持标准 GFM 语法 | ✅ 已完成 |
| 主题切换 | 多套内置主题 | ✅ 已完成 |
| 实时预览 | 编辑即预览 | ✅ 已完成 |
| 导出 PDF | 一键导出为 PDF | ✅ 已完成 |
| 滚动同步 | 编辑区与预览区同步 | ✅ 已完成 |

| 左对齐 | 居中对齐 | 右对齐 |
| :--- | :---: | ---: |
| 默认 | 居中 | 100 |
| 文本 | 对齐 | 200 |
| 内容 | 样式 | 300 |

---

## 链接与图片

[访问 GitHub](https://github.com)

![示例图片](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20beautiful%20mountain%20landscape%20with%20sunset%20colors%20reflected%20in%20a%20calm%20lake&image_size=landscape_16_9)

---

## 分割线

---

## 数学公式与特殊符号

温度变化：ΔT = T₂ - T₁ = 100°C - 25°C = 75°C

面积公式：A = π × r² = 3.14159 × 5² ≈ 78.54

化学方程式：2H₂ + O₂ → 2H₂O

---

## 混合内容测试

> **提示**：以下内容混合了多种 Markdown 语法，用于验证渲染兼容性。

1. **第一项**包含 \`行内代码\` 和 *斜体*
2. 第二项包含 [链接](https://github.com) 和 ~~删除线~~
3. 第三项包含引用：
   > 嵌套在列表中的引用块

- 无序列表中的 **粗体**
- 包含代码的列表项：\`const x = 42;\`
- 包含图片的列表项：

  ![小图标](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=A%20small%20colorful%20abstract%20icon%20on%20white%20background&image_size=square_hd)

---

## 长文本测试

微信公众号排版工具的核心价值在于：让创作者专注于内容本身，而不是在微信编辑器中反复调整格式。Markdown 的简洁语法让写作回归本质，而模板系统则确保了排版的统一性和美观度。

当你将 Markdown 内容粘贴到编辑器中，选择一个合适的主题模板，一键复制到公众号后台——整个过程只需几秒钟。相比手动在微信编辑器中逐段调整字体、颜色、间距，效率提升了不止一个量级。

---

*本文档用于测试 Markdown 编辑器的完整渲染能力。*
`;

export function styleDeclarationToString(style: StyleDeclaration | undefined): string {
  if (!style) return '';

  return Object.entries(style)
    .filter(([, value]) => `${value}`.trim().length > 0)
    .map(([property, value]) => `${property}: ${value};`)
    .join(' ');
}

export function mergeStyleDeclarations(...styles: Array<StyleDeclaration | undefined>): StyleDeclaration {
  return styles.reduce<StyleDeclaration>((acc, style) => {
    if (!style) return acc;
    for (const [property, value] of Object.entries(style)) {
      if (`${value}`.trim().length === 0) {
        delete acc[property];
      } else {
        acc[property] = value;
      }
    }
    return acc;
  }, {});
}

export function buildTemplateStyleMap(template: TemplateDefinition): Record<string, StyleDeclaration> {
  const mergedSelectors: Record<string, StyleDeclaration> = {};
  const selectorNames = new Set([
    ...Object.keys(template.selectorStyles || {}),
    ...Object.keys(template.advancedStyles || {}),
  ]);

  for (const selector of selectorNames) {
    const mergedStyle = mergeStyleDeclarations(
      template.selectorStyles[selector],
      template.advancedStyles[selector]
    );

    if (
      ['u', 'a'].includes(selector) &&
      (mergedStyle['text-decoration-style'] ||
        mergedStyle['text-decoration-color'] ||
        mergedStyle['text-underline-offset'])
    ) {
      const textDecoration = mergedStyle['text-decoration'] || '';
      const hasLine = Boolean(mergedStyle['text-decoration-line']);

      if (!hasLine && textDecoration && textDecoration !== 'none') {
        mergedStyle['text-decoration-line'] = textDecoration;
      }

      if (selector === 'u' && !mergedStyle['text-decoration-line']) {
        mergedStyle['text-decoration-line'] = 'underline';
      }

      delete mergedStyle['text-decoration'];
    }

    mergedSelectors[selector] = mergedStyle;
  }
  return mergedSelectors;
}

export function templateToCss(template: TemplateDefinition): string {
  const styleMap = buildTemplateStyleMap(template);
  let css = '';

  for (const [selector, styles] of Object.entries(styleMap)) {
    const styleString = styleDeclarationToString(styles);
    if (styleString) {
      const cssSelector = selector === 'container' ? '#wechat-preview' : `#wechat-preview ${selector}`;
      css += `${cssSelector} { ${styleString} }\n`;
    }
  }

  return css;
}

const templateModules = import.meta.glob('../themes/seed/*.json', {
  eager: true,
  import: 'default',
}) as Record<string, TemplateDefinition>;

export function getBundledTemplates(): TemplateDefinition[] {
  return Object.values(templateModules).sort((left, right) => {
    if (left.id === 'default') return -1;
    if (right.id === 'default') return 1;
    if (left.id === 'claudius') return -1;
    if (right.id === 'claudius') return 1;
    return left.name.localeCompare(right.name);
  });
}

export function getBuiltInThemesFromJson(): Theme[] {
  const templates = getBundledTemplates();
  return templates.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    css: templateToCss(template),
    isCustom: false
  }));
}

export function exportThemeToJson(theme: Theme, template?: TemplateDefinition): TemplateDefinition {
  if (template) {
    return template;
  }
  
  return {
    id: theme.id,
    name: theme.name,
    description: theme.description,
    meta: {
      version: 1,
      group: 'Custom',
      icon: null,
      source: 'custom',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    globalStyles: {
      page: {},
      body: {},
      paragraph: {},
      headings: { h1: {}, h2: {}, h3: {}, h4: {} }
    },
    selectorStyles: {},
    advancedStyles: {}
  };
}

export const builtInThemes: Theme[] = getBuiltInThemesFromJson();

export function loadCustomThemes(): Theme[] {
  try {
    const saved = localStorage.getItem('wechat-custom-themes');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load custom themes:', e);
  }
  return [];
}

export function saveCustomThemes(themes: Theme[]) {
  try {
    localStorage.setItem('wechat-custom-themes', JSON.stringify(themes));
  } catch (e) {
    console.error('Failed to save custom themes:', e);
  }
}

export function downloadTheme(theme: Theme, template?: TemplateDefinition) {
  const jsonData = exportThemeToJson(theme, template);
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${theme.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function uploadTheme(file: File): Promise<TemplateDefinition> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const template = JSON.parse(content);
        resolve(template);
      } catch (err) {
        reject(new Error('无效的主题文件格式'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}
