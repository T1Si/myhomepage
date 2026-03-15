// 主题切换功能 - 可在所有页面中使用
(function() {
  // 初始化主题
  function initTheme() {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    
    // 如果页面有主题切换按钮，更新图标
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const themeIcon = themeToggle.querySelector('.theme-icon');
      if (themeIcon) {
        updateThemeIcon(savedTheme, themeIcon);
      }
      
      // 绑定切换事件
      themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
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
