const DocLoader = {
  getBasePath() {
    const scriptPath = document.currentScript?.src || '';
    const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
    return scriptDir + '/../assets/docs/';
  },

  async loadDoc(docId) {
    // Robust base path resolution: try multiple candidates to avoid 404s
    const scriptPath = document.currentScript?.src || '';
    const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
    const candidateBase1 = scriptDir + '/../assets/docs/';
    const candidateBase2 = (window.location && window.location.origin ? window.location.origin : '') + '/assets/docs/';
    const bases = [candidateBase1, candidateBase2];

    let lastError = null;
    for (const base of bases) {
      // Append cache-busting timestamp to ensure fresh content
      let url = `${base}${docId}.md`;
      url += `?t=${Date.now()}`;
      console.log('Loading (attempt):', url);
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) {
          const markdown = await response.text();
          return this.parseMarkdown(markdown);
        } else {
          lastError = new Error(`文档加载失败: ${response.status}`);
        }
      } catch (e) {
        lastError = e;
      }
    }
    console.error('加载文档失败:', lastError);
    return `<h1>文档加载失败</h1><p>${lastError?.message || '未知错误'}</p>`;
  },

  parseMarkdown(markdown) {
    let html = markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hpuol])/gm, '<p>')
      .replace(/(<\/li>)\n(<li>)/g, '$1$2')
      .replace(/(<\/ul>)<p>/g, '$1')
      .replace(/<p><\/p>/g, '');

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
