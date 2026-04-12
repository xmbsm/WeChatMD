import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const IMAGE_PROXY_URL = 'https://tmpimg.ej-studio.app';

// Helper to convert images to Base64
async function getBase64Image(imgUrl: string): Promise<string> {
    try {
        if (imgUrl.startsWith('data:')) return imgUrl;

        const response = await fetch(imgUrl, { mode: 'cors', cache: 'default' });
        if (!response.ok) return imgUrl;

        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve(imgUrl);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        return imgUrl;
    }
}

// Upload a base64 data URL to the image proxy, returns an https URL
async function uploadToImageProxy(dataUrl: string): Promise<string> {
    try {
        const contentTypeMatch = dataUrl.match(/^data:([^;]+);/);
        const contentType = contentTypeMatch ? contentTypeMatch[1] : 'image/png';

        const resp = await fetch(`${IMAGE_PROXY_URL}/upload`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataUrl, contentType }),
        });
        if (!resp.ok) return dataUrl;

        const result = await resp.json() as { url?: string };
        return result.url || dataUrl;
    } catch {
        return dataUrl; // Fallback to base64 if proxy unavailable
    }
}

// 应用微信兼容性处理
async function applyWeChatCompatibility(html: string): Promise<string> {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // 1. 创建 section 作为根容器
  const section = doc.createElement('section');
  // 秀米 pattern: justify + break-word for better CJK mixed-content line breaking
  section.setAttribute('style', 'text-align: justify; overflow-wrap: break-word; box-sizing: border-box;');
  
  // 将 body 内容移动到 section
  const rootNodes = Array.from(doc.body.children);
  rootNodes.forEach(node => {
    if (node.tagName === 'DIV' && rootNodes.length === 1) {
      Array.from(node.childNodes).forEach(child => section.appendChild(child));
    } else {
      section.appendChild(node);
    }
  });
  
  // 清空 body 并添加 section
  doc.body.innerHTML = '';
  doc.body.appendChild(section);
  
  // 2a. 处理 hr-decoration flex sections for WeChat
  const svgPlaceholder = '<svg viewBox="0 0 1 1" style="float:left;line-height:0;width:0;vertical-align:top;"></svg>';
  const hrDecorations = section.querySelectorAll('section.hr-decoration');
  hrDecorations.forEach(node => {
    const children = Array.from(node.children) as HTMLElement[];
    children.forEach(child => {
      const cs = child.getAttribute('style') || '';
      if (cs.includes('flex:')) {
        // Line element: wrap border-top in nested sections with SVG trick
        const borderMatch = cs.match(/border-top:\s*([^;]+)/);
        const borderTop = borderMatch ? borderMatch[1].trim() : '1px solid #ddd';
        child.setAttribute('style', 'display: inline-block; flex: 1 0 1px; width: auto; vertical-align: bottom; padding: 0px; box-sizing: border-box;');
        child.innerHTML = `<section style="margin: 0; box-sizing: border-box;"><section style="border-top: ${borderTop}; box-sizing: border-box;">${svgPlaceholder}</section></section>`;
      }
    });
  });
  
  // 2b. 处理图片轮播
  const carousels = section.querySelectorAll('section.image-carousel');
  carousels.forEach(carousel => {
    const images = Array.from(carousel.querySelectorAll('img'));
    const count = images.length;
    if (count === 0) return;

    // Read max-width from carousel container style
    const carouselStyle = carousel.getAttribute('style') || '';
    const maxWMatch = carouselStyle.match(/max-width:\s*([^;]+)/);
    const maxWidth = maxWMatch ? maxWMatch[1].trim() : '100%';
    const marginMatch = carouselStyle.match(/margin:\s*([^;]+)/);
    const margin = marginMatch ? marginMatch[1].trim() : '24px 0';

    // Read padding from the first image to determine gap
    const firstImg = images[0];
    const firstImgStyle = firstImg?.getAttribute('style') || '';
    const padMatch = firstImgStyle.match(/padding:\s*([^;]+)/);
    const imgPadVal = padMatch ? padMatch[1].trim() : '0';
    const pct = (100 / count).toFixed(4);

    // Build the wide strip — use font-size:0 to eliminate inline-block whitespace
    const strip = doc.createElement('section');
    strip.setAttribute('style', `overflow: hidden; width: ${count * 100}%; max-width: ${count * 100}% !important; font-size: 0; box-sizing: border-box;`);

    // Extract background-color from first image if set
    const bgMatch = firstImgStyle.match(/background-color:\s*([^;]+)/);
    const imgBg = bgMatch ? bgMatch[1].trim() : '';
    const radiusMatch = firstImgStyle.match(/border-radius:\s*([^;]+)/);
    const imgRad = radiusMatch ? radiusMatch[1].trim() : '0';

    images.forEach((img, i) => {
      const slide = doc.createElement('section');
      const slideBg = imgBg ? `background-color: ${imgBg};` : '';
      const slideRad = imgRad !== '0' ? `border-radius: ${imgRad};` : '';
      // Use float:left instead of inline-block (more reliable in WeChat, no whitespace issues)
      // 6px right-padding on all slides except last for consistent gap
      const slideRightPad = i < count - 1 ? 'padding-right: 6px;' : '';
      slide.setAttribute('style', `float: left; width: ${pct}%; ${slideRightPad} box-sizing: border-box;`);
      const imgWrap = doc.createElement('section');
      imgWrap.setAttribute('style', `text-align: center; line-height: 0; padding: ${imgPadVal}; ${slideBg} ${slideRad} box-sizing: border-box;`);
      img.setAttribute('style', 'vertical-align: middle; max-width: 100%; width: 100%; box-sizing: border-box;');
      imgWrap.appendChild(img);
      slide.appendChild(imgWrap);
      strip.appendChild(slide);
    });

    // Scrollable container
    const scrollable = doc.createElement('section');
    scrollable.setAttribute('style', 'display: inline-block; width: 100%; vertical-align: top; overflow-x: auto; box-sizing: border-box;');
    scrollable.appendChild(strip);

    // Outer clipping container with max-width
    const outer = doc.createElement('section');
    outer.setAttribute('style', `margin: ${margin}; width: ${maxWidth} !important; max-width: ${maxWidth} !important; margin-left: auto; margin-right: auto; overflow: hidden; box-sizing: border-box;`);
    outer.appendChild(scrollable);

    // Remove indicator dots that follow the carousel
    const dots = carousel.nextElementSibling;
    if (dots && (dots.getAttribute('style') || '').includes('gap: 6px')) {
      dots.remove();
    }
    carousel.parentNode?.replaceChild(outer, carousel);
  });
  
  // 2c. 处理 flex 布局 - 转换为表格布局（微信不支持 flex）
  const flexLikeNodes = section.querySelectorAll('div, p.image-grid');
  flexLikeNodes.forEach(node => {
    // 保持代码块和轮播内部不变
    if (node.closest('pre, code, .image-carousel')) return;
    
    const style = node.getAttribute('style') || '';
    const isFlexNode = style.includes('display: flex') || style.includes('display:flex');
    const isImageGrid = node.classList.contains('image-grid');
    
    if (isFlexNode || isImageGrid) {
      const flexChildren = Array.from(node.children);
      if (flexChildren.every(child => child.tagName === 'IMG' || child.querySelector('img'))) {
        // 图片网格 - 转换为表格布局
        const table = doc.createElement('table');
        table.setAttribute('style', 'width: 100%; table-layout: fixed; border-collapse: collapse; margin: 16px 0; border: none !important;');
        const tbody = doc.createElement('tbody');
        const tr = doc.createElement('tr');
        tr.setAttribute('style', 'border: none !important; background: transparent !important;');
        
        const colWidth = (100 / flexChildren.length).toFixed(2) + '%';
        flexChildren.forEach(child => {
          const td = doc.createElement('td');
          td.setAttribute('style', `width: ${colWidth}; padding: 0 4px; vertical-align: top; border: none !important; background: transparent !important;`);
          td.appendChild(child);
          
          // 更新子元素宽度为 100%
          if (child.tagName === 'IMG') {
            const currentStyle = child.getAttribute('style') || '';
            child.setAttribute('style', currentStyle.replace(/width:\s*[^;]+;?/g, '') + ' width: 100% !important; display: block; margin: 0 auto;');
          }
          
          tr.appendChild(td);
        });
        
        tbody.appendChild(tr);
        table.appendChild(tbody);
        node.parentNode?.replaceChild(table, node);
      } else if (isFlexNode) {
        // 非图片 flex 元素 - 移除 flex 属性
        node.setAttribute('style', style.replace(/display:\s*flex;?/g, 'display: block;'));
      }
    }
  });
  
  // 3. 将 strong/b 转换为 span 并添加 font-weight:700
  const strongElements = section.querySelectorAll('strong, b');
  strongElements.forEach(el => {
    if (el.closest('pre')) return;
    const span = doc.createElement('span');
    span.innerHTML = el.innerHTML;
    const existingStyle = el.getAttribute('style') || '';
    span.setAttribute('style', `font-weight: 700; ${existingStyle}`.trim());
    el.replaceWith(span);
  });
  
  // 4. 确保所有 li 内容包裹在 p 中
  const listItems = section.querySelectorAll('li');
  listItems.forEach(li => {
    const firstChild = li.firstElementChild;
    if (!firstChild || firstChild.tagName !== 'P') {
      const p = doc.createElement('p');
      p.setAttribute('style', 'margin: 0; padding: 0; box-sizing: border-box;');
      while (li.firstChild) p.appendChild(li.firstChild);
      li.appendChild(p);
    }
  });
  
  // 5. 将 blockquote 转换为 section
  const blockquotes = section.querySelectorAll('blockquote');
  blockquotes.forEach(bq => {
    const replacement = doc.createElement('section');
    replacement.innerHTML = bq.innerHTML;
    const style = (bq.getAttribute('style') || '')
      .replace(/box-shadow:\s*[^;]+;?\s*/g, '')
      .replace(/border-radius:\s*[^;]+;?\s*/g, '')
      .replace(/text-align:\s*[^;]+;?\s*/g, '')
      .replace(/line-height:\s*[^;]+;?\s*/g, '');
    replacement.setAttribute('style', style);
    bq.replaceWith(replacement);
  });
  
  // 6. 强制继承样式，为所有文本节点添加基本样式
  const textNodes = section.querySelectorAll('p, li, h1, h2, h3, h4, h5, h6, blockquote, span');
  textNodes.forEach(node => {
    if (node.tagName === 'SPAN' && node.closest('pre, code')) return;
    let currentStyle = node.getAttribute('style') || '';
    
    // 秀米 pattern: text-wrap-mode + explicit padding on <p>
    if (node.tagName === 'P' && !node.closest('pre')) {
      if (!currentStyle.includes('text-wrap-mode') && !currentStyle.includes('white-space')) {
        currentStyle += ' text-wrap-mode: wrap;';
      }
      if (!currentStyle.includes('padding')) {
        currentStyle += ' padding: 0px;';
      }
    }
    
    node.setAttribute('style', currentStyle.trim());
  });
  
  // 7. 处理中文标点符号，确保它们与前面的内联强调元素保持在一起
  const inlineNodes = section.querySelectorAll('em, span, a, code');
  inlineNodes.forEach(node => {
    const next = node.nextSibling;
    if (!next || next.nodeType !== Node.TEXT_NODE) return;
    
    const text = next.textContent || '';
    const match = text.match(/^\s*([：；，。！？、:])(.*)$/s);
    if (!match) return;
    
    const punct = match[1];
    const rest = match[2] || '';
    
    node.appendChild(doc.createTextNode(punct));
    if (rest) {
      next.textContent = rest;
    } else {
      next.parentNode?.removeChild(next);
    }
  });
  
  // 8. 处理代码块中的空格
  const codeBlocks = section.querySelectorAll('pre code');
  codeBlocks.forEach(code => {
    const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (node.textContent && node.textContent.includes(' ')) {
        node.textContent = node.textContent.replace(/ /g, '\u00a0');
      }
    }
  });
  
  // 9. 处理内联代码的换行
  const inlineCodes = section.querySelectorAll('code');
  inlineCodes.forEach(code => {
    if (code.closest('pre')) return;
    const style = code.getAttribute('style') || '';
    code.setAttribute('style', style + ' word-break: break-all;');
  });
  
  // 10. 修复 Mac 风格的代码块点
  section.querySelectorAll('pre > div').forEach(div => {
    const style = div.getAttribute('style') || '';
    if (!style.includes('white-space: nowrap')) return;
    div.querySelectorAll('span').forEach(span => {
      const spanStyle = span.getAttribute('style') || '';
      if (spanStyle.includes('border-radius: 50%') && !span.innerHTML.trim()) {
        span.innerHTML = svgPlaceholder;
      }
    });
  });
  
  // 11. 转换 text-decoration 子属性为简写形式
  section.querySelectorAll('u').forEach(u => {
    const style = u.getAttribute('style') || '';
    const lineMatch = style.match(/text-decoration-line:\s*([^;]+)/);
    const styleMatch = style.match(/text-decoration-style:\s*([^;]+)/);
    const colorMatch = style.match(/text-decoration-color:\s*([^;]+)/);
    const offsetMatch = style.match(/text-underline-offset:\s*([^;]+)/);

    if (lineMatch || styleMatch || colorMatch) {
      const line = lineMatch ? lineMatch[1].trim() : 'underline';
      const decoStyle = styleMatch ? styleMatch[1].trim() : 'solid';
      const decoColor = colorMatch ? colorMatch[1].trim() : '';
      const shorthand = `${line} ${decoStyle}${decoColor ? ` ${decoColor}` : ''}`;

      let newStyle = style
        .replace(/text-decoration-line:\s*[^;]+;?\s*/g, '')
        .replace(/text-decoration-style:\s*[^;]+;?\s*/g, '')
        .replace(/text-decoration-color:\s*[^;]+;?\s*/g, '');

      // text-underline-offset is not supported in WeChat, remove it
      if (offsetMatch) {
        newStyle = newStyle.replace(/text-underline-offset:\s*[^;]+;?\s*/g, '');
      }

      newStyle = `text-decoration: ${shorthand}; ${newStyle}`.trim();
      u.setAttribute('style', newStyle);
    }
  });
  
  // 12. 将十六进制颜色转换为 rgb() 格式
  const allElements = section.querySelectorAll('*');
  allElements.forEach(el => {
    const style = el.getAttribute('style');
    if (style && style.includes('#')) {
      el.setAttribute('style', style.replace(/#([0-9a-fA-F]{6})\b/g, (_, hex) => {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgb(${r}, ${g}, ${b})`;
      }).replace(/#([0-9a-fA-F]{3})\b/g, (_, hex) => {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return `rgb(${r}, ${g}, ${b})`;
      }));
    }
  });
  
  // 13. 为所有元素添加 box-sizing: border-box
  allElements.forEach(el => {
    const style = el.getAttribute('style') || '';
    if (!style.includes('box-sizing')) {
      el.setAttribute('style', style ? `${style}; box-sizing: border-box;` : 'box-sizing: border-box;');
    }
  });
  
  // 14. 为图片添加 max-width: 100% !important
  const images = section.querySelectorAll('img');
  images.forEach(img => {
    const style = img.getAttribute('style') || '';
    const maxWidthMatch = style.match(/max-width:\s*([^;]+)/);
    if (maxWidthMatch) {
      const maxW = maxWidthMatch[1].trim();
      img.setAttribute('style', style.replace(/max-width:\s*[^;]+;?/, `max-width: ${maxW} !important;`));
    } else {
      img.setAttribute('style', style ? `${style}; max-width: 100% !important;` : 'max-width: 100% !important;');
    }
    
    // 修复图片 URL 中的反引号
    const src = img.getAttribute('src');
    if (src) {
      const cleanedSrc = src.replace(/`/g, '');
      img.setAttribute('src', cleanedSrc);
    }
  });
  
  // 15. 修复链接 URL 中的反引号
  const links = section.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      // 移除所有反引号
      const cleanedHref = href.replace(/`/g, '');
      link.setAttribute('href', cleanedHref);
    }
  });
  
  // 16. 清理重复的分号
  allElements.forEach(el => {
    const style = el.getAttribute('style');
    if (style) {
      const cleanedStyle = style.replace(/;;+/g, ';').replace(/;\s*$/g, '');
      el.setAttribute('style', cleanedStyle);
    }
  });
  
  // 17. 修复下标和上标
  const textNodesForSubscript = section.querySelectorAll('p, span');
  textNodesForSubscript.forEach(node => {
    if (node.innerHTML.includes('<del') && node.innerHTML.includes('</del>')) {
      // 替换所有删除线标签为正确的下标标签
      node.innerHTML = node.innerHTML.replace(/<del[^>]*>(\d+)<\/del>/g, '<sub>$1</sub>');
    }
    
    // 修复上标格式
    if (node.innerHTML.includes('^') && node.innerHTML.includes('^')) {
      node.innerHTML = node.innerHTML.replace(/\^(\d+)\^/g, '<sup>$1</sup>');
    }
  });
  
  // 18. 确保所有元素的样式都完整
  allElements.forEach(el => {
    const style = el.getAttribute('style');
    if (style) {
      // 确保所有样式属性都有分号结尾
      const cleanedStyle = style.replace(/([^;])$/, '$1;');
      el.setAttribute('style', cleanedStyle);
    }
  });
  
  // 20. 处理图片，确保微信能正确显示
  const imageElements = section.querySelectorAll('img');
  await Promise.all(Array.from(imageElements).map(async img => {
    const src = img.getAttribute('src');
    if (!src) return;

    const isPublicUrl = /^https?:\/\//.test(src)
        && !src.includes('localhost')
        && !src.includes('127.0.0.1');

    if (isPublicUrl) return; // WeChat can fetch these directly

    // Get base64 version (already base64 or convert from local)
    const base64 = src.startsWith('data:') ? src : await getBase64Image(src);
    if (!base64.startsWith('data:')) return; // conversion failed, keep original

    // Upload to image proxy for a public https URL
    const proxyUrl = await uploadToImageProxy(base64);
    img.setAttribute('src', proxyUrl);
  }));
  
  // 19. 防止微信在 inline emphasis 和中文标点之间换行
  let outputHtml = doc.body.innerHTML;
  outputHtml = outputHtml.replace(/(<\/(?:em|span|a|code)>)([：；，。！？、])/g, '$1\u2060$2');
  
  return outputHtml;
}

// 简单的 CSS 解析器，用于应用主题样式
function parseAndApplyThemeCss(html: string, themeCss: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // 首先为所有元素添加 box-sizing
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    const element = el as HTMLElement;
    if (!element.style.boxSizing) {
      element.style.boxSizing = 'border-box';
    }
  });
  
  // 移除 CSS 注释
  let cleanCss = themeCss.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 按规则分割 CSS
  const rules = cleanCss.split('}').filter(rule => rule.trim().length > 0);
  
  rules.forEach(rule => {
    const parts = rule.split('{');
    if (parts.length !== 2) return;
    
    let selector = parts[0].trim();
    const styles = parts[1].trim();
    
    // 移除 #wechat-preview 前缀
    selector = selector.replace(/^#wechat-preview\s*/, '');
    selector = selector.replace(/#wechat-preview,?\s*/g, '');
    
    if (!selector) return;
    
    // 解析样式属性
    const styleProperties = styles.split(';')
      .map(prop => prop.trim())
      .filter(prop => prop.length > 0);
    
    try {
      const elements = tempDiv.querySelectorAll(selector);
      elements.forEach(el => {
        const element = el as HTMLElement;
        styleProperties.forEach(prop => {
          const colonIndex = prop.indexOf(':');
          if (colonIndex <= 0) return;
          
          const name = prop.substring(0, colonIndex).trim();
          const value = prop.substring(colonIndex + 1).trim();
          
          if (name && value) {
            try {
              // 转换为驼峰命名
              const camelName = name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
              (element.style as any)[camelName] = value;
            } catch (e) {
              // 忽略无效的属性
            }
          }
        });
      });
    } catch (e) {
      // 忽略无效的选择器
    }
  });
  
  return tempDiv.innerHTML;
}

// 应用默认样式
function applyDefaultStyles(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // 为所有元素添加基本样式
  const allElements = tempDiv.querySelectorAll('*');
  allElements.forEach(el => {
    const element = el as HTMLElement;
    if (!element.style.boxSizing) {
      element.style.boxSizing = 'border-box';
    }
  });
  
  // 为标题添加内联样式
  const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(heading => {
    const el = heading as HTMLElement;
    switch (el.tagName) {
      case 'H1':
        el.style.fontSize = '26px';
        el.style.fontWeight = '700';
        el.style.marginBottom = '5px';
        el.style.marginTop = '20px';
        el.style.paddingBottom = '12px';
        el.style.borderBottom = '2px solid rgb(7, 193, 96)';
        el.style.textAlign = 'center';
        break;
      case 'H2':
        el.style.fontSize = '22px';
        el.style.fontWeight = '700';
        el.style.marginBottom = '5px';
        el.style.marginTop = '20px';
        el.style.paddingLeft = '12px';
        el.style.borderLeft = '4px solid rgb(7, 193, 96)';
        break;
      case 'H3':
        el.style.fontSize = '18px';
        el.style.fontWeight = '700';
        el.style.marginBottom = '5px';
        el.style.marginTop = '20px';
        break;
      default:
        el.style.fontSize = '16px';
        el.style.fontWeight = '700';
        el.style.marginBottom = '5px';
        el.style.marginTop = '15px';
        break;
    }
  });
  
  // 为段落添加内联样式
  const paragraphs = tempDiv.querySelectorAll('p');
  paragraphs.forEach(p => {
    const el = p as HTMLElement;
    el.style.margin = '0';
    el.style.lineHeight = '26px';
    el.style.padding = '0px';
    el.style.textWrapMode = 'wrap';
  });
  
  // 为列表添加内联样式
  const lists = tempDiv.querySelectorAll('ul, ol');
  lists.forEach(list => {
    const el = list as HTMLElement;
    el.style.margin = '10px 0';
    el.style.paddingLeft = '20px';
  });
  
  const listItems = tempDiv.querySelectorAll('li');
  listItems.forEach(item => {
    const el = item as HTMLElement;
    el.style.margin = '5px 0';
    // 确保 li 内容包裹在 p 中
    const firstChild = item.firstElementChild;
    if (!firstChild || firstChild.tagName !== 'P') {
      const p = document.createElement('p');
      p.style.margin = '0';
      p.style.padding = '0';
      p.style.boxSizing = 'border-box';
      while (item.firstChild) p.appendChild(item.firstChild);
      item.appendChild(p);
    }
  });
  
  // 为代码块添加内联样式
  const codeBlocks = tempDiv.querySelectorAll('pre');
  codeBlocks.forEach(block => {
    const el = block as HTMLElement;
    el.style.backgroundColor = 'rgb(245, 245, 245)';
    el.style.padding = '10px';
    el.style.borderRadius = '5px';
    el.style.overflowX = 'auto';
  });
  
  const inlineCode = tempDiv.querySelectorAll('code:not(pre code)');
  inlineCode.forEach(code => {
    const el = code as HTMLElement;
    el.style.fontFamily = 'Consolas, Monaco, "Courier New", monospace';
    el.style.backgroundColor = 'rgb(245, 245, 245)';
    el.style.padding = '2px 4px';
    el.style.borderRadius = '3px';
    el.style.wordBreak = 'break-all';
  });
  
  // 为引用添加内联样式
  const blockquotes = tempDiv.querySelectorAll('blockquote');
  blockquotes.forEach(quote => {
    const el = quote as HTMLElement;
    el.style.borderLeft = '4px solid rgb(7, 193, 96)';
    el.style.paddingLeft = '10px';
    el.style.margin = '10px 0';
    el.style.color = 'rgb(102, 102, 102)';
  });
  
  // 为表格添加内联样式
  const tables = tempDiv.querySelectorAll('table');
  tables.forEach(table => {
    const el = table as HTMLElement;
    el.style.borderCollapse = 'collapse';
    el.style.width = '100%';
    el.style.margin = '10px 0';
  });
  
  const tableCells = tempDiv.querySelectorAll('th, td');
  tableCells.forEach(cell => {
    const el = cell as HTMLElement;
    el.style.border = '1px solid rgb(221, 221, 221)';
    el.style.padding = '8px';
    el.style.textAlign = 'left';
  });
  
  const tableHeaders = tempDiv.querySelectorAll('th');
  tableHeaders.forEach(header => {
    const el = header as HTMLElement;
    el.style.backgroundColor = 'rgb(245, 245, 245)';
  });
  
  // 为图片添加内联样式
  const images = tempDiv.querySelectorAll('img');
  images.forEach(img => {
    const el = img as HTMLElement;
    el.style.maxWidth = '100%';
    el.style.height = 'auto';
    el.style.display = 'block';
    el.style.margin = '10px 0';
  });
  
  // 为链接添加内联样式
  const links = tempDiv.querySelectorAll('a');
  links.forEach(link => {
    const el = link as HTMLElement;
    el.style.color = 'rgb(7, 193, 96)';
    el.style.textDecoration = 'none';
  });
  
  // 为文本格式添加内联样式
  const italicElements = tempDiv.querySelectorAll('em, i');
  italicElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.fontStyle = 'italic';
  });
  
  const deleteElements = tempDiv.querySelectorAll('del');
  deleteElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.textDecoration = 'line-through';
  });
  
  const markElements = tempDiv.querySelectorAll('mark');
  markElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.backgroundColor = 'rgb(255, 255, 0)';
    element.style.padding = '0 2px';
  });
  
  // 为下标和上标添加内联样式
  const subElements = tempDiv.querySelectorAll('sub');
  subElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.fontSize = '0.8em';
    element.style.verticalAlign = 'sub';
  });
  
  const supElements = tempDiv.querySelectorAll('sup');
  supElements.forEach(el => {
    const element = el as HTMLElement;
    element.style.fontSize = '0.8em';
    element.style.verticalAlign = 'super';
  });
  
  // 为任务列表添加内联样式
  const checkboxes = tempDiv.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    const element = checkbox as HTMLElement;
    element.style.marginRight = '8px';
  });
  
  // 为分隔线添加内联样式
  const hr = tempDiv.querySelectorAll('hr');
  hr.forEach(line => {
    const el = line as HTMLElement;
    el.style.border = 'none';
    el.style.borderTop = '1px solid rgb(221, 221, 221)';
    el.style.margin = '20px 0';
  });
  
  return tempDiv.innerHTML;
}

// 应用内联样式
function applyInlineStyles(html: string, themeCss?: string): string {
  if (themeCss) {
    return parseAndApplyThemeCss(html, themeCss);
  } else {
    return applyDefaultStyles(html);
  }
}

export async function copyRichText(html: string, themeCss?: string): Promise<boolean> {
  try {
    // 先应用内联样式，再应用微信兼容性处理
    let processedHtml = applyInlineStyles(html, themeCss);
    processedHtml = await applyWeChatCompatibility(processedHtml);
    
    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          /* 基本样式 */
          body {
            font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", "Microsoft YaHei", "微软雅黑", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: rgb(0, 0, 0);
            padding: 0 8px;
          }
        </style>
      </head>
      <body>${processedHtml}</body>
      </html>
    `;

    const blob = new Blob([fullHtml], { type: 'text/html' });
    
    // 只提供 text/html 格式，确保微信编辑器优先使用富文本
    const data = [
      new ClipboardItem({
        'text/html': blob
      })
    ];

    await navigator.clipboard.write(data);
    return true;
  } catch (err) {
    console.error('Failed to copy rich text:', err);
    
    try {
      // 改进的 fallback 方法，使用 contenteditable div 复制富文本
      let processedHtml = applyInlineStyles(html, themeCss);
      processedHtml = await applyWeChatCompatibility(processedHtml);
      
      const div = document.createElement('div');
      div.contentEditable = 'true';
      div.innerHTML = processedHtml;
      div.style.position = 'fixed';
      div.style.opacity = '0';
      div.style.width = '1px';
      div.style.height = '1px';
      document.body.appendChild(div);
      
      // 选择所有内容
      const range = document.createRange();
      range.selectNodeContents(div);
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      // 复制
      document.execCommand('copy');
      document.body.removeChild(div);
      return true;
    } catch (fallbackErr) {
      console.error('Fallback copy also failed:', fallbackErr);
      return false;
    }
  }
}

export async function downloadHtml(html: string, filename: string = 'wechat-article.html', themeCss?: string) {
  let processedHtml = applyInlineStyles(html, themeCss);
  processedHtml = await applyWeChatCompatibility(processedHtml);
  
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>微信公众号文章</title>
      <style>
        body {
          font-family: Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", "Microsoft YaHei", "微软雅黑", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          color: rgb(0, 0, 0);
          padding: 0 8px;
        }
      </style>
    </head>
    <body style="max-width: 680px; margin: 0 auto; padding: 20px;">
      <div id="wechat-preview">${processedHtml}</div>
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
    console.warn('PDF download is temporarily disabled due to complexity');
    throw new Error('PDF download is temporarily disabled');
  } catch (error) {
    console.error('PDF download failed:', error);
    throw error;
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

export function downloadMarkdown(content: string, filename: string = 'wechat-article.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
