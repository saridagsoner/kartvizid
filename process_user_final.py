from PIL import Image, ImageDraw

# OPTION 2: Use the exact image user provided in the last turn
source_path = "/Users/sonersaridag/.gemini/antigravity/brain/68063380-8b45-4fec-86a2-190b2ec76c6e/uploaded_media_1770741597183.png"
dest_path = "public/favicon.png"
size = 512
corner_radius = 64

try:
    img = Image.open(source_path).convert("RGBA")
    
    # Create White Rounded Square Background
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size, size)], radius=corner_radius, fill=255)
    
    white_square = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    base.paste(white_square, (0, 0), mask=mask)
    
    # Resize and Center the User's Image
    # Target size: 75% of canvas to leave breathing room
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
    
    base.paste(img_resized, (x, y), img_resized)
    
    base.save(dest_path)
    print(f"Success: Processed user image to {dest_path}")

except Exception as e:
    print(f"Error: {e}")
