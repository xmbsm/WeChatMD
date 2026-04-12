import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function copyRichText(html: string, themeCss?: string): Promise<boolean> {
  try {
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        ${themeCss ? `<style>${themeCss}</style>` : ''}
      </head>
      <body id="wechat-preview">${html}</body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    const plainText = htmlToPlainText(html);
    
    const data = [
      new ClipboardItem({
        'text/html': blob,
        'text/plain': new Blob([plainText], { type: 'text/plain' })
      })
    ];

    await navigator.clipboard.write(data);
    return true;
  } catch (err) {
    console.error('Failed to copy rich text:', err);
    
    try {
      const textarea = document.createElement('textarea');
      textarea.value = htmlToPlainText(html);
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch (fallbackErr) {
      console.error('Fallback copy also failed:', fallbackErr);
      return false;
    }
  }
}

export function downloadHtml(html: string, filename: string = 'wechat-article.html', themeCss?: string) {
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>微信公众号文章</title>
      ${themeCss ? `<style>${themeCss}</style>` : ''}
    </head>
    <body style="max-width: 680px; margin: 0 auto; padding: 20px;">
      <div id="wechat-preview">${html}</div>
    </body>
    </html>
  `;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPdf(html: string, filename: string = 'wechat-article.pdf', themeCss?: string): Promise<void> {
  try {
    // 创建一个可见的临时容器，确保样式和图片正确渲染
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'fixed';
    tempContainer.style.left = '0';
    tempContainer.style.top = '0';
    tempContainer.style.zIndex = '9999';
    tempContainer.style.width = '1000px';
    tempContainer.style.height = 'auto';
    tempContainer.style.backgroundColor = '#ffffff';
    tempContainer.style.padding = '20px';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.overflow = 'auto';
    tempContainer.style.maxHeight = '80vh';
    
    // 创建完整的HTML内容，包含所有样式
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${themeCss ? `<style>${themeCss}</style>` : ''}
        <style>
          body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          .content {
            max-width: 680px;
            margin: 0 auto;
            padding: 20px;
          }
          /* 确保图片正确显示 */
          img {
            max-width: 100%;
            height: auto;
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="content">${html}</div>
      </body>
      </html>
    `;
    
    tempContainer.innerHTML = fullHtml;
    document.body.appendChild(tempContainer);

    // 等待DOM和样式完全加载
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 使用html2canvas将内容转换为图片，确保图片和颜色样式正确渲染
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // 提高分辨率
      useCORS: true, // 允许加载跨域图片
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true, // 允许加载跨域图片
      removeContainer: false, // 不自动移除容器
      foreignObjectRendering: true, // 允许渲染foreignObject
      width: 680, // 固定宽度，确保内容正确布局
      height: tempContainer.scrollHeight // 动态高度，适应内容
    });

    // 移除临时容器
    document.body.removeChild(tempContainer);

    // 创建 PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    // 计算图片在 PDF 中的尺寸
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const scale = Math.min(contentWidth / imgWidth, contentHeight / imgHeight);
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;
    const x = (pageWidth - scaledWidth) / 2;
    const y = margin;

    // 添加图片到 PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);

    // 保存 PDF
    pdf.save(filename);
  } catch (error) {
    console.error('PDF generation failed:', error);
    
    //  fallback: 使用文本方式生成 PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let yPosition = margin;

    pdf.setFontSize(12);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    document.body.appendChild(tempDiv);

    const text = tempDiv.textContent || tempDiv.innerText || '';
    document.body.removeChild(tempDiv);

    // 简单的文本分割和添加
    const lines = text.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        const textLines = splitTextToWidth(line, contentWidth, pdf);
        for (const textLine of textLines) {
          if (yPosition > 270) { // A4 height minus margin
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(textLine, margin, yPosition);
          yPosition += 6;
        }
      }
      yPosition += 2;
    }

    pdf.save(filename);
  }
}

export function uploadMarkdownFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      resolve(content);
    };
    reader.onerror = (e) => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
}

function htmlToPlainText(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

function extractTextFromHtml(element: HTMLElement): Array<{ type: string; text: string }> {
  const lines: Array<{ type: string; text: string }> = [];
  const children = Array.from(element.childNodes);

  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent?.trim();
      if (text) {
        lines.push({ type: 'p', text });
      }
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      const tagName = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || '';

      if (tagName === 'h1') {
        lines.push({ type: 'h1', text });
      } else if (tagName === 'h2') {
        lines.push({ type: 'h2', text });
      } else if (tagName === 'h3') {
        lines.push({ type: 'h3', text });
      } else if (tagName === 'h4' || tagName === 'h5' || tagName === 'h6') {
        lines.push({ type: 'h3', text });
      } else if (tagName === 'p') {
        lines.push({ type: 'p', text });
      } else if (tagName === 'pre') {
        lines.push({ type: 'code', text });
      } else if (tagName === 'blockquote') {
        lines.push({ type: 'blockquote', text });
      } else if (tagName === 'ul' || tagName === 'ol') {
        const items = Array.from(el.querySelectorAll('li'));
        items.forEach((li, index) => {
          const liText = li.textContent?.trim() || '';
          lines.push({ type: 'p', text: `${tagName === 'ol' ? index + 1 + '.' : '•'} ${liText}` });
        });
      } else if (tagName === 'br') {
        lines.push({ type: 'p', text: '' });
      } else if (tagName === 'hr') {
        lines.push({ type: 'p', text: '---' });
      } else {
        const nestedLines = extractTextFromHtml(el);
        lines.push(...nestedLines);
      }
    }
  }

  return lines;
}

function splitTextToWidth(text: string, maxWidth: number, pdf: jsPDF): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const fontSize = 11;
    const testWidth = pdf.getStringUnitWidth(testLine) * fontSize / pdf.internal.scaleFactor;

    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

