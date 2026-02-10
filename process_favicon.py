from PIL import Image
import os

source_path = "/Users/sonersaridag/.gemini/antigravity/brain/68063380-8b45-4fec-86a2-190b2ec76c6e/uploaded_media_1770739683676.png"
dest_path = "public/favicon.png"

try:
    img = Image.open(source_path)
    img = img.convert("RGBA")
    
    # Get the bounding box of the non-transparent content
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    # Create a new square image with transparent background
    max_dim = max(img.width, img.height)
    # Add a little padding (10%)
    padding = int(max_dim * 0.1)
    new_size = max_dim + (padding * 2)
    
    new_img = Image.new("RGBA", (new_size, new_size), (0, 0, 0, 0))
    
    # Paste the cropped logo into the center
    x = (new_size - img.width) // 2
    y = (new_size - img.height) // 2
    new_img.paste(img, (x, y), img)
    
    # Resize to standard favicon sizes (e.g., 512x512 for manifest)
    final_img = new_img.resize((512, 512), Image.Resampling.LANCZOS)
    
    final_img.save(dest_path)
    print(f"Successfully processed and saved favicon to {dest_path}")

except Exception as e:
    print(f"Error processing image: {e}")
