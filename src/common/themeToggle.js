// 主题切换功能 - 可在所有页面中使用
(function() {
  console.log('[Theme] Script loaded');
  
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  console.log('[Theme] Saved theme:', savedTheme);
  
  // 立即设置主题
  html.setAttribute('data-theme', savedTheme);
  console.log('[Theme] Set data-theme to:', savedTheme);
  
  // 等待 DOM 加载完成后绑定事件
  function setupThemeToggle() {
    console.log('[Theme] Setting up toggle');
    
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) {
      console.log('[Theme] Toggle button not found');
      return;
    }
    
    console.log('[Theme] Toggle button found');
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // 更新图标显示
    function updateIcon(theme) {
      if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        console.log('[Theme] Icon updated to:', themeIcon.textContent);
      }
    }
    
    // 初始化图标
    updateIcon(savedTheme);
    
    // 绑定点击事件
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      console.log('[Theme] Toggling from', currentTheme, 'to', newTheme);
      
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateIcon(newTheme);
      
      console.log('[Theme] New data-theme:', html.getAttribute('data-theme'));
    });
  }
  
  // 确保 DOM 已加载
  if (document.readyState === 'loading') {
    console.log('[Theme] DOM loading, waiting for DOMContentLoaded');
    document.addEventListener('DOMContentLoaded', setupThemeToggle);
  } else {
    console.log('[Theme] DOM already loaded');
    setupThemeToggle();
  }
})();
