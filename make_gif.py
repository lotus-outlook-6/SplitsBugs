import os
from PIL import Image

image_paths = [
    ".init/files/screenshot-1.png",
    ".init/files/screenshot-2.png",
    ".init/files/screenshot-3.png",
    ".init/files/screenshot-4.png",
    ".init/files/screenshot-5.png",
    ".init/files/screenshot-6.png",
    ".init/files/screenshot-7.png"
]

images = []
target_size = None

for p in image_paths:
    if os.path.exists(p):
        img = Image.open(p).convert("RGB")
        if target_size is None:
            target_size = img.size
        else:
            img = img.resize(target_size, Image.Resampling.LANCZOS)
        images.append(img)

if images:
    images[0].save(
        "public/app-demo.gif",
        save_all=True,
        append_images=images[1:],
        duration=5000,
        loop=0
    )
    print("Screenshot GIF successfully generated at public/app-demo.gif")
else:
    print("No images found.")
