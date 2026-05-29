@echo off
title TrustLoop Backend
cd /d "%~dp0"
echo Starting TrustLoop backend...
echo.
npm.cmd run dev:server
echo.
echo Backend stopped. Press any key to close.
pause >nul
