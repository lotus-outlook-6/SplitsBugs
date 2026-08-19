import os
import textwrap
from PIL import Image, ImageDraw, ImageFont

texts = [
    "Groups Overview: Displays all active groups and overall settlements, allowing users to create new groups, check notifications, and easily search for specific groups.",
    "Group Management: Facilitates comprehensive tracking of group activities, pending balances, expense additions, and member communications.",
    "Activity Audit Trail: Displays a chronological timeline of all user transactions and account events for complete transparency.",
    "Account Settings: Serves as the central control hub for managing user preferences, security configurations, and application appearance.",
    "Notification Preferences: Allows granular control over email and browser alerts for specific account and group events.",
    "Security & Data Privacy: Provides robust controls for password management, application locking, data exportation, and account deletion.",
    "User Interface Customization: Showcases multiple premium themes, allowing users to personalize their application aesthetic."
]

target_width = 1702 # Default width
if os.path.exists("temp_width.txt"):
    with open("temp_width.txt", "r") as f:
        target_width = int(f.read().strip())

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

images = []
bar_height = 240

for text in texts:
    new_img = Image.new("RGBA", (target_width, bar_height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(new_img)
    
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
    start_y = (bar_height - total_boxes_h) / 2
    
    title_box_y = start_y
    title_box_x = (target_width - title_box_w) / 2
    
    desc_box_y = title_box_y + title_box_h + gap
    desc_box_x = (target_width - desc_box_w) / 2
    
    box_color = (25, 25, 25, 255)
    
    draw.rounded_rectangle(
        [title_box_x, title_box_y, title_box_x + title_box_w, title_box_y + title_box_h],
        radius=20, fill=box_color
    )
    
    draw.rounded_rectangle(
        [desc_box_x, desc_box_y, desc_box_x + desc_box_w, desc_box_y + desc_box_h],
        radius=20, fill=box_color
    )
    
    draw.text(
        (title_box_x + padding_x, title_box_y + padding_top),
        title_part, fill=(255, 255, 255, 255), font=title_font
    )
    draw.multiline_text(
        (desc_box_x + padding_x, desc_box_y + padding_top),
        wrapped_desc, fill=(220, 220, 220, 255), font=font, align="center"
    )
    
    images.append(new_img)

if images:
    import imageio.v2 as imageio
    import numpy as np
    
    # Convert PIL images to numpy arrays for imageio
    np_images = [np.array(img) for img in images]
    
    # Use imageio to save with better color handling
    imageio.mimsave("public/subtitles.gif", np_images, duration=8000, loop=0)
    print("Subtitles GIF successfully generated at public/subtitles.gif")
