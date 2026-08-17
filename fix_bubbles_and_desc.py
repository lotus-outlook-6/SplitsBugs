import re

with open('src/pages/appearance.astro', 'r') as f:
    content = f.read()

# 1. Fix the bubbles
# Old: h-20 sm:h-40
content = content.replace('h-20 sm:h-40', 'h-28 sm:h-40')

# Old: text-[9px] sm:text-xs px-2 py-1 sm:px-3 sm:py-2
# New: text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2
content = content.replace('text-[9px] sm:text-xs px-2 py-1 sm:px-3 sm:py-2', 'text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2')

# 2. Add descriptions to the titles
descriptions = {
    'System Default': 'Auto light/dark',
    'Light (White)': 'Clean and bright',
    'Light (Cream)': 'Warm and cozy',
    'Dark (Grey)': 'Sleek grey tones',
    'Dark (AMOLED)': 'Saves battery',
    'Splitsbug Theme': 'Changes automatically'
}

for title, desc in descriptions.items():
    # The title wrapper currently looks like this:
    # <span class="font-bold text-[var(--p-ink)] text-sm sm:text-base">System Default</span>
    # Wait, earlier I also changed the icon wrapper to w-7 h-7. Let's make it w-9 h-9 so it's a bit larger to match the two lines of text.
    
    old_title_span = f'<span class="font-bold text-[var(--p-ink)] text-sm sm:text-base">{title}</span>'
    new_title_html = f"""<div class="flex flex-col text-left">
                  <span class="font-bold text-[var(--p-ink)] text-base">{title}</span>
                  <span class="text-xs text-[var(--p-ink)] opacity-60">{desc}</span>
                </div>"""
    content = content.replace(old_title_span, new_title_html)

# Also let's enlarge the icon on mobile from w-7 h-7 to w-10 h-10 so it balances the two lines of text
content = content.replace('w-7 h-7', 'w-10 h-10')

with open('src/pages/appearance.astro', 'w') as f:
    f.write(content)

