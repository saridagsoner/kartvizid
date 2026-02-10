from PIL import Image, ImageDraw, ImageOps

source_path = "/Users/sonersaridag/.gemini/antigravity/brain/68063380-8b45-4fec-86a2-190b2ec76c6e/uploaded_media_0_1770740329916.png"
dest_path = "public/favicon.png"
size = 512
corner_radius = 80  # Adjust for desired roundness

try:
    # 1. Load the 'd' logo
    img = Image.open(source_path).convert("RGBA")
    
    # Trim whitespace from the 'd' first to get its true size
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    # 2. Create the base canvas (transparent)
    base = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # 3. Draw the white rounded square
    mask = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), (size, size)], radius=corner_radius, fill=255)
    
    # Create the white square image
    white_square = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    
    # Apply the rounded mask to the white square
    base.paste(white_square, (0, 0), mask=mask)
    
    # 4. Resize and center the 'd' logo onto the white square
    # Make the 'd' fit nicely (e.g., 70% of the box)
    target_icon_size = int(size * 0.7)
    
    # Calculate resize ratio
    ratio = min(target_icon_size / img.width, target_icon_size / img.height)
    new_w = int(img.width * ratio)
    new_h = int(img.height * ratio)
    
    img_resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # Center position
    x = (size - new_w) // 2
    y = (size - new_h) // 2
    
    # Paste the 'd' onto the white rounded square
    base.paste(img_resized, (x, y), img_resized)
    
    # 5. Save
    base.save(dest_path)
    print(f"Successfully created rounded square favicon at {dest_path}")

except Exception as e:
    print(f"Error processing image: {e}")
