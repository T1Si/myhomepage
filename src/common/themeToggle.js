// 主题切换功能 - 可在所有页面中使用
(function() {
  // 立即应用保存的主题（在 DOM 加载前）
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // 初始化主题
  function initTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector('.theme-icon');
      const currentTheme = html.getAttribute('data-theme');
      
      // 更新图标
      if (themeIcon) {
        updateThemeIcon(currentTheme, themeIcon);
      }
      
      // 绑定切换事件
      themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (themeIcon) {
          updateThemeIcon(newTheme, themeIcon);
        }
      });
    }
  }

  // 更新图标
  function updateThemeIcon(theme, iconElement) {
    if (iconElement) {
      iconElement.textContent = theme === 'light' ? '🌙' : '☀️';
    }
  }

  // 页面加载时初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
