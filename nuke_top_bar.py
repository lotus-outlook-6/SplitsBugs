import re

with open('src/pages/appearance.astro', 'r') as f:
    content = f.read()

# 1. Remove skeleton top bar
content = re.sub(
    r'\s*<div class="hidden sm:flex p-4 border-b border-hairline bg-canvas items-center gap-3">\s*<div class="w-8 h-8 shrink-0 rounded-full skeleton-circle"></div>\s*<div class="flex-1">\s*<div class="skeleton h-2.5 w-24 rounded-full mb-1.5"></div>\s*<div class="skeleton h-2 w-16 rounded-full"></div>\s*</div>\s*</div>',
    '',
    content
)

# 2. Remove real cards top bar (it has an SVG or a span for the icon)
# The block starts with <div class="hidden sm:flex p-4 border-b border-[var(--p-border)] bg-[var(--p-canvas)] items-center gap-3">
# and ends with the closing div of <div class="flex-1">...</div></div>
pattern = r'\s*<div class="hidden sm:flex p-4 border-b border-\[var\(--p-border\)\] bg-\[var\(--p-canvas\)\] items-center gap-3">.*?<div class="flex-1">\s*<div class="h-2.5 w-24 bg-\[var\(--p-ink\)\] opacity-20 rounded-full mb-1.5"></div>\s*<div class="h-2 w-16 bg-\[var\(--p-ink\)\] opacity-10 rounded-full"></div>\s*</div>\s*</div>'

content = re.sub(
    pattern,
    '',
    content,
    flags=re.DOTALL
)

# 3. I also need to make sure the middle section (bubbles) now serves as the top of the card.
# It currently has: <div class="flex p-2.5 sm:p-5 flex-col gap-1.5 sm:gap-3 bg-[var(--p-soft)] h-20 sm:h-32 justify-center">
# For desktop, it might be nice to increase its height slightly so it doesn't look too squashed without the header.
# Let's change `sm:h-32` to `sm:h-40`.
content = content.replace('sm:h-32', 'sm:h-40')

with open('src/pages/appearance.astro', 'w') as f:
    f.write(content)

