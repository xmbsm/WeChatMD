# 微信 Markdown 编辑器

一个专为微信公众号设计的在线 Markdown 编辑器，提供实时预览、微信风格适配、主题管理等功能，让你轻松编写美观的公众号文章。

## 🚀 功能特点

### 核心功能
- **实时预览**：编辑 Markdown 的同时实时查看微信公众号风格的预览效果
- **微信风格适配**：预览效果完全模拟微信公众号排版样式
- **一键复制**：一键复制为微信公众号支持的 HTML 格式
- **文件操作**：支持上传 Markdown 文件、下载 HTML 和 PDF 文件
- **主题管理**：内置多种 Markdown 样式，支持自定义主题
- **滚动同步**：编辑区和预览区滚动同步，点击预览内容自动定位到编辑区

### 高级功能
- **移动端适配**：响应式设计，移动端使用标签切换编辑区和预览区
- **Mermaid 图表支持**：内置流程图、时序图、甘特图等多种图表
- **表格类型选择**：提供多种表格样式选择
- **图标插入**：支持插入各种图标，自动适配主题配色
- **文章管理**：左侧栏文章管理，支持新建、删除、重命名和拖动排序
- **实时保存**：自动保存编辑内容，防止意外丢失
- **统计信息**：显示编辑器行数和字数统计
- **深色模式**：支持浅色/深色模式切换，保护眼睛

## 📖 使用指南

### 快速开始
1. **克隆项目**
   ```bash
   git clone https://github.com/yourusername/wechat-markdown-editor.git
   cd wechat-markdown-editor
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **构建生产版本**
   ```bash
   npm run build
   ```

### 基本操作
- **编辑 Markdown**：在左侧编辑区输入 Markdown 内容
- **预览效果**：右侧实时显示微信公众号风格的预览效果
- **切换视图**：在移动端使用标签切换编辑区和预览区
- **上传文件**：点击工具栏的上传按钮上传 Markdown 文件
- **下载文件**：点击工具栏的下载按钮下载 HTML 或 PDF 文件
- **复制内容**：点击工具栏的复制按钮一键复制为微信公众号支持的格式

### 高级操作
- **管理文章**：使用左侧栏新建、删除、重命名文章
- **拖动排序**：在左侧栏拖动文章进行排序
- **切换主题**：点击工具栏的主题按钮选择不同的 Markdown 样式
- **插入图表**：使用 Mermaid 语法插入各种图表
- **插入图标**：点击工具栏的图标按钮插入图标
- **同步滚动**：点击工具栏的滚动同步按钮启用/禁用滚动同步功能

## 🛠 技术栈

- **前端框架**：React 18 + TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **Markdown 解析**：marked
- **代码高亮**：highlight.js
- **PDF 生成**：jsPDF + html2canvas
- **图表支持**：Mermaid
- **状态管理**：React Hooks + localStorage
- **响应式设计**：Tailwind CSS 响应式类

## 📁 项目结构

```
wechat-markdown-editor/
├── src/
│   ├── components/          # 组件
│   │   ├── Editor.tsx       # Markdown 编辑区
│   │   ├── Preview.tsx      # 微信风格预览
│   │   ├── Toolbar.tsx      # 工具栏
│   │   ├── Sidebar.tsx      # 左侧栏文章管理
│   │   ├── ThemeManager.tsx # 主题管理
│   │   ├── TemplateModal.tsx # 模板管理
│   │   └── Toast.tsx        # 提示组件
│   ├── pages/
│   │   └── Home.tsx         # 主页面
│   ├── utils/
│   │   ├── copyHtml.ts      # 复制和下载功能
│   │   ├── themes.ts        # 主题管理
│   │   ├── templates.ts     # 模板管理
│   │   ├── articles.ts      # 文章管理
│   │   └── wechatStyles.ts  # 微信风格样式
│   ├── hooks/
│   │   ├── useMarkdown.ts   # Markdown 处理钩子
│   │   └── useTheme.ts      # 主题管理钩子
│   ├── assets/              # 资源文件
│   ├── main.tsx             # 入口文件
│   └── App.tsx              # 应用组件
├── public/                  # 静态文件
├── index.html               # HTML 模板
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 项目配置
└── README.md                # 项目说明
```

## 👨‍💻 作者介绍

**微信 Markdown 编辑器** 是一个开源项目，旨在为微信公众号作者提供一个便捷、高效的 Markdown 编辑工具。项目由热爱前端开发的开发者们共同维护，致力于不断完善和提升用户体验。

## 📄 开源协议

本项目采用 [MIT 开源协议](https://opensource.org/licenses/MIT)，您可以自由使用、修改和分发本项目的代码。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目！

## 🙏 致谢

- [React](https://reactjs.org/) - 用于构建用户界面的 JavaScript 库
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集，添加了类型
- [Vite](https://vitejs.dev/) - 现代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [marked](https://marked.js.org/) - 快速的 Markdown 解析器
- [highlight.js](https://highlightjs.org/) - 代码高亮库
- [jsPDF](https://github.com/parallax/jsPDF) - 生成 PDF 的 JavaScript 库
- [html2canvas](https://html2canvas.hertzen.com/) - 将 HTML 转换为 canvas
- [Mermaid](https://mermaid-js.github.io/mermaid/) - 图表绘制工具

---

**享受编辑的乐趣！** 🎉