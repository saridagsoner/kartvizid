from PIL import Image, ImageDraw

# Source is the 'd' image user uploaded which represents the correct homepage style
source_path = "/Users/sonersaridag/.gemini/antigravity/brain/68063380-8b45-4fec-86a2-190b2ec76c6e/uploaded_media_0_1770740329916.png"
dest_path = "public/favicon.png"
size = 512
corner_radius = 64  # Soft rounded corners

try:
    # 1. Load the 'd'
    img = Image.open(source_path).convert("RGBA")
    
    # 2. Create Background (White Rounded Square)
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # Mask for rounded corners
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size, size)], radius=corner_radius, fill=255)
    
    # White square
    white_square = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    base.paste(white_square, (0, 0), mask=mask)
    
    # 3. Resize and Center the 'd'
    # We want it to fill about 75% of the box to be legible
    target_d_size = int(size * 0.75)
    
    # Calculate aspect-preserving resize
    aspect = img.width / img.height
    if aspect > 1:
        new_w = target_d_size
        new_h = int(target_d_size / aspect)
    else:
        new_h = target_d_size
        new_w = int(target_d_size * aspect)
        
    img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Center coordinates
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    
    # Paste 'd' with its transparency
    base.paste(img_resized, (x, y), img_resized)
    
    # 4. Save
    base.save(dest_path)
    print(f"Success: Saved {dest_path}")

except Exception as e:
    print(f"Error: {e}")
