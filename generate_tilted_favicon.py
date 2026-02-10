from PIL import Image, ImageDraw, ImageFont, ImageTransform

dest_path = "public/favicon.png"
size = 512
bg_color = (255, 255, 255, 255)
logo_color = (31, 109, 120, 255) # #1f6d78
corner_radius = 80

try:
    # 1. Background
    img = Image.new("RGBA", (size, size), (0,0,0,0))
    
    mask = Image.new("L", (size, size), 0)
    draw_mask = ImageDraw.Draw(mask)
    draw_mask.rounded_rectangle([(0, 0), (size, size)], radius=corner_radius, fill=255)
    
    white_square = Image.new("RGBA", (size, size), bg_color)
    img.paste(white_square, (0, 0), mask=mask)
    
    # 2. Draw 'd' on a temporary layer
    # We will draw it upright first, then shear it to tilt the stem right.
    d_layer = Image.new("RGBA", (size, size), (0,0,0,0))
    d_draw = ImageDraw.Draw(d_layer)
    
    # Using geometric drawing again for control
    cx, cy = size // 2, size // 2
    
    stem_width = 80
    stem_height = 300
    bowl_radius = 110
    
    # Draw logic for upright 'd'
    # Shift slightly left so after tilt it centers better
    offset_x = -40 
    
    stem_x = cx + 40 + offset_x
    stem_top = cy - 150
    stem_bottom = cy + 150
    
    # Bowl center
    bowl_cx = stem_x - 60
    bowl_cy = stem_bottom - bowl_radius - (stem_width // 4)
    
    # Draw Bowl (Outer)
    bbox = [(bowl_cx - bowl_radius), (bowl_cy - bowl_radius), (bowl_cx + bowl_radius), (bowl_cy + bowl_radius)]
    d_draw.ellipse(bbox, fill=logo_color)
    
    # Draw Bowl (Inner - White/Transparent hole)
    # Since we are pasting this layer ON TOP of white square, we can use transparent for the hole?
    # No, we want the white background to show through. 
    # Actually, if we shear the d_layer, the hole needs to move with it. 
    # We can use Composite with destination-out? Or just draw the hole with a color key?
    # Simpler: Draw the shape filled, then cut the hole.
    
    # Let's draw the stem
    d_draw.line([(stem_x, stem_top), (stem_x, stem_bottom)], fill=logo_color, width=stem_width)
    
    # Caps
    half_stem = stem_width // 2
    d_draw.ellipse([stem_x - half_stem, stem_top - half_stem, stem_x + half_stem, stem_top + half_stem], fill=logo_color)
    d_draw.ellipse([stem_x - half_stem, stem_bottom - half_stem, stem_x + half_stem, stem_bottom + half_stem], fill=logo_color)
    
    # Now cut the hole in the bowl
    # We use a separate mask for the hole or just draw clear pixel if possible?
    # In PIL RGBA, drawing (0,0,0,0) replaces? No, it blends.
    # We need to use clear mode.
    d_draw.ellipse([(bowl_cx - (bowl_radius - stem_width)), (bowl_cy - (bowl_radius - stem_width)), 
                    (bowl_cx + (bowl_radius - stem_width)), (bowl_cy + (bowl_radius - stem_width))], 
                   fill=(0,0,0,0), outline=None)
                   
    # Wait, simple Draw.ellipse with (0,0,0,0) on RGBA just draws nothing if it's normal mode.
    # We need to erase.
    # Let's create the d shape as a mask (L mode) or just strictly defined shape.
    
    # RETRYING DRAWING STRATEGY
    # Create the 'd' shape in black on transparent
    shape_img = Image.new("RGBA", (size, size), (0,0,0,0))
    s_draw = ImageDraw.Draw(shape_img)
    
    # Draw full d in logo color
    s_draw.ellipse(bbox, fill=logo_color)
    s_draw.line([(stem_x, stem_top), (stem_x, stem_bottom)], fill=logo_color, width=stem_width)
    s_draw.ellipse([stem_x - half_stem, stem_top - half_stem, stem_x + half_stem, stem_top + half_stem], fill=logo_color)
    s_draw.ellipse([stem_x - half_stem, stem_bottom - half_stem, stem_x + half_stem, stem_bottom + half_stem], fill=logo_color)
    
    # Now erase the hole
    hole_bbox = [(bowl_cx - (bowl_radius - stem_width)), (bowl_cy - (bowl_radius - stem_width)), 
                 (bowl_cx + (bowl_radius - stem_width)), (bowl_cy + (bowl_radius - stem_width))]
    
    # To erase, we can composite.
    # Or just iterate pixels (slow).
    # Use ImageChops? 
    # Easiest: Draw the hole in a color that doesn't exist (e.g., pure red) then make it transparent?
    # Or just stick to the 'hole' being White (since background is white)
    s_draw.ellipse(hole_bbox, fill=(255,255,255,255))
    
    # 3. Apply Shear (Tilt to right)
    # m = 0.2 means x' = x + 0.2*y -> moves top right if origin is top-left?
    # In PIL transform, data is (a, b, c, d, e, f) for Affine. 
    # x' = ax + by + c
    # y' = dx + ey + f
    # Shear x based on y: x' = x - 0.2 * y (tilts top right because y increases downwards)
    # Let's try Image.transform with AFFINE
    
    shear_factor = -0.2 # Negative shear with y moves top right? Let's assume standard coord.
    
    # Actually, simpler: Use `rotate`? User said "çizgisinin sağ tarafa yatık". 
    # Usually "yatık" implies italic/slant.
    # Let's use `transform` with Mesh or simple Affine.
    # Or just Rotate it 12 degrees clockwise?
    # User said previously "d ters yere yatık duruyor" for my previous attempts.
    # If I rotate standard, it tilts right.
    # Let's try Shear specifically.
    
    width, height = shape_img.size
    m = -0.3
    xshift = abs(m) * size
    new_width = width + int(xshift)
    
    # Transform
    # x' = x + m * y
    # y' = y
    # We need 6-tuple for affine (a, b, c, d, e, f)
    # x_new = a*x + b*y + c
    # y_new = d*x + e*y + f
    # We want x_new = x - 0.3 * y (tilts top right)
    # So a=1, b=0.3 ??
    # PIL uses inverse transform? "The data argument is a 6-tuple (a, b, c, d, e, f) which contain the first two rows of an affine transform matrix. For each pixel (x, y) in the output image, the new value is taken from a position (a x + b y + c, d x + e y + f) in the input image"
    # So to get input x from output x': x = x' - m*y'
    # So b should be positive to sample from left?
    
    matrix = (1, -0.3, 0, 0, 1, 0) # TILT RIGHT?
    # If b = -0.3: x_in = x_out - 0.3 * y_out. 
    # At top (y small), x_in is smaller -> samples from left -> content moves right? 
    # At bottom (y large), x_in is smaller -> content moves right? 
    # Test: x_out = x_in + 0.3 * y_in ? 
    # Let's just try a safe value.
    
    sheared_d = shape_img.transform((size, size), Image.AFFINE, (1, 0.2, -50, 0, 1, 0), resample=Image.BICUBIC)
    # b=0.2 means x_input = x_output + 0.2*y_output.
    # Bottom of output draws from further right of input -> Bottom moves Left. Top moves Right. 
    # This creates Right Tilt (Italic).
    
    # Paste sheared 'd' onto white square
    # Since we drew a white hole, the hole is white. Perfect for white background.
    img.paste(sheared_d, (0, 0), sheared_d)

    img.save(dest_path)
    print(f"Successfully generated tilted geometric favicon at {dest_path}")

except Exception as e:
    print(f"Error generating favicon: {e}")
