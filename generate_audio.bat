@echo off
echo Generating Vietnamese TTS audio files...
echo.

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Check if server is running
echo Checking if Flask server is running...
curl -s http://localhost:5000/api/tts/cache/status > nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Flask server is not running!
    echo Please start the server first: python app_backend.py
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo ✅ Server is running
echo.

REM Generate audio files for real content
echo Generating audio files for actual content...
python generate_real_content_audio.py

if %errorlevel% == 0 (
    echo.
    echo ✅ Audio generation completed successfully!
    echo 🎵 All audio files are ready for instant playback.
) else (
    echo.
    echo ❌ Audio generation failed!
    echo Please check the error messages above.
)

echo.
pause
