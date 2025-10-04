@echo off
echo ========================================
echo    SoTayK9 Project Launcher
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python and try again.
    pause
    exit /b 1
)

echo Python found. Checking dependencies...

REM Check if virtual environment exists, if not create one
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Starting SoTayK9 Application
echo ========================================
echo.

REM Start the Flask application in the background
echo Starting Flask server...
start /b python app_backend.py

REM Wait a moment for the server to start
timeout /t 3 /nobreak >nul

REM Open the application in the default browser
echo Opening application in browser...
start http://localhost:5000

echo.
echo ========================================
echo    Application Started Successfully!
echo ========================================
echo.
echo The application is now running at: http://localhost:5000
echo.
echo To stop the application, close this window or press Ctrl+C
echo.
echo Press any key to close this window...
pause >nul
