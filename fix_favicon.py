from PIL import Image, ImageDraw
import os

# Source is the LOGO image provided by the user
source_path = "/Users/sonersaridag/.gemini/antigravity/brain/68063380-8b45-4fec-86a2-190b2ec76c6e/uploaded_media_1770751072941.png"
dest_path = "public/favicon.png"
size = 512
corner_radius = 80

try:
    if not os.path.exists(source_path):
        print(f"Error: Source file not found at {source_path}")
        exit(1)

    print(f"Reading source image from: {source_path}")
    img = Image.open(source_path).convert("RGBA")
    
    # Create white rounded square
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size, size)], radius=corner_radius, fill=255)
    
    white_square = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    base.paste(white_square, (0, 0), mask=mask)
    
    # Resize and Composite
    target_dim = int(size * 0.80)
    aspect = img.width / img.height
    
    if aspect > 1:
        new_w = target_dim
        new_h = int(target_dim / aspect)
    else:
        new_h = target_dim
        new_w = int(target_dim * aspect)
        
    img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    
    base.paste(img_resized, (x, y), img_resized)
    
    # Save
    base.save(dest_path, "PNG")
    
    # Verify
    if os.path.exists(dest_path):
        file_size = os.path.getsize(dest_path)
        print(f"Success: Generated {dest_path} (Size: {file_size} bytes)")
        if file_size == 0:
            print("Error: Generated file is empty!")
            exit(1)
    else:
        print("Error: File was not verified as saved.")
        exit(1)

except Exception as e:
    print(f"Critical Error: {e}")
    exit(1)
