@echo off
echo ========================================
echo Normal Map Generator - 样式检查
echo ========================================
echo.
echo 开发服务器应该运行在: http://localhost:3000
echo.
echo 请在浏览器中执行以下操作:
echo.
echo 1. 打开 http://localhost:3000
echo 2. 按 Ctrl+Shift+R 硬刷新
echo 3. 打开DevTools (F12)
echo 4. 在Console中执行:
echo.
echo    const glass = document.querySelector('.glass');
echo    console.log(window.getComputedStyle(glass).backdropFilter);
echo.
echo 5. 应该看到: "blur(16px) saturate(180%%)"
echo.
echo ========================================
echo 如果看到 "none" 或空值,说明样式未加载
echo 请查看 STYLE-FIX-SUMMARY.md 获取解决方案
echo ========================================
pause
