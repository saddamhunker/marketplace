@echo off
start "TrustLoop Frontend" cmd /k ""%~dp0start-frontend.cmd""
start "TrustLoop Backend" cmd /k ""%~dp0start-backend.cmd""
