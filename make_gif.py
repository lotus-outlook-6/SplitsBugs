import os
from PIL import Image

image_paths = [
    ".init/files/screenshot-1.png",
    ".init/files/screenshot-7.png",
    ".init/files/screenshot-2.png",
    ".init/files/screenshot-3.png",
    ".init/files/screenshot-4.png",
    ".init/files/screenshot-5.png",
    ".init/files/screenshot-6.png"
]

images = []
for p in image_paths:
    if os.path.exists(p):
        img = Image.open(p).convert("RGB")
        # Resize all to the size of the first image to ensure consistency
        if len(images) == 0:
            target_size = img.size
        else:
            img = img.resize(target_size, Image.Resampling.LANCZOS)
        images.append(img)

if images:
    # Save as animated GIF, 3 seconds per slide (3000ms)
    images[0].save(
        "public/app-demo.gif",
        save_all=True,
        append_images=images[1:],
        duration=3000,
        loop=0
    )
    print("GIF successfully generated at public/app-demo.gif")
else:
    print("No images found.")
