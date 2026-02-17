@echo off
REM CineMatch AI - Windows Quick Start Script
REM This script sets up and runs both the proxy server and React app

setlocal enabledelayedexpansion

echo.
echo ============================================================
echo  CineMatch AI - Windows Setup & Start
echo ============================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo ✓ Node.js found: 
node --version
echo.

REM Ask if user wants to setup dependencies
set /p setup="Install dependencies? (y/n) [default: y]: " || set setup=y
if /i "%setup%"=="y" (
    echo.
    echo 📦 Installing proxy server dependencies...
    cd cinematch-ai-proxy
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install proxy dependencies
        pause
        exit /b 1
    )
    cd ..
    
    echo.
    echo 📦 Installing frontend dependencies...
    cd movie-recommender-app
    call npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    cd ..
    
    echo ✓ Dependencies installed successfully!
)

REM Check/Create .env file - REQUIRED STEP
echo.
echo ============================================================
echo  🔐  OpenAI API Configuration Required
echo ============================================================
echo.

setlocal enabledelayedexpansion

:check_env_loop
if exist "cinematch-ai-proxy\.env" (
    REM Check if file contains valid API key
    for /f "tokens=*" %%i in (cinematch-ai-proxy\.env) do (
        if "%%i:~0,14%"=="OPENAI_API_KEY" set "has_key=1"
    )
    
    if defined has_key (
        echo ✓ .env file found with API key configured
        goto env_ok
    )
)

echo ⚠️  IMPORTANT: You need an OpenAI API key to continue
echo.
echo How to get your FREE API key:
echo   1. Go to: https://platform.openai.com/api-keys
echo   2. Sign up or log in
echo   3. Click "Create new secret key"
echo   4. Copy the key (starts with "sk-")
echo.
set /p apikey="Enter your OpenAI API key (sk-...): "

if "!apikey!"=="" (
    echo.
    echo ❌ ERROR: No API key provided
    echo.
    echo You MUST provide an API key to use CineMatch AI
    echo.
    pause
    exit /b 1
)

echo.
echo Creating .env file...
if exist "cinematch-ai-proxy\.env" del /q cinematch-ai-proxy\.env
(
    echo OPENAI_API_KEY=!apikey!
    echo PORT=3001
    echo NODE_ENV=development
    echo CORS_ORIGIN=http://localhost:3000,http://localhost:3001
) > cinematch-ai-proxy\.env

if errorlevel 1 (
    echo ❌ Failed to create .env file
    pause
    exit /b 1
)

echo ✓ .env file created successfully!
echo.

:env_ok

echo.
echo ============================================================
echo  Starting CineMatch AI...
echo ============================================================
echo.

REM Create batch file to run proxy
echo Starting proxy server on port 3001...
start "CineMatch AI Proxy Server" cmd /k "cd /d %cd%\cinematch-ai-proxy && npm start"

REM Wait a bit for server to start
timeout /t 3 /nobreak

REM Start React app
echo.
echo Starting React frontend on port 3000...
echo ℹ️  This may take 10-15 seconds on first run
start "CineMatch AI Frontend" cmd /k "cd /d %cd%\movie-recommender-app && npm start"

echo.
echo ============================================================
echo  ✓ Starting up!
echo ============================================================
echo.
echo 📍 Proxy Server: http://localhost:3001
echo 🌐 Frontend App: http://localhost:3000
echo.
echo ℹ️  Both windows will open automatically
echo ℹ️  Keep both running while using the app
echo ℹ️  Close the windows to stop the servers
echo.
pause
