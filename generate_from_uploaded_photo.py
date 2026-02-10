from PIL import Image, ImageDraw

# STRICTLY using the user's uploaded source image
source_path = "/Users/sonersaridag/.gemini/antigravity/brain/68063380-8b45-4fec-86a2-190b2ec76c6e/uploaded_media_1770741597183.png"
dest_path = "public/favicon.png"
size = 512
corner_radius = 64

try:
    print(f"Reading source image from: {source_path}")
    img = Image.open(source_path).convert("RGBA")
    
    # 1. Create a fresh white rounded square background
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size, size)], radius=corner_radius, fill=255)
    
    white_square = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    base.paste(white_square, (0, 0), mask=mask)
    
    # 2. Resize and Composite the Source Image
    # Target size: 75% of canvas
    target_dim = int(size * 0.75)
    
    # Maintain aspect ratio
    aspect = img.width / img.height
    if aspect > 1:
        new_w = target_dim
        new_h = int(target_dim / aspect)
    else:
        new_h = target_dim
        new_w = int(target_dim * aspect)
        
    img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Center
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    
    # Paste the source image onto the white square
    base.paste(img_resized, (x, y), img_resized)
    
    # 3. Save as new favicon
    base.save(dest_path)
    print(f"Success: Generated new favicon.png from source photo.")

except Exception as e:
    print(f"Error: {e}")
