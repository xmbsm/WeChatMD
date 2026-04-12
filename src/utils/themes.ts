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
  word-spacing: 0px;
  letter-spacing: 0px;
  word-break: break-word;
  word-wrap: break-word;
  text-align: left;
  font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", "Microsoft YaHei", "微软雅黑", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* 段落 */
#wechat-preview p {
  font-size: 16px;
  margin: 0;
  line-height: 26px;
  color: #000000;
}

/* 标题 */
#wechat-preview h1 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #07c160;
  text-align: center;
  color: #000000;
}

#wechat-preview h2 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 20px;
  padding-left: 12px;
  border-left: 4px solid #07c160;
  color: #000000;
}

#wechat-preview h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 20px;
  color: #07c160;
}

#wechat-preview h4 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 20px;
  color: #000000;
}

#wechat-preview h5 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 20px;
  color: #000000;
}

#wechat-preview h6 {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 5px;
  margin-top: 20px;
  color: #000000;
}

/* 引用 */
#wechat-preview blockquote {
  font-size: 15px;
  padding: 10px 16px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #5c5c5c;
  border-left: 4px solid #07c160;
  background: #f7f7f7;
  border-radius: 6px;
}

#wechat-preview blockquote p {
  margin: 0;
  font-size: 15px;
  color: #5c5c5c;
}

/* 列表 */
#wechat-preview ul,
#wechat-preview ol {
  padding-left: 28px;
  margin-top: 8px;
  margin-bottom: 8px;
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
  line-height: 26px;
  font-size: 16px;
}

#wechat-preview li section {
  margin-top: 0;
  margin-bottom: 0;
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

#wechat-preview .contains-task-list li .task-list-item-checkbox {
  transform: scale(1.2);
}

#wechat-preview .contains-task-list li .task-list-item-checkbox:checked {
  accent-color: #07c160;
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
  margin: 8px 0;
  display: block;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  display: table;
  width: 100% !important;
  text-align: left;
  font-size: 15px;
  border-collapse: collapse;
  margin: 20px 0;
}

#wechat-preview tbody {
  border: 0;
}

#wechat-preview table tr {
  border: 0;
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
  line-height: 26px;
  word-break: normal;
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
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
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
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
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
}

/* 内容块 */
#wechat-preview [data-node-type='block'] {
  margin-top: 8px;
  margin-bottom: 8px;
}`
  },
  {
    id: 'academic',
    name: '学术论文',
    description: '适合学术写作和论文',
    css: `/* 学术论文主题 */

#wechat-preview {
  font-size: 15px;
  color: #333333;
  padding: 0 16px;
  line-height: 1.8;
  text-align: justify;
  font-family: "Times New Roman", "Songti SC", "SimSun", "STSong", "宋体", serif;
}

#wechat-preview h1 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-top: 32px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;
}

#wechat-preview h2 {
  font-size: 20px;
  font-weight: bold;
  margin-top: 28px;
  margin-bottom: 12px;
  padding-left: 0;
  border-left: none;
}

#wechat-preview h3 {
  font-size: 17px;
  font-weight: bold;
  margin-top: 24px;
  margin-bottom: 10px;
  color: #333333;
}

#wechat-preview h4 {
  font-size: 15px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 8px;
}

#wechat-preview p {
  font-size: 15px;
  line-height: 1.8;
  text-indent: 2em;
  margin-bottom: 12px;
  text-align: justify;
}

#wechat-preview blockquote {
  font-size: 14px;
  border-left: 3px solid #666;
  padding: 12px 20px;
  margin: 20px 0;
  color: #555;
  background: #f9f9f9;
}

#wechat-preview blockquote p {
  text-indent: 0;
}

#wechat-preview code {
  font-family: "Courier New", Courier, monospace;
  font-size: 14px;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}

#wechat-preview pre {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 4px;
  font-size: 13px;
}

#wechat-preview table {
  font-size: 14px;
  margin: 20px auto;
  width: auto !important;
}

#wechat-preview table th,
#wechat-preview table td {
  border: 1px solid #999;
  padding: 8px 16px;
}

#wechat-preview a {
  color: #0066cc;
  text-decoration: underline;
}

#wechat-preview hr {
  border: none;
  border-top: 1px solid #ccc;
  margin: 32px 0;
}`
  },
  {
    id: 'aurora',
    name: '极光玻璃',
    description: '现代化玻璃态设计',
    css: `/* 极光玻璃主题 */

#wechat-preview {
  font-size: 16px;
  color: #ffffff;
  padding: 0;
  line-height: 1.7;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

#wechat-preview h1 {
  font-size: 32px;
  font-weight: 800;
  text-align: center;
  margin: 32px 0;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  text-shadow: 0 2px 10px rgba(0,0,0,0.2);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.4);
}

#wechat-preview h2 {
  font-size: 24px;
  font-weight: 700;
  margin: 28px 0 16px 0;
  padding: 16px 20px;
  background: linear-gradient(90deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%);
  border-left: 4px solid #667eea;
  border-radius: 12px;
  color: #1a1a2e;
  backdrop-filter: blur(10px);
}

#wechat-preview h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: #667eea;
  position: relative;
  padding-left: 16px;
}

#wechat-preview h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
}

#wechat-preview p {
  font-size: 16px;
  line-height: 1.8;
  color: #2d3748;
  margin: 12px 0;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

#wechat-preview blockquote {
  margin: 20px 0;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-left: none;
  border-radius: 16px;
  color: #4a5568;
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
}

#wechat-preview blockquote::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 20px;
  font-size: 60px;
  font-weight: 800;
  color: rgba(102, 126, 234, 0.2);
  font-family: Georgia, serif;
}

#wechat-preview blockquote p {
  background: transparent;
  padding: 0;
  box-shadow: none;
  color: #4a5568;
}

#wechat-preview code {
  font-family: "SF Mono", "Fira Code", "Consolas", monospace;
  font-size: 14px;
  padding: 4px 10px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 500;
}

#wechat-preview pre {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 24px;
  border-radius: 16px;
  font-size: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  transition: all 0.3s ease;
}

#wechat-preview img {
  max-width: 100%;
  border-radius: 16px;
  margin: 20px 0;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.25);
  border: 4px solid rgba(255, 255, 255, 0.8);
}

#wechat-preview table {
  width: 100% !important;
  border-collapse: separate;
  border-spacing: 0;
  margin: 24px 0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.15);
  backdrop-filter: blur(10px);
}

#wechat-preview table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 600;
  padding: 16px;
  border: none;
}

#wechat-preview table td {
  padding: 14px 16px;
  border: none;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
}

#wechat-preview table tr:last-child td {
  border-bottom: none;
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
  background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
  border-radius: 2px;
  margin: 32px 0;
}

#wechat-preview mark {
  background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
  color: white;
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
  padding: 0;
  line-height: 1.6;
  font-family: "Helvetica Neue", Helvetica, Arial, "Bauhaus 93", sans-serif;
}

#wechat-preview h1 {
  font-size: 48px;
  font-weight: 900;
  text-align: left;
  margin: 40px 0 32px 0;
  padding: 24px 0;
  border-bottom: 8px solid #ff0000;
  color: #000000;
  letter-spacing: -2px;
  text-transform: uppercase;
}

#wechat-preview h2 {
  font-size: 32px;
  font-weight: 800;
  margin: 36px 0 20px 0;
  padding: 0 0 8px 0;
  border-left: 12px solid #0000ff;
  border-bottom: 4px solid #ffff00;
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 1px;
}

#wechat-preview h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 28px 0 16px 0;
  padding: 12px 16px;
  background: #000000;
  color: #ffffff;
  display: inline-block;
  text-transform: uppercase;
}

#wechat-preview h4 {
  font-size: 20px;
  font-weight: 700;
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
  font-weight: 600;
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
  font-family: "Courier New", monospace;
  font-size: 14px;
  padding: 4px 8px;
  background: #ff0000;
  color: #ffffff;
  font-weight: 700;
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
  font-weight: 700;
  border-bottom: 3px solid #ff0000;
  padding-bottom: 2px;
}

#wechat-preview img {
  max-width: 100%;
  margin: 24px 0;
  border: 8px solid #000000;
  filter: grayscale(100%);
}

#wechat-preview table {
  width: 100% !important;
  border-collapse: separate;
  border-spacing: 4px;
  margin: 24px 0;
}

#wechat-preview table th {
  background: #000000;
  color: #ffffff;
  font-weight: 700;
  padding: 16px;
  border: none;
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
  border-left: 8px solid;
  border-color: #ff0000;
  font-weight: 500;
}

#wechat-preview li:nth-child(2) {
  border-color: #0000ff;
}

#wechat-preview li:nth-child(3) {
  border-color: #ffff00;
}

#wechat-preview li:nth-child(4) {
  border-color: #ff0000;
}

#wechat-preview hr {
  border: none;
  height: 12px;
  background: repeating-linear-gradient(
    90deg,
    #ff0000 0px,
    #ff0000 40px,
    #ffff00 40px,
    #ffff00 80px,
    #0000ff 80px,
    #0000ff 120px
  );
  margin: 40px 0;
}

#wechat-preview mark {
  background: #ffff00;
  color: #000000;
  padding: 2px 6px;
  font-weight: 700;
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
  padding: 0;
  line-height: 1.6;
  font-family: "Courier New", "Lucida Console", Monaco, monospace;
  background: #0d0221;
}

#wechat-preview h1 {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin: 32px 0;
  padding: 20px;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  color: #000000;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: 0 0 20px #ff00ff, 0 0 40px #00ffff;
  border: 2px solid #00ff41;
  animation: glitch 2s infinite;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
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
  position: relative;
}

#wechat-preview p::before {
  content: '>';
  position: absolute;
  left: 8px;
  top: 16px;
  color: #ff00ff;
  font-weight: bold;
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

#wechat-preview blockquote p::before {
  display: none;
}

#wechat-preview code {
  font-family: "Courier New", monospace;
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
  position: relative;
  overflow: hidden;
}

#wechat-preview pre::before {
  content: 'SYSTEM OUTPUT';
  position: absolute;
  top: 8px;
  right: 16px;
  color: #ff00ff;
  font-size: 12px;
  text-transform: uppercase;
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

#wechat-preview a:hover {
  color: #ff00ff;
  text-shadow: 0 0 10px #ff00ff;
}

#wechat-preview img {
  max-width: 100%;
  margin: 20px 0;
  border: 3px solid #00ff41;
  filter: hue-rotate(90deg) saturate(2);
  box-shadow: 0 0 20px #00ffff;
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
  position: relative;
  padding-left: 24px;
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
  background: linear-gradient(90deg, transparent, #00ff41, #ff00ff, #00ffff, transparent);
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
  font-family: "Georgia", "Times New Roman", "Songti SC", "SimSun", "华文宋体", serif;
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
  border-left: none;
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

#wechat-preview p:first-of-type::first-letter {
  font-size: 48px;
  font-weight: bold;
  float: left;
  line-height: 1;
  margin-right: 8px;
  color: #cc0000;
}

#wechat-preview blockquote {
  margin: 24px 40px;
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

#wechat-preview blockquote p:first-of-type::first-letter {
  font-size: 16px;
  font-weight: normal;
  float: none;
  margin-right: 0;
  color: #555;
}

#wechat-preview code {
  font-family: "Courier New", monospace;
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
