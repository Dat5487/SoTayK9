@echo off
echo Installing gTTS for Vietnamese Text-to-Speech...
echo.

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
)

REM Install gTTS
echo Installing gTTS package...
pip install gTTS==2.4.0

REM Test installation
echo.
echo Testing gTTS installation...
python -c "from gtts import gTTS; print('gTTS installed successfully!')"

if %errorlevel% == 0 (
    echo.
    echo ✅ gTTS installation completed successfully!
    echo 📝 You can now use Vietnamese TTS in your application.
    echo 🌐 Make sure your Flask server is running to use the TTS feature.
) else (
    echo.
    echo ❌ gTTS installation failed!
    echo 💡 Please try installing manually: pip install gTTS==2.4.0
)

echo.
pause
