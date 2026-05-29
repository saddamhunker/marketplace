@echo off
title TrustLoop Frontend
cd /d "%~dp0client"
echo Starting TrustLoop frontend...
echo.
npm.cmd run dev
echo.
echo Frontend stopped. Press any key to close.
pause >nul
