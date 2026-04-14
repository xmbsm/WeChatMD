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

export const DEFAULT_PREVIEW_CONTENT = `# 欢迎使用微信公众号 Markdown 编辑器

> 这是一个专为微信公众号设计的 Markdown 编辑器，支持实时预览和一键复制功能。 

**WeChatMD** 是一个开源的 Markdown 排版工具它做的事情很简单：

- 让你把自定义的排版变成 **可复用的模板**
- 一次打磨，*长期使用*
- 导入、导出、分享，模板是你的资产


---

## 这篇文章本身就是演示

你现在看到的所有样式——从**标题**的大小和颜色、到*正文*的字体和行高、引用块的背景和边框、代码的配色、下划线的样式——全部都由当前模板控制。

试试切换左上角的模板。整篇文章会 **立即换装**。

## 模板制作

这是 **WeChatMD** 的核心。

点击顶部「模板制作」，进入可视化编辑器。每一个你能看到的元素，都可以单独调节样式。

### 标题

你现在看到的这些标题样式，都是模板定义的。h1 到 h4 都允许各自独立控制字体、字号、颜色、边框、背景。

附带 **N 种预设**——简约底线、左侧色条、渐变底色、标签胶囊、居中装饰、大写粗体、阴影浮动、极简留白。选一个接近的，再微调。

前三级标题你已经见到了。

#### 四级标题也有自己的存在感

### 引用块

> 你正在看的这段引用，就是当前模板的引用块样式。背景、边框、圆角、阴影、内边距——全部可调。
> 
> 附带 **多种预设**：经典左线、柔和卡片、强调色块、斜体引用、虚线边框、直角装饰。

### 代码块

\`\`\`javascript
// 你看到的代码块样式，同样由模板决定
// N 种预设：Mac 风格、暗色终端、左侧色条、阴影浮动
function useTemplate(name) {
  const template = loadTemplate(name);
  return applyToMarkdown(template, content);
}
\`\`\`

### 分割线

分隔线的样式也是由模板控制的：

目前支持 **10 种装饰模式**。除了常规的细线、粗线、点线、渐隐，还可以使用符号装饰——在线条中央或两侧放置 ● ◆ ◇ ★ ○ ✦ 等符号，颜色、大小、间距都能自定义。

---

### 图片

图片支持三种插入方式：

1. **外部链接**——使用图片
2. **剪贴板粘贴**——截图后直接粘贴，自动转为轻量引用
3. **项目文件**——引用本地路径

> 复制到公众号时，微信会重新托管图片。**外部 https 链接**可直接使用；截图粘贴和本地图片会自动上传到临时图床生成链接（在线部署版自动完成，自部署需配置图片代理）。

单张图片：

![默认封面图](/showcase/default-cover.svg)

连续放置多张图片，它们会自动排列。

![版式卡片 A](/showcase/default-grid-a.svg)

![版式卡片 B](/showcase/default-grid-b.svg)

---

### 正文与行内样式

**粗体**、*斜体*、下划线、行内代码、这些样式在不同模板下有完全不同的表现。颜色、字重、装饰方式，都由模板定义。

### 列表

- **无序**列表的样式由模板控制
- 包括缩进、间距、标记符号
- 适合罗列要点和功能说明

1. **有序**列表同样如此
2. 序号样式、间距、对齐方式
3. 都可以在模板中调节

### 表格

| 元素 | 可独立调节 | 预设数量 |
| --- | --- | --- |
| 标题 h1–h4 | 字体、字号、颜色、边框、背景 | 多种 |
| 引用块 | 背景、圆角、阴影、装饰模式 | 多种 |
| 分割线 | 线型、颜色、符号、位置 | 多种 |
| 代码块 | 背景、边框、高亮配色 | 多种 |
| 图片 | 圆角、阴影、网格 / 轮播 | 多种 |
| 正文 / 强调 / 链接 | 全部独立控制 | — |

表格的边框、背景色、单元格内边距、表头样式——也都在模板里。

### 高级 CSS

每个元素还支持写入原始 CSS，覆盖面板没有暴露的细节。内置快捷预设：

- 轻微阴影——给元素一层呼吸感
- 细边框——低调的结构分隔
- 柔和高亮——淡黄背景标记重点
- 轻圆角卡片——圆角 + 阴影组合

---

## 9 套内置模板

不用从零开始。内置模板覆盖了主流风格，选一个最接近的，进入模板工作台微调成自己的：

| 模板 | 风格 |
| --- | --- |
| Eris桓 | 作者自设，工具默认模板。公众号「Eris 桓」同款 |
| 极客 | 黑白高对比，青色点缀，开发者文档风 |
| 少数派 | 红色编辑线系统，中文科技媒体 |
| 克劳德 | 燕麦暖棕，衬线正文，适合深度长文 |
| 终端 | 深靛蓝底，IDE 绿色与橙色数据流 |
| 赛博朋克 | 品红与青的霓虹双色，未来废土 |
| 水墨 | 楷体正文，直角印章引用，中式写意 |
| 马卡龙 | 多彩马卡龙色系，甜而不腻 |
| 包豪斯 | 三原色几何碰撞，零圆角先锋 |

所有模板均可以 **导出为 JSON 文件**，分享给朋友或团队，换设备时一键\`导入\`恢复。

---

## 输出

| 方式 | 场景 |
| --- | --- |
| **复制到公众号** | 自动处理微信兼容性，粘贴即保留样式 |
| **HTML 导出** | 自包含文件，样式内联 |
| **PDF 导出** | 按预览效果生成，适合定版分享 |

写 Markdown，选模板，复制粘贴。排版结束。

---

## 开始

清空左侧编辑器，粘贴你自己的文章，切换几个模板看看效果。

觉得接近但不完美——点击「模板制作」微调，保存。

导出、导入、分享。

这就是你的模板了。

> 编辑器内容在页面切换时会自动保存。点击右上角 ↺ 随时恢复为本示例。
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
