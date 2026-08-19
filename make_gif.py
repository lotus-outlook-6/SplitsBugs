import os
import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageDraw, ImageFont

frames = [
    (".init/files/screenshot-1.png", ".init/files/screenshot-mobile-1.webp"),
    (".init/files/screenshot-2.png", ".init/files/screenshot-mobile-2.webp"),
    (".init/files/screenshot-3.png", ".init/files/screenshot-mobile-3.webp"),
    (".init/files/screenshot-4.png", ".init/files/screenshot-mobile-4.webp"),
    (".init/files/screenshot-5.png", ".init/files/screenshot-mobile-5.webp"),
    (".init/files/screenshot-6.png", ".init/files/screenshot-mobile-6.webp"),
    (".init/files/screenshot-7.png", ".init/files/screenshot-mobile-7.webp")
]

try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 36)
except Exception:
    font = ImageFont.load_default()

images = []
target_h = 800
gap = 60
text_bar = 100
bg_color = (0, 0, 0, 0) # Transparent background
pill_color = (25, 25, 25, 255)

for d_path, m_path in frames:
    if os.path.exists(d_path) and os.path.exists(m_path):
        img_d = Image.open(d_path).convert("RGBA")
        img_m = Image.open(m_path).convert("RGBA")
        
        # Scale Desktop
        ratio_d = target_h / img_d.size[1]
        w_d = int(img_d.size[0] * ratio_d)
        img_d = img_d.resize((w_d, target_h), Image.Resampling.LANCZOS)
        
        # Scale Mobile
        ratio_m = target_h / img_m.size[1]
        w_m = int(img_m.size[0] * ratio_m)
        img_m = img_m.resize((w_m, target_h), Image.Resampling.LANCZOS)
        
        total_w = w_d + gap + w_m
        total_h = target_h + text_bar
        
        new_img = Image.new("RGBA", (total_w, total_h), bg_color)
        
        # Paste images
        new_img.paste(img_d, (0, 0))
        new_img.paste(img_m, (w_d + gap, 0))
        
        draw = ImageDraw.Draw(new_img)
        
        # Draw labels below images in rounded pills
        label_d = "Web View (Desktop)"
        label_m = "Mobile Optimized"
        
        pad_x = 30
        pad_y = 15
        
        # Center label_d under Desktop
        bbox_d = draw.textbbox((0, 0), label_d, font=font)
        lw_d = bbox_d[2] - bbox_d[0]
        lh_d = bbox_d[3] - bbox_d[1]
        x_d = (w_d - lw_d) / 2
        y_text = target_h + (text_bar - lh_d) / 2
        
        draw.rounded_rectangle([x_d - pad_x, y_text - pad_y, x_d + lw_d + pad_x, y_text + lh_d + pad_y], radius=15, fill=pill_color)
        draw.text((x_d, y_text), label_d, fill=(230, 237, 243, 255), font=font)
        
        # Center label_m under Mobile
        bbox_m = draw.textbbox((0, 0), label_m, font=font)
        lw_m = bbox_m[2] - bbox_m[0]
        lh_m = bbox_m[3] - bbox_m[1]
        x_m = w_d + gap + (w_m - lw_m) / 2
        
        draw.rounded_rectangle([x_m - pad_x, y_text - pad_y, x_m + lw_m + pad_x, y_text + lh_m + pad_y], radius=15, fill=pill_color)
        draw.text((x_m, y_text), label_m, fill=(230, 237, 243, 255), font=font)
        
        images.append(np.array(new_img))

if images:
    # Use imageio to save with better color handling
    imageio.mimsave("public/app-demo.gif", images, duration=8000, loop=0)
    print("Screenshot GIF successfully generated at public/app-demo.gif")
    
    with open("temp_width.txt", "w") as f:
        f.write(str(images[0].shape[1])) # shape[1] is width
else:
    print("No images found.")
