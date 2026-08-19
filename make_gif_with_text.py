import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

frames = [
    {
        "file": ".init/files/screenshot-1.png",
        "text": "Groups Overview: Displays all active groups and overall settlements, allowing users to create new groups, check notifications, and easily search for specific groups."
    },
    {
        "file": ".init/files/screenshot-7.png",
        "text": "Group Management: Facilitates comprehensive tracking of group activities, pending balances, expense additions, and member communications."
    },
    {
        "file": ".init/files/screenshot-3.png",
        "text": "Activity Audit Trail: Displays a chronological timeline of all user transactions and account events for complete transparency."
    },
    {
        "file": ".init/files/screenshot-4.png",
        "text": "Account Settings: Serves as the central control hub for managing user preferences, security configurations, and application appearance."
    },
    {
        "file": ".init/files/screenshot-5.png",
        "text": "Notification Preferences: Allows granular control over email and browser alerts for specific account and group events."
    },
    {
        "file": ".init/files/screenshot-6.png",
        "text": "Security & Data Privacy: Provides robust controls for password management, application locking, data exportation, and account deletion."
    },
    {
        "file": ".init/files/screenshot-2.png",
        "text": "User Interface Customization: Showcases multiple premium themes, allowing users to personalize their application aesthetic."
    }
]

images = []
target_size = None

try:
    font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 36)
    title_font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 46)
except Exception:
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 36)
        title_font = font
    except Exception:
        font = ImageFont.load_default()
        title_font = font

for frame in frames:
    p = frame["file"]
    if os.path.exists(p):
        img = Image.open(p).convert("RGBA")
        
        if target_size is None:
            target_size = img.size
        else:
            img = img.resize(target_size, Image.Resampling.LANCZOS)
            
        bar_height = 240
        # Create a COMPLETELY TRANSPARENT background
        new_img = Image.new("RGBA", (target_size[0], target_size[1] + bar_height), (0, 0, 0, 0))
        new_img.paste(img, (0, 0))
        
        draw = ImageDraw.Draw(new_img)
        
        text = frame["text"]
        title_part = text.split(":")[0]
        desc_part = text.split(":")[1].strip()
        wrapped_desc = textwrap.fill(desc_part, width=85)
        
        title_bbox = draw.textbbox((0, 0), title_part, font=title_font)
        title_w = title_bbox[2] - title_bbox[0]
        title_h = title_bbox[3] - title_bbox[1]
        
        desc_bbox = draw.multiline_textbbox((0, 0), wrapped_desc, font=font)
        desc_w = desc_bbox[2] - desc_bbox[0]
        desc_h = desc_bbox[3] - desc_bbox[1]
        
        padding_x = 40
        padding_top = 15
        padding_bottom = 30
        gap = 15
        
        desc_box_h = desc_h + padding_top + padding_bottom
        desc_box_w = desc_w + (padding_x * 2)
        title_box_h = title_h + padding_top + padding_bottom
        title_box_w = title_w + (padding_x * 2)
        
        total_boxes_h = title_box_h + gap + desc_box_h
        start_y = target_size[1] + (bar_height - total_boxes_h) / 2
        
        title_box_y = start_y
        title_box_x = (target_size[0] - title_box_w) / 2
        
        desc_box_y = title_box_y + title_box_h + gap
        desc_box_x = (target_size[0] - desc_box_w) / 2
        
        box_color = (25, 25, 25, 255) # Solid Dark grey bubbles
        
        # Title box
        draw.rounded_rectangle(
            [title_box_x, title_box_y, title_box_x + title_box_w, title_box_y + title_box_h],
            radius=20, fill=box_color
        )
        
        # Description box
        draw.rounded_rectangle(
            [desc_box_x, desc_box_y, desc_box_x + desc_box_w, desc_box_y + desc_box_h],
            radius=20, fill=box_color
        )
        
        # Draw text
        draw.text(
            (title_box_x + padding_x, title_box_y + padding_top),
            title_part, fill=(255, 255, 255, 255), font=title_font
        )
        draw.multiline_text(
            (desc_box_x + padding_x, desc_box_y + padding_top),
            wrapped_desc, fill=(220, 220, 220, 255), font=font, align="center"
        )
        
        # Append as RGBA so Pillow knows it has transparency
        images.append(new_img)

if images:
    # Save as animated GIF with transparency and disposal=2 (clear frame)
    images[0].save(
        "public/app-demo.gif",
        save_all=True,
        append_images=images[1:],
        duration=5000,
        loop=0,
        disposal=2
    )
    print("GIF successfully generated at public/app-demo.gif")
else:
    print("No images found.")
