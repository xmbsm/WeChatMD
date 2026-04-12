import { useState, useEffect } from 'react';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { clsx } from 'clsx';

export default function MarkdownGuide() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 检查系统主题偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={clsx('min-h-screen', isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-800')}>
      {/* 顶部导航 */}
      <div className={clsx(
        'sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b',
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      )}>
        <div className="flex items-center gap-3">
          <a 
            href="/" 
            className={clsx(
              'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
              isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回编辑器</span>
          </a>
        </div>
        <button
          onClick={toggleTheme}
          className={clsx(
            'p-2 rounded-lg transition-all',
            isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
          )}
          title={isDark ? '切换到浅色模式' : '切换到深色模式'}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* 主内容 */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-8 text-center">Markdown 基础语法</h1>
        
        <div className="flex flex-col md:flex-row-reverse gap-8">
          {/* 右侧目录 */}
          <div className="md:w-1/4">
            <div className={clsx(
              'sticky top-24 p-6 rounded-lg',
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            )}>
              <h2 className="text-2xl font-bold mb-4">目录</h2>
              <ul className="space-y-2">
                <li><a href="#headings" className="text-[#07c160] hover:underline">标题</a></li>
                <li><a href="#bold" className="text-[#07c160] hover:underline">粗体</a></li>
                <li><a href="#italic" className="text-[#07c160] hover:underline">斜体</a></li>
                <li><a href="#strikethrough" className="text-[#07c160] hover:underline">删除线</a></li>
                <li><a href="#blockquotes" className="text-[#07c160] hover:underline">引用</a></li>
                <li><a href="#ordered-lists" className="text-[#07c160] hover:underline">有序列表</a></li>
                <li><a href="#unordered-lists" className="text-[#07c160] hover:underline">无序列表</a></li>
                <li><a href="#code" className="text-[#07c160] hover:underline">代码</a></li>
                <li><a href="#horizontal-rules" className="text-[#07c160] hover:underline">水平分隔线</a></li>
                <li><a href="#links" className="text-[#07c160] hover:underline">链接</a></li>
                <li><a href="#images" className="text-[#07c160] hover:underline">图片</a></li>
                <li><a href="#tables" className="text-[#07c160] hover:underline">表格</a></li>
                <li><a href="#fenced-code-blocks" className="text-[#07c160] hover:underline">代码块</a></li>
                <li><a href="#task-lists" className="text-[#07c160] hover:underline">任务列表</a></li>
              </ul>
            </div>
          </div>
          
          {/* 左侧内容 */}
          <div className="md:w-3/4">
            <div className={clsx(
              'prose max-w-none',
              isDark ? 'prose-invert' : ''
            )}>
              <p className="text-lg text-center mb-10">
                Markdown 是一种轻量级标记语言，使用易读易写的纯文本格式编写文档，然后可以转换为有效的 HTML 文档。
              </p>

          {/* 标题 */}
          <section id="headings" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              标题
            </h2>
            <p>Markdown 支持 6 级标题，使用 # 符号表示：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                # 一级标题
                ## 二级标题
                ### 三级标题
                #### 四级标题
                ##### 五级标题
                ###### 六级标题
              </pre>
            </div>
          </section>

          {/* 粗体 */}
          <section id="bold" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              粗体
            </h2>
            <p>使用两个星号或下划线包围文本：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                **这是粗体文本**
                __这也是粗体文本__
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <p><strong>这是粗体文本</strong></p>
              <p><strong>这也是粗体文本</strong></p>
            </div>
          </section>

          {/* 斜体 */}
          <section id="italic" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              斜体
            </h2>
            <p>使用一个星号或下划线包围文本：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                *这是斜体文本*
                _这也是斜体文本_
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <p><em>这是斜体文本</em></p>
              <p><em>这也是斜体文本</em></p>
            </div>
          </section>

          {/* 删除线 */}
          <section id="strikethrough" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              删除线
            </h2>
            <p>使用两个波浪线包围文本：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                ~~这是删除线文本~~
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <p><del>这是删除线文本</del></p>
            </div>
          </section>

          {/* 引用 */}
          <section id="blockquotes" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              引用
            </h2>
            <p>使用 &gt; 符号表示引用：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                &gt; 这是一个引用
                &gt;
                &gt; 引用可以有多行
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4 pl-4 border-l-4" style={{ borderColor: isDark ? '#4b5563' : '#e5e7eb' }}>
              <p>这是一个引用</p>
              <p></p>
              <p>引用可以有多行</p>
            </div>
          </section>

          {/* 有序列表 */}
          <section id="ordered-lists" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              有序列表
            </h2>
            <p>使用数字和点表示有序列表：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                1. 第一项
                2. 第二项
                3. 第三项
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <ol>
                <li>第一项</li>
                <li>第二项</li>
                <li>第三项</li>
              </ol>
            </div>
          </section>

          {/* 无序列表 */}
          <section id="unordered-lists" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              无序列表
            </h2>
            <p>使用星号、加号或减号表示无序列表：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                * 第一项
                * 第二项
                * 第三项
                
                + 第一项
                + 第二项
                + 第三项
                
                - 第一项
                - 第二项
                - 第三项
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <ul>
                <li>第一项</li>
                <li>第二项</li>
                <li>第三项</li>
              </ul>
            </div>
          </section>

          {/* 代码 */}
          <section id="code" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              行内代码
            </h2>
            <p>使用反引号包围代码：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                这是 `行内代码` 示例
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <p>这是 <code>行内代码</code> 示例</p>
            </div>
          </section>

          {/* 水平分隔线 */}
          <section id="horizontal-rules" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              水平分隔线
            </h2>
            <p>使用三个或更多的星号、减号或下划线：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                ***
                
                ---
                
                ___
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <hr style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }} />
            </div>
          </section>

          {/* 链接 */}
          <section id="links" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              链接
            </h2>
            <p>使用方括号和圆括号表示链接：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                [链接文本](https://example.com)
                
                [链接文本](https://example.com "链接标题")
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <p><a href="https://example.com" className="text-[#07c160] hover:underline">链接文本</a></p>
              <p><a href="https://example.com" title="链接标题" className="text-[#07c160] hover:underline">链接文本</a></p>
            </div>
          </section>

          {/* 图片 */}
          <section id="images" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              图片
            </h2>
            <p>使用感叹号、方括号和圆括号表示图片：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                ![图片替代文本](https://example.com/image.jpg)
                
                ![图片替代文本](https://example.com/image.jpg "图片标题")
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <p><img src="https://via.placeholder.com/150" alt="图片替代文本" title="图片标题" className="max-w-full h-auto" /></p>
            </div>
          </section>

          {/* 表格 */}
          <section id="tables" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              表格
            </h2>
            <p>使用管道符和连字符创建表格：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                | 表头 1 | 表头 2 |
                | --- | --- |
                | 单元格 1 | 单元格 2 |
                | 单元格 3 | 单元格 4 |
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4 overflow-x-auto">
              <table className={clsx(
                'min-w-full border-collapse',
                isDark ? 'border-gray-700' : 'border-gray-200'
              )}>
                <thead>
                  <tr className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                    <th className={clsx(
                      'px-4 py-2 border',
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    )}>表头 1</th>
                    <th className={clsx(
                      'px-4 py-2 border',
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    )}>表头 2</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                    <td className={clsx(
                      'px-4 py-2 border',
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    )}>单元格 1</td>
                    <td className={clsx(
                      'px-4 py-2 border',
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    )}>单元格 2</td>
                  </tr>
                  <tr className={isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                    <td className={clsx(
                      'px-4 py-2 border',
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    )}>单元格 3</td>
                    <td className={clsx(
                      'px-4 py-2 border',
                      isDark ? 'border-gray-700' : 'border-gray-200'
                    )}>单元格 4</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 代码块 */}
          <section id="fenced-code-blocks" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              代码块
            </h2>
            <p>使用三个反引号包围代码块，可以指定语言：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                {"```javascript\nfunction hello() {\n  console.log('Hello, world!');\n}\n```"}
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto font-mono text-sm',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre>
                <code>
                  {`function hello() {
  console.log('Hello, world!');
}`}
                </code>
              </pre>
            </div>
          </section>

          {/* 任务列表 */}
          <section id="task-lists" className="mb-12">
            <h2 className="text-2xl font-bold mb-4 pb-2 border-b" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
              任务列表
            </h2>
            <p>使用方括号和空格创建任务列表：</p>
            <div className={clsx(
              'my-4 p-4 rounded-lg overflow-x-auto',
              isDark ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <pre className="text-sm">
                - [x] 已完成的任务
                - [ ] 未完成的任务
                - [ ] 另一个未完成的任务
              </pre>
            </div>
            <p>渲染效果：</p>
            <div className="my-4">
              <ul className="list-none space-y-2">
                <li className="flex items-center gap-2">
                  <input type="checkbox" checked disabled className="rounded text-[#07c160]" />
                  <span>已完成的任务</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" disabled className="rounded text-[#07c160]" />
                  <span>未完成的任务</span>
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" disabled className="rounded text-[#07c160]" />
                  <span>另一个未完成的任务</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 结尾 */}
          <section className="mt-16">
            <div className={clsx(
              'p-6 rounded-lg text-center',
              isDark ? 'bg-gray-800' : 'bg-gray-50'
            )}>
              <h2 className="text-2xl font-bold mb-4">Markdown 高级语法</h2>
              <p className="mb-4">除了以上基础语法外，Markdown 还支持许多高级功能，如：</p>
              <ul className="list-none space-y-2">
                <li>脚注</li>
                <li>定义列表</li>
                <li>自动链接</li>
                <li>HTML 标签</li>
                <li>Mermaid 图表</li>
              </ul>
              <p className="mt-4">这些高级功能在不同的 Markdown 解析器中可能有不同的支持程度。</p>
            </div>
          </section>
            </div>
          </div>
        </div>
      </div>

      {/* 底部 */}
      <div className={clsx(
        'py-6 text-center text-sm',
        isDark ? 'text-gray-400' : 'text-gray-500'
      )}>
        <p>© 2026 微信 Markdown 编辑器</p>
      </div>
    </div>
  );
}
