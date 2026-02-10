from PIL import Image, ImageDraw

dest_path = "public/favicon.png"
size = 512
bg_color = (255, 255, 255, 255)
logo_color = (31, 109, 120, 255) # #1f6d78
corner_radius = 80

try:
    # 1. Create Canvas
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    
    # 2. Draw Rounded Square Background
    mask = Image.new("L", (size, size), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([(0, 0), (size, size)], radius=corner_radius, fill=255)
    
    white_square = Image.new("RGBA", (size, size), bg_color)
    img.paste(white_square, (0, 0), mask=mask)
    
    # 3. Draw the 'd' manually (Geometric)
    # Dimensions for the 'd'
    # It consists of a vertical stem (right) and a circular bowl (left)
    
    d_draw = ImageDraw.Draw(img)
    
    # Center point reference
    cx, cy = size // 2, size // 2
    
    stem_width = 80
    stem_height = 300
    bowl_radius = 110
    bowl_stroke = 80
    
    # Stem calculations
    # Stem is on the right side of the letter.
    # Let's define the stem position.
    stem_x = cx + 40
    stem_top = cy - 150
    stem_bottom = cy + 150
    
    # Draw Stem (Rounded caps)
    d_draw.line([(stem_x, stem_top), (stem_x, stem_bottom)], fill=logo_color, width=stem_width)
    
    # Draw Bowl (Circle)
    # The bowl is to the left of the stem.
    # Center of bowl should align with bottom part of stem roughly.
    bowl_cx = stem_x - 60
    bowl_cy = stem_bottom - bowl_radius - (stem_width // 4) 
    
    # Bounding box for the circle
    bbox = [
        (bowl_cx - bowl_radius), (bowl_cy - bowl_radius),
        (bowl_cx + bowl_radius), (bowl_cy + bowl_radius)
    ]
    
    # Draw the circle stroke
    # Since PIL line width for ellipse is not perfect, let's draw a filled circle and a smaller white (or transparent?) inner circle?
    # No, we want transparent inside the loop or white matching background?
    # Background is white, so we can draw filled teal circle and filled white circle inside.
    
    d_draw.ellipse(bbox, fill=logo_color)
    
    inner_radius = bowl_radius - stem_width
    bbox_inner = [
        (bowl_cx - inner_radius), (bowl_cy - inner_radius),
        (bowl_cx + inner_radius), (bowl_cy + inner_radius)
    ]
    d_draw.ellipse(bbox_inner, fill=bg_color)
    
    # Redraw stem part that might be covered? No, stem is drawn first? 
    # Let's redraw the stem to be on top/merged cleanly.
    # Actually, let's draw stem last or union them.
    # Simple stem again to ensure connection
    d_draw.line([(stem_x, stem_top), (stem_x, stem_bottom)], fill=logo_color, width=stem_width)
    # Add rounded caps explicitly if needed, but line width does round caps usually? 
    # PIL line default joint might be blocky. 
    # Let's add circles at ends of stem for roundness
    half_stem = stem_width // 2
    d_draw.ellipse([stem_x - half_stem, stem_top - half_stem, stem_x + half_stem, stem_top + half_stem], fill=logo_color)
    d_draw.ellipse([stem_x - half_stem, stem_bottom - half_stem, stem_x + half_stem, stem_bottom + half_stem], fill=logo_color)

    # 4. Save
    img.save(dest_path)
    print(f"Successfully generated geometric favicon at {dest_path}")

except Exception as e:
    print(f"Error generating favicon: {e}")
