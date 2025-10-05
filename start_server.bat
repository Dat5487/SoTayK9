@echo off
echo ========================================
echo    K9 Management System - WiFi Server
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

REM Check if required packages are installed
echo Checking Python packages...
python -c "import flask, flask_cors" >nul 2>&1
if errorlevel 1 (
    echo Installing required packages...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install packages
        pause
        exit /b 1
    )
)

REM Get local IP address
echo.
echo Getting your local IP address...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    goto :found_ip
)
:found_ip

echo.
echo ========================================
echo    Server Starting...
echo ========================================
echo.
echo Your server will be available at:
echo   Local:    http://localhost:5000
echo   Network:  http://%ip%:5000
echo.
echo To access from other devices on your WiFi:
echo   1. Make sure they're on the same WiFi network
echo   2. Open browser and go to: http://%ip%:5000
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

REM Start the Flask server
python app_backend.py

pause

