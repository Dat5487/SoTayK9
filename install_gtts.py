#!/usr/bin/env python3
"""
Install gTTS for Vietnamese Text-to-Speech functionality
"""

import subprocess
import sys
import os

def install_gtts():
    """Install gTTS package"""
    try:
        print("🔄 Installing gTTS for Vietnamese TTS...")
        
        # Install gTTS
        subprocess.check_call([sys.executable, "-m", "pip", "install", "gTTS==2.4.0"])
        
        print("✅ gTTS installed successfully!")
        
        # Test import
        try:
            from gtts import gTTS
            print("✅ gTTS import test successful!")
            
            # Test Vietnamese TTS
            print("🧪 Testing Vietnamese TTS...")
            tts = gTTS(text="Xin chào, đây là thử nghiệm đọc tiếng Việt.", lang='vi', slow=False)
            print("✅ Vietnamese TTS test successful!")
            
        except ImportError as e:
            print(f"❌ gTTS import failed: {e}")
            return False
            
    except subprocess.CalledProcessError as e:
        print(f"❌ Installation failed: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False
    
    return True

def main():
    """Main installation function"""
    print("🚀 gTTS Installation Script")
    print("=" * 40)
    
    if install_gtts():
        print("\n🎉 Installation completed successfully!")
        print("📝 You can now use Vietnamese TTS in your application.")
        print("🌐 Make sure your Flask server is running to use the TTS feature.")
    else:
        print("\n❌ Installation failed!")
        print("💡 Please try installing manually: pip install gTTS==2.4.0")
        sys.exit(1)

if __name__ == "__main__":
    main()
