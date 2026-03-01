const DocLoader = {
  getBasePath() {
    // 获取当前页面的基础路径
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const dir = pathname.substring(0, pathname.lastIndexOf('/'));
    return `${origin}${dir}/assets/docs/`;
  },

  async loadDoc(docId) {
    // 多种路径尝试策略
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const dir = pathname.substring(0, pathname.lastIndexOf('/'));
    
    const bases = [
      `${origin}${dir}/assets/docs/`,           // 相对于当前页面
      `${origin}/assets/docs/`,                 // 网站根目录
      `./assets/docs/`,                         // 相对路径
      `../assets/docs/`,                        // 上级目录
    ];

    let lastError = null;
    for (const base of bases) {
      // 添加缓存破坏参数确保获取最新内容
      let url = `${base}${docId}.md?t=${Date.now()}`;
      console.log('尝试加载:', url);
      
      try {
        const response = await fetch(url, { 
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const markdown = await response.text();
          console.log('✅ 文档加载成功:', url);
          return this.parseMarkdown(markdown);
        } else {
          lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
          console.warn('❌ 加载失败:', url, lastError.message);
        }
      } catch (e) {
        lastError = e;
        console.warn('❌ 请求异常:', url, e.message);
      }
    }
    
    console.error('所有路径尝试失败，最后错误:', lastError);
    return `<h1>📄 文档加载失败</h1><p class="error-message">无法加载文档内容，请检查网络连接或稍后重试。</p><p class="error-detail">错误信息: ${lastError?.message || '未知错误'}</p>`;
  },

  parseMarkdown(markdown) {
    // 更强大的 Markdown 解析
    let html = markdown;
    
    // 代码块（必须先处理，避免被其他规则影响）
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    // 标题
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // 链接 [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    
    // 粗体和斜体
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // 行内代码
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // 列表
    const lines = html.split('\n');
    let inList = false;
    let listType = '';
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const unorderedMatch = line.match(/^[\-\*\+] (.+)$/);
      const orderedMatch = line.match(/^\d+\. (.+)$/);
      
      if (unorderedMatch) {
        if (!inList || listType !== 'ul') {
          if (inList) result.push(`</${listType}>`);
          result.push('<ul>');
          inList = true;
          listType = 'ul';
        }
        result.push(`<li>${unorderedMatch[1]}</li>`);
      } else if (orderedMatch) {
        if (!inList || listType !== 'ol') {
          if (inList) result.push(`</${listType}>`);
          result.push('<ol>');
          inList = true;
          listType = 'ol';
        }
        result.push(`<li>${orderedMatch[1]}</li>`);
      } else {
        if (inList) {
          result.push(`</${listType}>`);
          inList = false;
          listType = '';
        }
        result.push(line);
      }
    }
    
    if (inList) {
      result.push(`</${listType}>`);
    }
    
    html = result.join('\n');
    
    // 段落（避免在标题、列表、代码块中添加 p 标签）
    html = html.replace(/\n\n+/g, '</p><p>');
    html = html.replace(/^(?!<[hpuol]|<pre)/gm, '<p>');
    html = html.replace(/<p>(<[hpuol]|<pre)/g, '$1');
    html = html.replace(/(<\/[hpuol]>|<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>(<ul>|<ol>)/g, '$1');
    html = html.replace(/(<\/ul>|<\/ol>)<\/p>/g, '$1');
    
    return html;
  },

  async loadAllDocs(docs) {
    const docContents = {};
    for (const doc of docs) {
      docContents[doc.id] = await this.loadDoc(doc.id);
    }
    return docContents;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DocLoader;
}
