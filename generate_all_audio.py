#!/usr/bin/env python3
"""
Generate all audio files for Vietnamese TTS content sections
This script pre-generates all audio files so they're ready for immediate playback
"""

import os
import sys
import hashlib
import requests
import json
import time

# Audio cache directory
AUDIO_CACHE_DIR = 'audio_cache'
if not os.path.exists(AUDIO_CACHE_DIR):
    os.makedirs(AUDIO_CACHE_DIR)

def generate_audio_file(text, title, server_url="http://localhost:5000"):
    """Generate audio file for given text"""
    try:
        print(f"🔄 Generating audio for: {title}")
        
        # Call the TTS endpoint
        response = requests.post(f"{server_url}/api/tts/speak/file", 
                               json={"text": text, "lang": "vi"},
                               timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                filename = data.get("filename")
                size = data.get("size", 0)
                print(f"✅ Generated: {filename} ({size // 1024} KB)")
                return filename
            else:
                print(f"❌ Error: {data.get('error', 'Unknown error')}")
        else:
            print(f"❌ HTTP Error: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure Flask server is running on port 5000")
    except requests.exceptions.Timeout:
        print("❌ Request timeout")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

def main():
    """Main function to generate all audio files"""
    print("🎵 Vietnamese TTS Audio File Generator")
    print("=" * 50)
    
    # Content sections to generate audio for
    content_sections = [
        {
            "title": "TỔNG QUAN",
            "content": "Trong bối cảnh tình hình buôn lậu, vận chuyển trái phép hàng hóa, ma túy và các hành vi vi phạm pháp luật qua biên giới ngày càng diễn biến phức tạp, tinh vi và có tổ chức, công tác kiểm soát, phát hiện, đấu tranh phòng chống tội phạm đặt ra nhiều yêu cầu, thách thức mới đối với lực lượng Hải quan Việt Nam. Một trong những biện pháp nghiệp vụ quan trọng, có tính đặc thù và hiệu quả cao là sử dụng chó nghiệp vụ trong công tác kiểm tra, giám sát hải quan, đặc biệt trong phát hiện chất ma túy, hàng cấm, vũ khí, và vật phẩm nguy hiểm."
        },
        {
            "title": "QUY TRÌNH CHĂM SÓC",
            "content": "Việc chăm sóc, nuôi dưỡng CNV (chó nghiệp vụ) là công việc phải được thực hiện hàng ngày và liên tục trong suốt quá trình sử dụng. Trách nhiệm được phân công rõ ràng: Huấn luyện viên chịu trách nhiệm toàn diện về sức khỏe của CNV do mình quản lý. Nhân viên thú y tham mưu cho lãnh đạo về công tác chăn nuôi, theo dõi sức khỏe, xây dựng khẩu phần ăn, và trực tiếp thực hiện tiêm phòng, chẩn đoán, điều trị bệnh cho CNV."
        },
        {
            "title": "QUY TRÌNH SỬ DỤNG",
            "content": "Quy trình sử dụng chó nghiệp vụ trong kiểm tra hải quan bao gồm các bước chuẩn bị, thực hiện kiểm tra, và xử lý kết quả. Huấn luyện viên cần đảm bảo chó được nghỉ ngơi đầy đủ trước khi thực hiện nhiệm vụ, kiểm tra sức khỏe và trạng thái tinh thần của chó."
        },
        {
            "title": "QUY TRÌNH HUẤN LUYỆN",
            "content": "Quy trình huấn luyện chó nghiệp vụ được thực hiện theo các giai đoạn từ cơ bản đến nâng cao. Giai đoạn đầu tập trung vào việc xây dựng mối quan hệ tin cậy giữa huấn luyện viên và chó, sau đó chuyển sang các bài tập chuyên môn về phát hiện ma túy và chất cấm."
        }
    ]
    
    generated_files = []
    
    for section in content_sections:
        title = section["title"]
        content = section["content"]
        
        # Check if audio file already exists
        content_hash = hashlib.md5(content.encode('utf-8')).hexdigest()
        expected_filename = f"{content_hash}.mp3"
        expected_path = os.path.join(AUDIO_CACHE_DIR, expected_filename)
        
        if os.path.exists(expected_path):
            print(f"✅ Already exists: {expected_filename}")
            generated_files.append({"title": title, "filename": expected_filename})
            continue
        
        # Generate new audio file
        filename = generate_audio_file(content, title)
        if filename:
            generated_files.append({"title": title, "filename": filename})
            time.sleep(1)  # Small delay between requests
    
    print("\n" + "=" * 50)
    print("📊 Generation Summary:")
    print(f"✅ Total files generated: {len(generated_files)}")
    
    for item in generated_files:
        print(f"📁 {item['title']} → {item['filename']}")
    
    if generated_files:
        print(f"\n🎵 All audio files are now ready in: {AUDIO_CACHE_DIR}/")
        print("🚀 Users can now click 'Đọc nội dung' for instant playback!")
    else:
        print("\n❌ No audio files were generated. Check server connection.")

if __name__ == "__main__":
    main()
