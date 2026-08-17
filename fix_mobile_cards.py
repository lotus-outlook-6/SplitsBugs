import re

with open('src/pages/appearance.astro', 'r') as f:
    content = f.read()

# Fix the skeleton cards
skeleton_card_original = """        <div class="rounded-2xl overflow-hidden border-2 border-hairline bg-canvas shadow-sm">
          <div class="p-4 border-b border-hairline bg-canvas flex items-center gap-3">
            <div class="w-8 h-8 shrink-0 rounded-full skeleton-circle"></div>
            <div class="flex-1">
              <div class="skeleton h-2.5 w-24 rounded-full mb-1.5"></div>
              <div class="skeleton h-2 w-16 rounded-full"></div>
            </div>
          </div>
          <div class="p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 bg-canvas-soft h-24 sm:h-32">
            <div class="self-end skeleton h-6 w-20 rounded-xl rounded-tr-sm"></div>
            <div class="self-start skeleton h-6 w-28 rounded-xl rounded-tl-sm"></div>
          </div>
          <div class="p-4 border-t border-hairline bg-canvas flex items-center justify-between">
            <div class="skeleton h-4 w-32 rounded"></div>
            <div class="w-5 h-5 rounded-full skeleton-circle shrink-0"></div>
          </div>
        </div>"""

skeleton_html = f"""      <!-- Skeleton Loader -->
      <div id="themeSkeleton" class="flex flex-col sm:grid sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
{chr(10).join([skeleton_card_original for _ in range(6)])}
      </div>"""

content = re.sub(
    r'<!-- Skeleton Loader -->.*?<div class="hidden sm:grid-cols-3',
    skeleton_html + '\n\n      <div class="hidden sm:grid-cols-3',
    content,
    flags=re.DOTALL
)

# Fix the real cards

# 1. Remove the wrapper: <div class="flex flex-row sm:block items-center w-full">
content = content.replace('<div class="flex flex-row sm:block items-center w-full">', '')

# 2. Fix the top section
# Old: <div class="p-4 sm:border-b border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center gap-3 w-auto sm:w-full">
# Or: <div class="p-4 sm:border-b border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center gap-3">
# Replace with: <div class="p-4 border-b border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center gap-3">
content = re.sub(
    r'<div class="p-4 sm:border-b border-\[var\(--p-border\)\] bg-\[var\(--p-canvas\)\] flex items-center gap-3( w-auto sm:w-full)?">',
    r'<div class="p-4 border-b border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center gap-3">',
    content
)

# 3. Fix the icon sizing
# Old: <div class="w-10 h-10 sm:w-8 sm:h-8 shrink-0 rounded-full
# Replace with: <div class="w-8 h-8 shrink-0 rounded-full
content = content.replace('w-10 h-10 sm:w-8 sm:h-8', 'w-8 h-8')

# 4. Remove hidden from text bars wrapper
content = content.replace('<div class="flex-1 hidden sm:block">', '<div class="flex-1">')

# 5. Fix the middle section
content = content.replace('<div class="hidden sm:flex p-3 sm:p-5 flex-col gap-2 sm:gap-3 bg-[var(--p-soft)] h-24 sm:h-32">', '<div class="flex p-3 sm:p-5 flex-col gap-2 sm:gap-3 bg-[var(--p-soft)] h-24 sm:h-32">')

# 6. Fix the bottom section
content = re.sub(
    r'<div class="p-4 sm:border-t border-\[var\(--p-border\)\] bg-\[var\(--p-canvas\)\] flex items-center justify-between flex-1 sm:flex-none">',
    r'<div class="p-4 border-t border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center justify-between">',
    content
)

# 7. Remove the flex-col sm:block from the title wrapper, and remove the subtitle
# We injected: <div class="flex flex-col sm:block text-left">...<span class="text-xs text-[var(--p-ink)] opacity-60 sm:hidden">...</span></div>
# We need to just leave the font-bold span.
content = re.sub(
    r'<div class="flex flex-col sm:block text-left">\s*(<span class="font-bold text-\[var\(--p-ink\)\]">.*?</span>)\s*<span class="text-xs.*?</span>\s*</div>',
    r'\1',
    content
)

# 8. We need to remove the closing div of the wrapper. 
# It was right before </button>.
content = re.sub(
    r'\s*</div>\n\s*</button>',
    r'\n        </button>',
    content
)

with open('src/pages/appearance.astro', 'w') as f:
    f.write(content)
