#!/usr/bin/env python3
"""
Generate audio files for actual content from the Vietnamese TTS application
This script extracts the real content and generates audio files
"""

import os
import sys
import base64
import requests
import json
import time

# Audio cache directory
AUDIO_CACHE_DIR = 'audio_cache'
if not os.path.exists(AUDIO_CACHE_DIR):
    os.makedirs(AUDIO_CACHE_DIR)

def clean_text_for_tts(text):
    """Clean text for TTS (same as frontend)"""
    return text.replace('\s+', ' ').strip()

def generate_content_hash(text):
    """Generate content hash (UTF-8 safe, same as frontend)"""
    import hashlib
    cleaned_content = clean_text_for_tts(text)
    content_hash = hashlib.md5(cleaned_content.encode('utf-8')).hexdigest()[:16]
    return content_hash

def generate_audio_for_content(text, title, server_url="http://localhost:5000"):
    """Generate audio file for given content"""
    try:
        content_hash = generate_content_hash(text)
        expected_filename = f"{content_hash}.mp3"
        expected_path = os.path.join(AUDIO_CACHE_DIR, expected_filename)
        
        # Check if already exists
        if os.path.exists(expected_path):
            print(f"✅ Already exists: {expected_filename}")
            return expected_filename
        
        print(f"🔄 Generating audio for: {title}")
        print(f"📝 Content preview: {text[:100]}...")
        
        # Call the TTS endpoint
        response = requests.post(f"{server_url}/api/tts/speak/file", 
                               json={"text": text, "lang": "vi"},
                               timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                filename = data.get("filename")
                size = data.get("size", 0)
                cached = data.get("cached", False)
                
                if cached:
                    print(f"✅ Found cached: {filename} ({size // 1024} KB)")
                else:
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
    """Main function to generate audio files for real content"""
    print("🎵 Vietnamese TTS Audio Generator - Real Content")
    print("=" * 60)
    
    # Real content from the application (extracted from showContent function)
    content_sections = [
        {
            "title": "TỔNG QUAN",
            "content": """Trong bối cảnh tình hình buôn lậu, vận chuyển trái phép hàng hóa, ma túy và các hành vi vi phạm pháp luật qua biên giới ngày càng diễn biến phức tạp, tinh vi và có tổ chức, công tác kiểm soát, phát hiện, đấu tranh phòng chống tội phạm đặt ra nhiều yêu cầu, thách thức mới đối với lực lượng Hải quan Việt Nam. Một trong những biện pháp nghiệp vụ quan trọng, có tính đặc thù và hiệu quả cao là sử dụng chó nghiệp vụ trong công tác kiểm tra, giám sát hải quan, đặc biệt trong phát hiện chất ma túy, hàng cấm, vũ khí, và vật phẩm nguy hiểm.

Chó nghiệp vụ không chỉ là một phương tiện kỹ thuật đặc biệt mà còn là một lực lượng hỗ trợ trực tiếp cho cán bộ công chức Hải quan tại các cửa khẩu, sân bay, bến cảng, nơi có nguy cơ cao về buôn lậu và vận chuyển trái phép. Việc huấn luyện, nuôi dưỡng, sử dụng hiệu quả chó nghiệp vụ đòi hỏi sự đầu tư bài bản, khoa học, và đội ngũ cán bộ huấn luyện viên chuyên trách có chuyên môn sâu và tâm huyết.

Nhằm hệ thống hóa các quy định, quy trình, nghiệp vụ liên quan đến công tác quản lý và sử dụng chó nghiệp vụ trong ngành Hải quan, Tổng cục Hải quan biên soạn cuốn Sổ tay quản lý và sử dụng chó nghiệp vụ Hải quan. Cuốn sổ tay gồm các nội dung: giới thiệu chức năng, nhiệm vụ của tổ chức quản lý chó nghiệp vụ; quy trình chăm sóc, nuôi dưỡng, huấn luyện chó; phương pháp khai thác sử dụng trong thực tế; hồ sơ quản lý từng cá thể chó; công tác kiểm tra, đánh giá chất lượng; và những lưu ý trong phối hợp với các đơn vị liên quan.

Tổng cục Hải quan ghi nhận và đánh giá cao những đóng góp tâm huyết của các đơn vị, cán bộ, huấn luyện viên chó nghiệp vụ đã và đang trực tiếp tham gia xây dựng lực lượng này ngày càng chính quy, hiện đại và hiệu quả. Đồng thời, chúng tôi mong muốn tiếp tục nhận được các ý kiến đóng góp từ các chuyên gia, cán bộ trong và ngoài ngành nhằm hoàn thiện hơn nữa hệ thống tài liệu phục vụ công tác này.

Sổ tay là tài liệu nghiệp vụ nội bộ, phục vụ cho công chức, huấn luyện viên và các đơn vị liên quan trong ngành Hải quan. Trong trường hợp các văn bản pháp lý có thay đổi, các nội dung trong sổ tay sẽ được cập nhật và điều chỉnh cho phù hợp.

Xin trân trọng cảm ơn!"""
        },
        {
            "title": "QUY TRÌNH CHĂM SÓC",
            "content": """1. Nguyên tắc và Trách nhiệm trong Chăm sóc
Việc chăm sóc, nuôi dưỡng CNV (chó nghiệp vụ) là công việc phải được thực hiện hàng ngày và liên tục trong suốt quá trình sử dụng. Trách nhiệm được phân công rõ ràng:
- Huấn luyện viên (HLV): Chịu trách nhiệm toàn diện về sức khỏe của CNV do mình quản lý.
- Nhân viên thú y: Tham mưu cho lãnh đạo về công tác chăn nuôi, theo dõi sức khỏe, xây dựng khẩu phần ăn, và trực tiếp thực hiện tiêm phòng, chẩn đoán, điều trị bệnh cho CNV.
- Nhân viên chăn nuôi, nhân giống: Chịu trách nhiệm đảm bảo khẩu phần ăn, vệ sinh chuồng trại, chăm sóc chó bố mẹ và chó con đến 60 ngày tuổi.

2. Quy trình Chăm sóc Hàng ngày
a. Lịch trình hàng ngày:
- 07h20 - 07h45: Cho chó dạo chơi, vệ sinh chuồng trại và kiểm tra sức khỏe ban đầu.
- 07h45 - 08h00: Chuẩn bị trang bị, dụng cụ cho buổi huấn luyện.
- 08h00 - 14h00 và 14h00 - 15h00: Huấn luyện CNV.
- 10h30 - 11h00: Cho chó ăn bữa trưa.
- 16h30 - 17h00: Cho chó ăn bữa chiều.
- Vận động: Ngoài giờ huấn luyện, CNV cần được vận động vào buổi sáng và buổi chiều, mỗi lần 30 phút, để tăng cường mối quan hệ với HLV và giải trí.

b. Vệ sinh và Chăm sóc cá nhân:
- Vệ sinh chuồng trại: Hàng ngày phải dọn dẹp sạch sẽ chuồng và khu vực xung quanh, đảm bảo khô, thoáng, sạch. Kiểm tra, diệt ve, bọ chét, ký sinh trùng trong chuồng (nếu có).
- Chải lông: HLV phải chải lông cho CNV hàng ngày để loại bỏ lông rụng, các dị vật và ký sinh trùng.
- Tắm chó: Việc tắm được thực hiện tùy theo mùa. Mùa hè tắm 10-15 ngày/lần, mùa đông 5-7 ngày/lần, và nên chọn ngày ấm để tắm."""
        },
        {
            "title": "QUY TRÌNH SỬ DỤNG",
            "content": """Quy trình sử dụng chó nghiệp vụ trong kiểm tra hải quan bao gồm các bước chuẩn bị, thực hiện kiểm tra, và xử lý kết quả. Huấn luyện viên cần đảm bảo chó được nghỉ ngơi đầy đủ trước khi thực hiện nhiệm vụ, kiểm tra sức khỏe và trạng thái tinh thần của chó.

Trước khi thực hiện nhiệm vụ, cần kiểm tra kỹ lưỡng các yếu tố môi trường, điều kiện thời tiết, và đảm bảo an toàn cho cả chó và người tham gia. Trong quá trình kiểm tra, cần tuân thủ nghiêm ngặt các quy trình đã được huấn luyện, ghi nhận đầy đủ các phản ứng của chó và xử lý kết quả một cách chính xác.

Sau khi hoàn thành nhiệm vụ, cần có chế độ nghỉ ngơi và chăm sóc phù hợp để đảm bảo sức khỏe lâu dài cho chó nghiệp vụ."""
        },
        {
            "title": "QUY TRÌNH HUẤN LUYỆN",
            "content": """Quy trình huấn luyện chó nghiệp vụ được thực hiện theo các giai đoạn từ cơ bản đến nâng cao. Giai đoạn đầu tập trung vào việc xây dựng mối quan hệ tin cậy giữa huấn luyện viên và chó, sau đó chuyển sang các bài tập chuyên môn về phát hiện ma túy và chất cấm.

Giai đoạn 1: Xây dựng mối quan hệ và huấn luyện cơ bản
- Thiết lập mối quan hệ tin cậy giữa HLV và chó
- Huấn luyện các lệnh cơ bản: ngồi, đứng, nằm, đến
- Rèn luyện tính kỷ luật và tuân thủ

Giai đoạn 2: Huấn luyện chuyên môn
- Nhận biết và phát hiện các loại ma túy
- Huấn luyện trong các môi trường khác nhau
- Rèn luyện khả năng tập trung và bền bỉ

Giai đoạn 3: Huấn luyện nâng cao và thực hành
- Thực hành trong điều kiện thực tế
- Huấn luyện xử lý tình huống phức tạp
- Đánh giá và kiểm tra định kỳ"""
        }
    ]
    
    generated_files = []
    
    for section in content_sections:
        title = section["title"]
        content = section["content"]
        
        # Generate audio file
        filename = generate_audio_for_content(content, title)
        if filename:
            generated_files.append({"title": title, "filename": filename})
            time.sleep(2)  # Delay between requests to avoid overwhelming the server
    
    print("\n" + "=" * 60)
    print("📊 Generation Summary:")
    print(f"✅ Total files processed: {len(generated_files)}")
    
    for item in generated_files:
        print(f"📁 {item['title']} → {item['filename']}")
    
    if generated_files:
        print(f"\n🎵 Audio files are ready in: {AUDIO_CACHE_DIR}/")
        print("🚀 Users can now click 'Đọc nội dung' for instant playback!")
        
        # Show cache status
        try:
            response = requests.get("http://localhost:5000/api/tts/cache/status")
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    print(f"📊 Cache status: {data['file_count']} files, {data['total_size'] // 1024} KB")
        except:
            pass
    else:
        print("\n❌ No audio files were generated. Check server connection.")

if __name__ == "__main__":
    main()
