@echo off
echo 正在修复Vue.js项目依赖问题...
echo.

echo 1. 删除node_modules目录...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules目录已删除
) else (
    echo node_modules目录不存在
)

echo.
echo 2. 删除package-lock.json文件...
if exist package-lock.json (
    del package-lock.json
    echo package-lock.json文件已删除
) else (
    echo package-lock.json文件不存在
)

echo.
echo 3. 清理npm缓存...
npm cache clean --force

echo.
echo 4. 重新安装依赖...
npm install

echo.
echo 5. 修复完成！现在可以尝试运行项目：
echo    npm run serve
echo.
pause 