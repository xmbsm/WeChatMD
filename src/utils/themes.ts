export interface Theme {
  id: string;
  name: string;
  description: string;
  css: string;
  isCustom?: boolean;
}

export const DEFAULT_PREVIEW_CONTENT = `# 欢迎使用 WeMD

这是一个现代化的 Markdown 编辑器，专为微信公众号排版设计。

## 1. 基础语法

**这是加粗文本**

*这是斜体文本*

***这是加粗斜体文本***

~~这是删除线文本~~

==这是高亮文本==

这是一个[链接](https://example.com)

## 2. 特殊格式

### 上标和下标

水的化学式：H~2~O

爱因斯坦质能方程：E=mc^2^

### 脚注

这里有一个脚注引用[^1]

[^1]: 这是脚注内容

## 3. 列表

### 无序列表

- 列表项 1
- 列表项 2
  - 嵌套列表项
  - 嵌套列表项

### 有序列表

1. 第一项
2. 第二项
3. 第三项

### 任务列表

- [x] 已完成任务
- [ ] 待完成任务
- [ ] 另一个任务

## 4. 代码

### 行内代码

这是 \`行内代码\` 示例。

### 代码块

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return {
    message: \`Welcome, \${name}\`,
    timestamp: Date.now()
  };
}

greet('World');
\`\`\`

## 5. 表格

| 功能 | 说明 | 状态 |
|------|------|------|
| 标题 | 支持多级标题 | ✅ |
| 列表 | 有序/无序列表 | ✅ |
| 代码 | 行内代码和代码块 | ✅ |
| 表格 | Markdown 表格 | ✅ |

## 6. 引用

> 这是一段引用文字。
> 
> 可以包含多行。
> 
> — 作者姓名

### 嵌套引用

> 第一层引用
> 
> > 第二层引用
> > 
> > > 第三层引用

## 7. 分隔线

---

***

___

## 8. 图片

![示例图片](https://picsum.photos/800/400)

## 总结

这就是 WeMD 的预览内容，展示了各种 Markdown 语法的渲染效果！
`;

export const builtInThemes: Theme[] = [
  {
    id: 'default',
    name: '默认主题',
    description: '默认样式，最佳实践',
    css: `/* 默认样式，最佳实践 */

/* 全局属性 */
#wechat-preview {
  font-size: 16px;
  color: #000000;
  padding: 0 8px;
  line-height: 1.6;
  word-break: break-word;
  text-align: left;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

/* 段落 */
#wechat-preview p {
  font-size: 16px;
  margin: 0 0 16px 0;
  line-height: 1.6;
  color: #000000;
}

/* 标题 */
#wechat-preview h1 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #07c160;
  text-align: center;
  color: #000000;
}

#wechat-preview h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 12px;
  margin-top: 24px;
  padding-left: 12px;
  border-left: 4px solid #07c160;
  color: #000000;
}

#wechat-preview h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 20px;
  color: #07c160;
}

#wechat-preview h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 16px;
  color: #000000;
}

#wechat-preview h5 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 6px;
  margin-top: 16px;
  color: #000000;
}

#wechat-preview h6 {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  margin-top: 14px;
  color: #000000;
}

/* 引用 */
#wechat-preview blockquote {
  font-size: 15px;
  padding: 10px 16px;
  margin-top: 16px;
  margin-bottom: 16px;
  color: #5c5c5c;
  border-left: 4px solid #07c160;
  background: #f7f7f7;
  border-radius: 0 6px 6px 0;
}

#wechat-preview blockquote p {
  margin: 0;
  font-size: 15px;
  color: #5c5c5c;
}

/* 列表 */
#wechat-preview ul,
#wechat-preview ol {
  padding-left: 24px;
  margin-top: 12px;
  margin-bottom: 16px;
}

#wechat-preview ul {
  list-style-type: disc;
}

#wechat-preview ul ul {
  list-style-type: circle;
}

#wechat-preview ol {
  list-style-type: decimal;
}

#wechat-preview li {
  line-height: 1.6;
  font-size: 16px;
  margin-bottom: 8px;
}

/* 任务列表 */
#wechat-preview .contains-task-list {
  padding-left: 0;
  list-style-type: none;
}

#wechat-preview .contains-task-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

#wechat-preview .contains-task-list li input[type="checkbox"] {
  margin-top: 6px;
  flex-shrink: 0;
}

/* 链接 */
#wechat-preview a {
  color: #07c160;
  text-decoration: none;
  font-weight: 500;
}

/* 图片 */
#wechat-preview img {
  max-width: 100%;
  border-radius: 8px;
  margin: 16px 0;
  display: block;
}

/* 分隔线 */
#wechat-preview hr {
  border-style: solid;
  border-width: 1px;
  border-color: #07c160;
  margin-top: 24px;
  margin-bottom: 24px;
}

/* 表格 */
#wechat-preview table {
  width: 100% !important;
  text-align: left;
  font-size: 15px;
  border-collapse: collapse;
  margin: 20px 0;
}

#wechat-preview table tr {
  border-top: 1px solid #eee;
  background-color: white;
}

#wechat-preview table tr:nth-child(2n) {
  background-color: #f7f7f7;
}

#wechat-preview table tr th,
#wechat-preview table tr td {
  font-size: 15px;
  border: 1px solid #eee;
  padding: 8px 16px;
  text-align: left;
  line-height: 1.6;
}

#wechat-preview table tr th {
  font-weight: bold;
  background-color: #f7f7f7;
  color: #000000;
}

/* 代码 */
#wechat-preview pre {
  padding: 16px;
  overflow: auto;
  font-size: 14px;
  line-height: 1.6;
  margin: 20px 0;
  color: #abb2bf;
  background: #282c34;
  border-radius: 8px;
  font-family: monospace;
}

#wechat-preview pre code {
  padding: 0;
  background: transparent;
  color: #abb2bf;
  font-size: 14px;
  line-height: 1.6;
}

#wechat-preview code {
  font-size: 14px;
  font-family: monospace;
  padding: 2px 6px;
  border-radius: 4px;
  color: #e83e8c;
  background: #f7f7f7;
}

/* 高亮 */
#wechat-preview mark {
  background: #fff9c2;
  padding: 2px 4px;
  border-radius: 4px;
  color: #000000;
}

/* 上标下标 */
#wechat-preview sub,
#wechat-preview sup {
  font-size: 12px;
}

/* 脚注 */
#wechat-preview .footnotes {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

#wechat-preview .footnotes hr {
  display: none;
}

#wechat-preview .footnotes ol {
  padding-left: 20px;
}

#wechat-preview .footnotes li {
  font-size: 14px;
  color: #666;
}

#wechat-preview .footnote-ref {
  font-size: 12px;
  color: #07c160;
  text-decoration: none;
}

#wechat-preview .footnote-backref {
  font-size: 12px;
  color: #07c160;
  text-decoration: none;
  margin-left: 4px;
}`
  },
  {
    id: 'academic',
    name: '学术论文',
    description: '专业、优雅的学术论文排版风格',
    css: `/* 高级学术论文主题 - 专业、优雅的排版 */

/* 全局样式 - 学术期刊风格 */
#wechat-preview {
  font-size: 16px;
  color: #1a1a1a;
  padding: 24px 16px;
  line-height: 1.8;
  word-break: break-word;
  text-align: justify;
  font-family: "Songti SC", "SimSun", "PingFang SC", serif;
  background: #fefefe;
}

/* 段落 - 学术严谨风格 */
#wechat-preview p {
  font-size: 16px;
  margin: 0 0 18px 0;
  line-height: 1.8;
  color: #2d2d2d;
  text-align: justify;
}

#wechat-preview p:first-of-type {
  margin-top: 0;
}

#wechat-preview p:last-of-type {
  margin-bottom: 0;
}

/* 标题层级 - 学术期刊风格 */
#wechat-preview h1,
#wechat-preview h2,
#wechat-preview h3,
#wechat-preview h4,
#wechat-preview h5,
#wechat-preview h6 {
  margin-top: 0;
  margin-bottom: 16px;
  padding: 0;
  font-weight: bold;
  color: #0f172a;
  text-align: left;
  line-height: 1.35;
}

/* 一级标题 - 论文标题 */
#wechat-preview h1 {
  font-size: 28px;
  font-weight: bold;
  margin-top: 0;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid #0f172a;
  text-align: center;
  font-family: "Songti SC", "SimSun", serif;
}

/* 二级标题 - 主要章节 */
#wechat-preview h2 {
  font-size: 24px;
  font-weight: bold;
  margin-top: 40px;
  margin-bottom: 20px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  padding-left: 16px;
}

/* 三级标题 - 子章节 */
#wechat-preview h3 {
  font-size: 20px;
  font-weight: bold;
  margin-top: 32px;
  margin-bottom: 16px;
  color: #1e40af;
  padding-left: 20px;
  border-left: 4px solid #1e40af;
}

/* 四级标题 - 小节 */
#wechat-preview h4 {
  font-size: 18px;
  font-weight: bold;
  margin-top: 24px;
  margin-bottom: 12px;
  color: #374151;
  font-style: italic;
}

/* 五级标题 */
#wechat-preview h5 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #4b5563;
  font-size: 14px;
}

/* 六级标题 */
#wechat-preview h6 {
  font-size: 15px;
  font-weight: bold;
  margin-top: 16px;
  margin-bottom: 8px;
  color: #6b7280;
}

/* 列表 - 学术规范风格 */
#wechat-preview ul,
#wechat-preview ol {
  margin-top: 12px;
  margin-bottom: 18px;
  padding-left: 32px;
  color: #2d2d2d;
}

#wechat-preview ul {
  list-style-type: disc;
}

#wechat-preview ul ul {
  list-style-type: circle;
  margin-top: 6px;
  padding-left: 24px;
}

#wechat-preview ol {
  list-style-type: decimal;
}

#wechat-preview ol ol {
  list-style-type: lower-alpha;
}

#wechat-preview li {
  line-height: 1.8;
  font-size: 16px;
  margin-bottom: 8px;
  color: #2d2d2d;
}

#wechat-preview li:last-child {
  margin-bottom: 0;
}

#wechat-preview li section {
  margin-top: 4px;
  margin-bottom: 4px;
  line-height: 1.8;
  text-align: justify;
  color: #2d2d2d;
}

/* 任务列表 */
#wechat-preview .contains-task-list {
  padding-left: 0;
  list-style-type: none;
}

#wechat-preview .contains-task-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

#wechat-preview .contains-task-list li input[type="checkbox"] {
  margin-top: 6px;
  flex-shrink: 0;
}

/* 引用 - 学术引用风格 */
#wechat-preview blockquote {
  margin: 24px 0;
  padding: 20px 24px;
  border-left: 4px solid #1e40af;
  background: #f0f7ff;
  border-radius: 0 8px 8px 0;
}

#wechat-preview blockquote p {
  margin: 0 0 12px 0;
  font-size: 15px;
  color: #475569;
  font-style: italic;
  line-height: 1.8;
}

#wechat-preview blockquote p:last-child {
  margin-bottom: 0;
}

/* 链接 - 学术链接风格 */
#wechat-preview a {
  color: #1e40af;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #1e40af;
}

/* 强调 - 学术强调风格 */
#wechat-preview strong {
  font-weight: bold;
  color: #0f172a;
}

#wechat-preview em {
  font-style: italic;
  color: #374151;
}

#wechat-preview em strong {
  font-weight: bold;
  color: #0f172a;
  font-style: italic;
}

#wechat-preview del {
  text-decoration: line-through;
  color: #9ca3af;
}

#wechat-preview u {
  text-decoration: underline;
}

/* 高亮 - 学术高亮风格 */
#wechat-preview mark {
  background: #fef3c7;
  padding: 0 4px;
  color: #0f172a;
  font-weight: 500;
}

/* 分隔线 - 学术分隔风格 */
#wechat-preview hr {
  border: none;
  height: 1px;
  margin: 48px auto;
  background: #e2e8f0;
  width: 80%;
}

/* 图片 - 学术图片风格 */
#wechat-preview img {
  display: block;
  margin: 24px auto;
  max-width: 100%;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

#wechat-preview figure {
  margin: 24px 0;
  text-align: center;
}

#wechat-preview figcaption {
  margin-top: 12px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
  font-style: italic;
  padding: 8px 16px;
  background: #f8fafc;
  border-radius: 4px;
  display: inline-block;
}

/* 代码 - 学术代码风格 */
#wechat-preview code {
  font-size: 14px;
  font-family: monospace;
  padding: 3px 8px;
  border-radius: 4px;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

#wechat-preview pre {
  margin: 24px 0;
  padding: 20px;
  overflow-x: auto;
  background: #0f172a;
  border-radius: 8px;
  border: 1px solid #334155;
}

#wechat-preview pre code {
  display: block;
  padding: 0;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre;
}

/* 表格 - 学术表格风格 */
#wechat-preview table {
  width: 100%;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 14px;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

#wechat-preview table tr th {
  background: #1e40af;
  color: #ffffff;
  font-weight: bold;
  padding: 14px 16px;
  text-align: left;
  border: none;
  font-size: 12px;
}

#wechat-preview table tr {
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}

#wechat-preview table tr:nth-child(2n) {
  background: #fafafa;
}

#wechat-preview table tr td {
  padding: 12px 16px;
  text-align: left;
  border: none;
  color: #374151;
  line-height: 1.6;
}

/* 脚注 - 学术脚注风格 */
#wechat-preview .footnotes {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 2px solid #e2e8f0;
}

#wechat-preview .footnotes hr {
  display: none;
}

#wechat-preview .footnotes ol {
  padding-left: 24px;
  margin: 0;
}

#wechat-preview .footnotes li {
  font-size: 14px;
  color: #475569;
  margin-bottom: 12px;
  line-height: 1.6;
}

#wechat-preview .footnote-word,
#wechat-preview .footnote-ref {
  color: #1e40af;
  font-weight: 500;
  text-decoration: none;
  font-size: 12px;
  vertical-align: super;
}

#wechat-preview .footnote-backref {
  color: #64748b;
  font-size: 12px;
  text-decoration: none;
  margin-left: 4px;
}

/* 上下标 */
#wechat-preview sub,
#wechat-preview sup {
  font-size: 12px;
}

/* 代码高亮主题 */
#wechat-preview .hljs {
  display: block;
  overflow-x: auto;
  padding: 0;
  color: #e2e8f0;
  background: transparent;
}

#wechat-preview .hljs-comment,
#wechat-preview .hljs-quote {
  color: #94a3b8;
  font-style: italic;
}

#wechat-preview .hljs-keyword,
#wechat-preview .hljs-selector-tag,
#wechat-preview .hljs-subst {
  color: #60a5fa;
  font-weight: bold;
}

#wechat-preview .hljs-number,
#wechat-preview .hljs-literal,
#wechat-preview .hljs-variable,
#wechat-preview .hljs-template-variable,
#wechat-preview .hljs-tag .hljs-attr {
  color: #fbbf24;
}

#wechat-preview .hljs-string,
#wechat-preview .hljs-doctag {
  color: #34d399;
}

#wechat-preview .hljs-title,
#wechat-preview .hljs-section,
#wechat-preview .hljs-selector-id {
  color: #f472b6;
  font-weight: bold;
}

#wechat-preview .hljs-type,
#wechat-preview .hljs-class .hljs-title {
  color: #93c5fd;
  font-weight: bold;
}

#wechat-preview .hljs-tag,
#wechat-preview .hljs-name,
#wechat-preview .hljs-attribute {
  color: #60a5fa;
}

#wechat-preview .hljs-regexp,
#wechat-preview .hljs-link {
  color: #34d399;
}

#wechat-preview .hljs-symbol,
#wechat-preview .hljs-bullet {
  color: #f472b6;
}

#wechat-preview .hljs-built_in,
#wechat-preview .hljs-builtin-name {
  color: #93c5fd;
}

#wechat-preview .hljs-meta {
  color: #94a3b8;
  font-weight: bold;
}
`
  },
  {
    id: 'aurora',
    name: '极光玻璃',
    description: '现代化玻璃态设计',
    css: `/* 极光玻璃主题 */

#wechat-preview {
  font-size: 16px;
  color: #2d3748;
  padding: 0 8px;
  line-height: 1.7;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #ffffff;
}

#wechat-preview h1 {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 32px 0;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

#wechat-preview h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 28px 0 16px 0;
  padding: 16px 20px;
  background: #f0f0ff;
  border-left: 4px solid #667eea;
  border-radius: 12px;
  color: #1a1a2e;
}

#wechat-preview h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
  color: #667eea;
  padding-left: 16px;
  border-left: 4px solid #764ba2;
}

#wechat-preview p {
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
  margin: 12px 0;
  padding: 12px 16px;
  background: #f8f9ff;
  border-radius: 12px;
  border: 1px solid #e6e8ff;
}

#wechat-preview blockquote {
  margin: 20px 0;
  padding: 20px 24px;
  background: #f0f0ff;
  border-left: 4px solid #667eea;
  border-radius: 16px;
  color: #4a5568;
}

#wechat-preview blockquote p {
  background: transparent;
  padding: 0;
  border: none;
  color: #4a5568;
}

#wechat-preview code {
  font-family: monospace;
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 8px;
  background: #667eea;
  color: white;
  font-weight: 500;
}

#wechat-preview pre {
  background: #1a1a2e;
  padding: 24px;
  border-radius: 16px;
  font-size: 14px;
  border: 1px solid #333;
}

#wechat-preview pre code {
  background: transparent;
  padding: 0;
  color: #e2e8f0;
}

#wechat-preview a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  background: #f0f0ff;
}

#wechat-preview img {
  max-width: 100%;
  border-radius: 16px;
  margin: 20px 0;
  border: 4px solid #f0f0ff;
}

#wechat-preview table {
  width: 100% !important;
  border-collapse: collapse;
  margin: 24px 0;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e6e8ff;
}

#wechat-preview table th {
  background: #667eea;
  color: white;
  font-weight: bold;
  padding: 16px;
  border: none;
}

#wechat-preview table td {
  padding: 14px 16px;
  border: 1px solid #e6e8ff;
  background: #ffffff;
  color: #2d3748;
}

#wechat-preview ul,
#wechat-preview ol {
  padding-left: 28px;
  margin: 16px 0;
}

#wechat-preview li {
  padding: 8px 0;
  color: #2d3748;
}

#wechat-preview hr {
  border: none;
  height: 4px;
  background: #667eea;
  border-radius: 2px;
  margin: 32px 0;
}

#wechat-preview mark {
  background: #ffd89b;
  color: #19547b;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
}`
  },
  {
    id: 'bauhaus',
    name: '包豪斯',
    description: '现代主义几何设计风格',
    css: `/* 包豪斯主题 */

#wechat-preview {
  font-size: 16px;
  color: #000000;
  padding: 0 8px;
  line-height: 1.6;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #ffffff;
}

#wechat-preview h1 {
  font-size: 36px;
  font-weight: bold;
  text-align: left;
  margin: 40px 0 32px 0;
  padding: 24px 0;
  border-bottom: 8px solid #ff0000;
  color: #000000;
  text-transform: uppercase;
}

#wechat-preview h2 {
  font-size: 28px;
  font-weight: bold;
  margin: 36px 0 20px 0;
  padding: 0 0 8px 0;
  border-left: 12px solid #0000ff;
  border-bottom: 4px solid #ffff00;
  color: #000000;
  text-transform: uppercase;
}

#wechat-preview h3 {
  font-size: 24px;
  font-weight: bold;
  margin: 28px 0 16px 0;
  padding: 12px 16px;
  background: #000000;
  color: #ffffff;
  display: inline-block;
  text-transform: uppercase;
}

#wechat-preview h4 {
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
  color: #ff0000;
  text-transform: uppercase;
}

#wechat-preview p {
  font-size: 16px;
  line-height: 1.8;
  margin: 16px 0;
  color: #333333;
  padding: 16px;
  border-left: 4px solid #000000;
  background: #f5f5f5;
}

#wechat-preview blockquote {
  margin: 28px 0;
  padding: 24px;
  background: #ffff00;
  border-left: none;
  border-radius: 0;
  color: #000000;
  font-weight: bold;
  border: 4px solid #000000;
}

#wechat-preview blockquote p {
  background: transparent;
  padding: 0;
  border-left: none;
  color: #000000;
  font-size: 18px;
}

#wechat-preview code {
  font-family: monospace;
  font-size: 14px;
  padding: 4px 8px;
  background: #ff0000;
  color: #ffffff;
  font-weight: bold;
}

#wechat-preview pre {
  background: #0000ff;
  padding: 24px;
  border-radius: 0;
  font-size: 14px;
  border: 4px solid #000000;
}

#wechat-preview pre code {
  background: transparent;
  color: #ffffff;
  padding: 0;
}

#wechat-preview a {
  color: #0000ff;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 3px solid #ff0000;
  padding-bottom: 2px;
}

#wechat-preview img {
  max-width: 100%;
  margin: 24px 0;
  border: 8px solid #000000;
}

#wechat-preview table {
  width: 100% !important;
  border-collapse: collapse;
  margin: 24px 0;
  border: 4px solid #000000;
}

#wechat-preview table th {
  background: #000000;
  color: #ffffff;
  font-weight: bold;
  padding: 16px;
  border: 4px solid #000000;
  text-transform: uppercase;
}

#wechat-preview table td {
  padding: 16px;
  border: 4px solid #000000;
  background: #ffffff;
}

#wechat-preview table tr:nth-child(even) td {
  background: #ffff00;
}

#wechat-preview ul,
#wechat-preview ol {
  padding-left: 0;
  margin: 20px 0;
  list-style: none;
}

#wechat-preview li {
  padding: 12px 16px;
  margin: 8px 0;
  background: #f5f5f5;
  border-left: 8px solid #ff0000;
  font-weight: 500;
}

#wechat-preview li:nth-child(2) {
  border-left-color: #0000ff;
}

#wechat-preview li:nth-child(3) {
  border-left-color: #ffff00;
}

#wechat-preview li:nth-child(4) {
  border-left-color: #ff0000;
}

#wechat-preview hr {
  border: none;
  height: 12px;
  background: #ff0000;
  margin: 40px 0;
}

#wechat-preview mark {
  background: #ffff00;
  color: #000000;
  padding: 2px 6px;
  font-weight: bold;
}`
  },
  {
    id: 'cyberpunk',
    name: '赛博朋克',
    description: '未来科技感风格',
    css: `/* 赛博朋克主题 */

#wechat-preview {
  font-size: 15px;
  color: #00ff41;
  padding: 0 8px;
  line-height: 1.6;
  font-family: "Courier New", monospace;
  background: #0d0221;
}

#wechat-preview h1 {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin: 32px 0;
  padding: 20px;
  background: #ff00ff;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 4px;
  border: 2px solid #00ff41;
}

#wechat-preview h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 28px 0 16px 0;
  padding: 12px 20px;
  border-left: 4px solid #ff00ff;
  border-bottom: 2px solid #00ffff;
  color: #00ff41;
  text-transform: uppercase;
  background: rgba(0, 255, 65, 0.1);
}

#wechat-preview h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
  color: #ff00ff;
  text-transform: uppercase;
  border-bottom: 1px dashed #00ffff;
  padding-bottom: 8px;
}

#wechat-preview h4 {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  color: #00ffff;
}

#wechat-preview p {
  font-size: 15px;
  line-height: 1.8;
  margin: 12px 0;
  color: #00ff41;
  padding: 16px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #00ff41;
}

#wechat-preview blockquote {
  margin: 24px 0;
  padding: 20px 24px;
  background: rgba(255, 0, 255, 0.2);
  border-left: 4px solid #00ffff;
  border-right: 4px solid #ff00ff;
  color: #00ffff;
  font-style: italic;
}

#wechat-preview blockquote p {
  background: transparent;
  border: none;
  padding: 0;
  color: #00ffff;
}

#wechat-preview code {
  font-family: monospace;
  font-size: 14px;
  padding: 4px 8px;
  background: #000000;
  color: #00ff41;
  border: 1px solid #ff00ff;
  font-weight: bold;
}

#wechat-preview pre {
  background: #000000;
  padding: 20px;
  border: 2px solid #00ffff;
  font-size: 14px;
}

#wechat-preview pre code {
  background: transparent;
  border: none;
  padding: 0;
  color: #00ff41;
}

#wechat-preview a {
  color: #00ffff;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 1px solid #ff00ff;
  text-transform: uppercase;
}

#wechat-preview img {
  max-width: 100%;
  margin: 20px 0;
  border: 3px solid #00ff41;
}

#wechat-preview table {
  width: 100% !important;
  border-collapse: collapse;
  margin: 24px 0;
  border: 2px solid #00ff41;
}

#wechat-preview table th {
  background: #ff00ff;
  color: #000000;
  font-weight: bold;
  padding: 12px 16px;
  text-transform: uppercase;
  border: 1px solid #00ffff;
}

#wechat-preview table td {
  padding: 12px 16px;
  border: 1px solid #00ff41;
  color: #00ff41;
  background: rgba(0, 0, 0, 0.3);
}

#wechat-preview table tr:nth-child(even) td {
  background: rgba(255, 0, 255, 0.1);
}

#wechat-preview ul,
#wechat-preview ol {
  padding-left: 28px;
  margin: 16px 0;
  list-style: none;
}

#wechat-preview li {
  padding: 8px 0;
  color: #00ff41;
  padding-left: 24px;
  position: relative;
}

#wechat-preview li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: #ff00ff;
}

#wechat-preview hr {
  border: none;
  height: 2px;
  background: #00ff41;
  margin: 32px 0;
}

#wechat-preview mark {
  background: #ff00ff;
  color: #000000;
  padding: 2px 6px;
  font-weight: bold;
}`
  },
  {
    id: 'newsletter',
    name: '新闻通讯',
    description: '适合新闻和通讯类文章',
    css: `/* 新闻通讯主题 */

#wechat-preview {
  font-size: 16px;
  color: #333333;
  padding: 0 16px;
  line-height: 1.7;
  font-family: "Songti SC", "SimSun", "PingFang SC", serif;
  background: #ffffff;
}

#wechat-preview h1 {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  margin: 32px 0 8px 0;
  padding: 0;
  border: none;
  color: #1a1a1a;
  line-height: 1.3;
}

#wechat-preview h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 32px 0 16px 0;
  padding: 0 0 8px 0;
  border-bottom: 2px solid #333;
  color: #1a1a1a;
}

#wechat-preview h3 {
  font-size: 20px;
  font-weight: bold;
  margin: 24px 0 12px 0;
  color: #cc0000;
  font-style: italic;
}

#wechat-preview h4 {
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 10px 0;
  color: #333;
}

#wechat-preview p {
  font-size: 16px;
  line-height: 1.8;
  margin: 16px 0;
  color: #333;
  text-align: justify;
  text-indent: 2em;
}

#wechat-preview p:first-of-type {
  font-size: 18px;
  color: #555;
  font-style: italic;
}

#wechat-preview blockquote {
  margin: 24px 0;
  padding: 20px 24px;
  border-left: 4px solid #cc0000;
  background: #f9f9f9;
  color: #555;
  font-style: italic;
}

#wechat-preview blockquote p {
  text-indent: 0;
  font-style: italic;
}

#wechat-preview code {
  font-family: monospace;
  font-size: 14px;
  padding: 2px 6px;
  background: #f0f0f0;
  color: #cc0000;
}

#wechat-preview pre {
  background: #2d2d2d;
  padding: 20px;
  margin: 24px 0;
  font-size: 14px;
  border-radius: 4px;
}

#wechat-preview pre code {
  background: transparent;
  color: #f0f0f0;
  padding: 0;
}

#wechat-preview a {
  color: #0066cc;
  text-decoration: underline;
}

#wechat-preview img {
  max-width: 100%;
  margin: 24px 0;
  border: 1px solid #ddd;
  padding: 4px;
}

#wechat-preview table {
  width: 100% !important;
  border-collapse: collapse;
  margin: 24px 0;
  font-size: 15px;
  border: 1px solid #ddd;
}

#wechat-preview table th {
  background: #333;
  color: white;
  font-weight: bold;
  padding: 12px 16px;
  border: 1px solid #333;
}

#wechat-preview table td {
  padding: 10px 16px;
  border: 1px solid #ddd;
}

#wechat-preview table tr:nth-child(even) {
  background: #f9f9f9;
}

#wechat-preview ul,
#wechat-preview ol {
  padding-left: 28px;
  margin: 16px 0;
}

#wechat-preview li {
  padding: 4px 0;
}

#wechat-preview hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 32px 0;
}

#wechat-preview mark {
  background: #fff3cd;
  color: #856404;
  padding: 2px 6px;
  border-radius: 4px;
}`
  },
  {
    id: 'claude',
    name: 'Claude',
    description: '温暖优雅的文学风格，灵感来自 Claude',
    css: `/* Claude 主题 - 温暖优雅的文学风格 */

#wechat-preview {
  font-size: 17px;
  color: #141413;
  padding: 0 8px;
  line-height: 1.60;
  word-break: break-word;
  text-align: left;
  font-family: "PingFang SC", "Microsoft YaHei", serif;
  background: #f5f4ed;
}

#wechat-preview p {
  font-size: 17px;
  margin: 0 0 16px 0;
  line-height: 1.60;
  color: #4d4c48;
}

#wechat-preview h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 30px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e6dc;
  text-align: center;
  color: #141413;
  line-height: 1.10;
}

#wechat-preview h2 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 30px;
  padding-left: 12px;
  border-left: 3px solid #c96442;
  color: #141413;
  line-height: 1.20;
}

#wechat-preview h3 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 24px;
  color: #c96442;
  line-height: 1.20;
}

#wechat-preview h4 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 6px;
  margin-top: 20px;
  color: #141413;
}

#wechat-preview h5 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 18px;
  color: #141413;
}

#wechat-preview h6 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  margin-top: 16px;
  color: #141413;
}

#wechat-preview blockquote {
  font-size: 15px;
  padding: 16px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #87867f;
  border-left: 3px solid #c96442;
  background: #faf9f5;
  border-radius: 8px;
}

#wechat-preview blockquote p {
  margin: 0;
  font-size: 15px;
  color: #5e5d59;
}

#wechat-preview ul,
#wechat-preview ol {
  padding-left: 28px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #4d4c48;
}

#wechat-preview ul {
  list-style-type: disc;
}

#wechat-preview ul ul {
  list-style-type: circle;
}

#wechat-preview ol {
  list-style-type: decimal;
}

#wechat-preview li {
  line-height: 1.7;
  font-size: 17px;
  color: #4d4c48;
  margin-bottom: 8px;
}

#wechat-preview .contains-task-list {
  padding-left: 0;
  list-style-type: none;
}

#wechat-preview .contains-task-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

#wechat-preview .contains-task-list li input[type="checkbox"] {
  margin-top: 6px;
  flex-shrink: 0;
}

#wechat-preview a {
  color: #c96442;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #e8e6dc;
}

#wechat-preview img {
  max-width: 100%;
  border-radius: 12px;
  margin: 16px 0;
  display: block;
}

#wechat-preview hr {
  border-style: solid;
  border-width: 1px;
  border-color: #e8e6dc;
  margin-top: 28px;
  margin-bottom: 28px;
}

#wechat-preview table {
  width: 100% !important;
  text-align: left;
  font-size: 15px;
  border-collapse: collapse;
  margin: 20px 0;
  border: 1px solid #e8e6dc;
  border-radius: 8px;
  overflow: hidden;
}

#wechat-preview table tr {
  border-top: 1px solid #e8e6dc;
  background-color: #faf9f5;
}

#wechat-preview table tr:nth-child(2n) {
  background-color: #f5f4ed;
}

#wechat-preview table tr th,
#wechat-preview table tr td {
  font-size: 15px;
  border: 1px solid #e8e6dc;
  padding: 10px 16px;
  text-align: left;
  line-height: 1.6;
}

#wechat-preview table tr th {
  font-weight: bold;
  background-color: #faf9f5;
  color: #141413;
}

#wechat-preview pre {
  padding: 16px;
  overflow: auto;
  font-size: 14px;
  line-height: 1.6;
  margin: 20px 0;
  color: #141413;
  background: #faf9f5;
  border-radius: 8px;
  border: 1px solid #e8e6dc;
  font-family: monospace;
}

#wechat-preview pre code {
  padding: 0;
  background: transparent;
  color: #141413;
  font-size: 14px;
  line-height: 1.6;
}

#wechat-preview code {
  font-size: 14px;
  font-family: monospace;
  padding: 3px 6px;
  border-radius: 4px;
  color: #c96442;
  background: #faf9f5;
}

#wechat-preview mark {
  background: #fdecc8;
  padding: 2px 4px;
  border-radius: 4px;
  color: #141413;
}

#wechat-preview sub,
#wechat-preview sup {
  font-size: 12px;
}

#wechat-preview .footnotes {
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid #e8e6dc;
}

#wechat-preview .footnotes hr {
  display: none;
}

#wechat-preview .footnotes ol {
  padding-left: 24px;
}

#wechat-preview .footnotes li {
  font-size: 14px;
  color: #87867f;
}

#wechat-preview .footnote-ref {
  font-size: 12px;
  color: #c96442;
  text-decoration: none;
  border: none;
}

#wechat-preview .footnote-backref {
  font-size: 12px;
  color: #c96442;
  text-decoration: none;
  border: none;
  margin-left: 4px;
}
`
  },
  {
    id: 'binance',
    name: 'Binance',
    description: '专业金融科技风格，灵感来自 Binance',
    css: `/* Binance 主题 - 专业金融科技风格 */

#wechat-preview {
  font-size: 16px;
  color: #1E2026;
  padding: 0 8px;
  line-height: 1.50;
  word-break: break-word;
  text-align: left;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  background: #FFFFFF;
}

#wechat-preview p {
  font-size: 16px;
  margin: 0 0 16px 0;
  line-height: 1.50;
  color: #32313A;
}

#wechat-preview h1 {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
  margin-top: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E6E8EA;
  color: #1E2026;
  line-height: 1.00;
  text-align: left;
}

#wechat-preview h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
  margin-top: 32px;
  color: #1E2026;
  line-height: 1.00;
}

#wechat-preview h3 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 24px;
  color: #1E2026;
  line-height: 1.25;
}

#wechat-preview h4 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 20px;
  color: #1E2026;
}

#wechat-preview h5 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 6px;
  margin-top: 16px;
  color: #1E2026;
}

#wechat-preview h6 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  margin-top: 14px;
  color: #1E2026;
}

#wechat-preview blockquote {
  font-size: 15px;
  padding: 16px 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #848E9C;
  border-left: 3px solid #F0B90B;
  background: #F5F5F5;
  border-radius: 8px;
}

#wechat-preview blockquote p {
  margin: 0;
  font-size: 15px;
  color: #848E9C;
}

#wechat-preview ul,
#wechat-preview ol {
  padding-left: 28px;
  margin-top: 12px;
  margin-bottom: 16px;
  color: #32313A;
}

#wechat-preview ul {
  list-style-type: disc;
}

#wechat-preview ul ul {
  list-style-type: circle;
}

#wechat-preview ol {
  list-style-type: decimal;
}

#wechat-preview li {
  line-height: 1.50;
  font-size: 16px;
  color: #32313A;
  margin-bottom: 8px;
}

#wechat-preview .contains-task-list {
  padding-left: 0;
  list-style-type: none;
}

#wechat-preview .contains-task-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

#wechat-preview .contains-task-list li input[type="checkbox"] {
  margin-top: 6px;
  flex-shrink: 0;
}

#wechat-preview a {
  color: #F0B90B;
  text-decoration: none;
  font-weight: bold;
  border-bottom: 1px solid #F0B90B;
}

#wechat-preview img {
  max-width: 100%;
  border-radius: 12px;
  margin: 20px 0;
  display: block;
  border: 1px solid #E6E8EA;
}

#wechat-preview hr {
  border-style: solid;
  border-width: 1px;
  border-color: #E6E8EA;
  margin-top: 32px;
  margin-bottom: 32px;
}

#wechat-preview table {
  width: 100% !important;
  text-align: left;
  font-size: 14px;
  border-collapse: collapse;
  margin: 24px 0;
  border: 1px solid #E6E8EA;
  border-radius: 8px;
  overflow: hidden;
}

#wechat-preview table tr {
  border-top: 1px solid #E6E8EA;
  background-color: #FFFFFF;
}

#wechat-preview table tr:nth-child(2n) {
  background-color: #F5F5F5;
}

#wechat-preview table tr th,
#wechat-preview table tr td {
  font-size: 14px;
  border: 1px solid #E6E8EA;
  padding: 12px 16px;
  text-align: left;
  line-height: 1.50;
}

#wechat-preview table tr th {
  font-weight: bold;
  background: #F0B90B;
  color: #1E2026;
  text-transform: uppercase;
  font-size: 12px;
}

#wechat-preview pre {
  padding: 20px;
  overflow: auto;
  font-size: 14px;
  line-height: 1.6;
  margin: 24px 0;
  color: #E2E8F0;
  background: #222126;
  border-radius: 8px;
  border: 1px solid #334155;
  font-family: monospace;
}

#wechat-preview pre code {
  padding: 0;
  background: transparent;
  color: #E2E8F0;
  font-size: 14px;
  line-height: 1.6;
}

#wechat-preview code {
  font-size: 14px;
  font-family: monospace;
  padding: 3px 8px;
  border-radius: 4px;
  color: #1E2026;
  background: #F0B90B;
  font-weight: 500;
}

#wechat-preview mark {
  background: #FFD000;
  padding: 2px 4px;
  border-radius: 4px;
  color: #1E2026;
  font-weight: 500;
}

#wechat-preview sub,
#wechat-preview sup {
  font-size: 12px;
}

#wechat-preview .footnotes {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #E6E8EA;
}

#wechat-preview .footnotes hr {
  display: none;
}

#wechat-preview .footnotes ol {
  padding-left: 24px;
}

#wechat-preview .footnotes li {
  font-size: 14px;
  color: #848E9C;
}

#wechat-preview .footnote-ref {
  font-size: 12px;
  color: #F0B90B;
  text-decoration: none;
  border: none;
  font-weight: bold;
}

#wechat-preview .footnote-backref {
  font-size: 12px;
  color: #848E9C;
  text-decoration: none;
  border: none;
  margin-left: 4px;
}

#wechat-preview .callout {
  margin: 24px 0;
  padding: 20px 24px;
  border-radius: 8px;
  border: 1px solid #E6E8EA;
  background: #FFFFFF;
  position: relative;
  overflow: hidden;
}

#wechat-preview .callout::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #F0B90B;
}

#wechat-preview .callout-title {
  font-weight: bold;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1E2026;
  font-size: 16px;
}

#wechat-preview .callout-icon {
  font-size: 20px;
  color: #F0B90B;
}
`
  }
];

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
