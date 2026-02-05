@echo off
echo Starting Moranik Hub Website...
echo.
echo 1. Starting Frontend Server...
cd /d "c:\Users\Admin\Music\hub"
start "Frontend" cmd /k "npm run dev"
echo.
echo 2. Starting Backend Server...
cd /d "c:\Users\Admin\Music\hub\backend"
start "Backend" cmd /k "node server.js"
echo.
echo 3. Website is starting...
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
echo Press any key to stop all servers...
pause >nul
taskkill /f /im node.exe
echo All servers stopped.
pause
