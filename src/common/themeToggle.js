// 主题切换功能 - 可在所有页面中使用
(function() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // 立即设置主题
  html.setAttribute('data-theme', savedTheme);
  
  // 等待 DOM 加载完成后绑定事件
  function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // 更新图标显示
    function updateIcon(theme) {
      if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
      }
    }
    
    // 初始化图标
    updateIcon(savedTheme);
    
    // 绑定点击事件
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
    });
  }
  
  // 确保 DOM 已加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupThemeToggle);
  } else {
    setupThemeToggle();
  }
})();
