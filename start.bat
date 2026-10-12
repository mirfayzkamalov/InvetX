@echo off
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js topilmadi. https://nodejs.org dan o rnating, keyin qayta ishga tushiring. & pause & exit /b)
if not exist node_modules call npm install
call npm run dev
pause
