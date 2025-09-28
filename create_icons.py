from PIL import Image, ImageDraw
import os

def create_cnv_icon(size, output_path):
    print(f"Creating icon {size}x{size}...")
    
    # Tạo background xanh
    img = Image.new('RGB', (size, size), '#667eea')
    draw = ImageDraw.Draw(img)
    
    # Vẽ hình chó đơn giản
    center_x, center_y = size // 2, size // 2
    radius = size // 3
    
    # Đầu chó (hình oval trắng)
    draw.ellipse([
        center_x - radius, center_y - radius//2,
        center_x + radius, center_y + radius//2
    ], fill='white', outline='#2d3748', width=max(1, size//100))
    
    # Mắt trái
    eye_size = max(3, size // 20)
    draw.ellipse([
        center_x - radius//3, center_y - radius//4, 
        center_x - radius//3 + eye_size, center_y - radius//4 + eye_size
    ], fill='black')
    
    # Mắt phải  
    draw.ellipse([
        center_x + radius//3 - eye_size, center_y - radius//4,
        center_x + radius//3, center_y - radius//4 + eye_size
    ], fill='black')
    
    # Mũi (tam giác nhỏ)
    nose_size = max(2, size // 30)
    draw.polygon([
        (center_x, center_y + radius//8),
        (center_x - nose_size, center_y + radius//8 + nose_size),
        (center_x + nose_size, center_y + radius//8 + nose_size)
    ], fill='black')
    
    # Lưu file

    img.save(output_path, 'PNG')
    print(f"✅ Created: {output_path}")

# Tạo thư mục static nếu chưa có
os.makedirs('static', exist_ok=True)

print("🎨 Starting icon generation...")

# Tạo 2 icon sizes
create_cnv_icon(192, 'static/icon-192x192.png')
create_cnv_icon(512, 'static/icon-512x512.png')

print("🎉 Icon generation completed!")
print("📂 Check 'static' folder for generated icons")
from PIL import Image, ImageDraw
import os

def create_cnv_icon(size, output_path):
    print(f"Creating icon {size}x{size}...")
    
    # Tạo background xanh
    img = Image.new('RGB', (size, size), '#667eea')
    draw = ImageDraw.Draw(img)
    
    # Vẽ hình chó đơn giản
    center_x, center_y = size // 2, size // 2
    radius = size // 3
    
    # Đầu chó (hình oval trắng)
    draw.ellipse([
        center_x - radius, center_y - radius//2,
        center_x + radius, center_y + radius//2
    ], fill='white', outline='#2d3748', width=max(1, size//100))
    
    # Mắt trái
    eye_size = max(3, size // 20)
    draw.ellipse([
        center_x - radius//3, center_y - radius//4, 
        center_x - radius//3 + eye_size, center_y - radius//4 + eye_size
    ], fill='black')
    
    # Mắt phải  
    draw.ellipse([
        center_x + radius//3 - eye_size, center_y - radius//4,
        center_x + radius//3, center_y - radius//4 + eye_size
    ], fill='black')
    
    # Mũi (tam giác nhỏ)
    nose_size = max(2, size // 30)
    draw.polygon([
        (center_x, center_y + radius//8),
        (center_x - nose_size, center_y + radius//8 + nose_size),
        (center_x + nose_size, center_y + radius//8 + nose_size)
    ], fill='black')
    
    # Lưu file
    img.save(output_path, 'PNG')
    print(f"✅ Created: {output_path}")

# Tạo icons
os.makedirs('static', exist_ok=True)
print("🎨 Starting icon generation...")
create_cnv_icon(192, 'static/icon-192x192.png')
create_cnv_icon(512, 'static/icon-512x512.png')
print("🎉 Icon generation completed!")