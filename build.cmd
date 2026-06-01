@echo off
REM Build script for Windows

echo Installing dependencies...
cd backend && npm install
cd ..\frontend && npm install

echo Building frontend...
call npm run build

echo Build completed successfully!
