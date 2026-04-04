@echo off
setlocal EnableExtensions
title Cmentarzysko Internetu - Vite

cd /d "%~dp0"
if not exist "package.json" (
  echo Brak package.json w tym folderze.
  goto :end
)

where npm >nul 2>&1
if errorlevel 1 (
  echo Nie znaleziono polecenia npm. Zainstaluj Node.js i dodaj go do PATH.
  echo https://nodejs.org/
  goto :end
)

if not exist "node_modules" (
  echo Instalowanie zaleznosci npm install...
  call npm install
  if errorlevel 1 (
    echo npm install zakonczyl sie bledem.
    goto :end
  )
)

echo.
echo Uruchamianie Vite - otworz adres z komunikatu ponizej ^(zwykle http://localhost:5173^).
echo Zamknij to okno aby zatrzymac serwer.
echo.
call npm run dev

:end
echo.
pause
