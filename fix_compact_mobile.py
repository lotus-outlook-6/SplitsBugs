import re

with open('src/pages/appearance.astro', 'r') as f:
    content = f.read()

# 1. Update the skeletons
skeleton_card = """        <div class="rounded-2xl overflow-hidden border-2 border-hairline bg-canvas shadow-sm">
          <div class="hidden sm:flex p-4 border-b border-hairline bg-canvas items-center gap-3">
            <div class="w-8 h-8 shrink-0 rounded-full skeleton-circle"></div>
            <div class="flex-1">
              <div class="skeleton h-2.5 w-24 rounded-full mb-1.5"></div>
              <div class="skeleton h-2 w-16 rounded-full"></div>
            </div>
          </div>
          <div class="p-2.5 sm:p-5 flex flex-col gap-1.5 sm:gap-3 bg-canvas-soft h-20 sm:h-32 justify-center">
            <div class="self-end skeleton h-5 sm:h-6 w-20 rounded-xl rounded-tr-sm"></div>
            <div class="self-start skeleton h-5 sm:h-6 w-28 rounded-xl rounded-tl-sm"></div>
          </div>
          <div class="p-3 sm:p-4 border-t border-hairline bg-canvas flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="sm:hidden w-6 h-6 shrink-0 rounded-full skeleton-circle"></div>
              <div class="skeleton h-3.5 sm:h-4 w-24 sm:w-32 rounded"></div>
            </div>
            <div class="w-5 h-5 rounded-full skeleton-circle shrink-0"></div>
          </div>
        </div>"""

skeleton_html = f"""      <!-- Skeleton Loader -->
      <div id="themeSkeleton" class="flex flex-col sm:grid sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
{chr(10).join([skeleton_card for _ in range(6)])}
      </div>"""

content = re.sub(
    r'<!-- Skeleton Loader -->.*?<div class="hidden sm:grid-cols-3',
    skeleton_html + '\n\n      <div class="hidden sm:grid-cols-3',
    content,
    flags=re.DOTALL
)

# 2. Update real cards
# Top Section -> Hide on mobile
content = content.replace('<div class="p-4 border-b border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center gap-3">', '<div class="hidden sm:flex p-4 border-b border-[var(--p-border)] bg-[var(--p-canvas)] items-center gap-3">')

# Middle Section -> Shorter on mobile
content = content.replace('<div class="flex p-3 sm:p-5 flex-col gap-2 sm:gap-3 bg-[var(--p-soft)] h-24 sm:h-32">', '<div class="flex p-2.5 sm:p-5 flex-col gap-1.5 sm:gap-3 bg-[var(--p-soft)] h-20 sm:h-32 justify-center">')
content = content.replace('text-[10px] sm:text-xs', 'text-[9px] sm:text-xs')

# Bottom Section -> Less padding on mobile
content = content.replace('<div class="p-4 border-t border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center justify-between">', '<div class="p-3 sm:p-4 border-t border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center justify-between">')

# Bottom Title -> Add Icon & size adjustments
icons = {
    'System Default': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    'Light (White)': '<span class="font-bold text-[12px]">W</span>',
    'Light (Cream)': '<span class="font-bold text-[12px]">C</span>',
    'Dark (Grey)': '<span class="font-bold text-[12px]">G</span>',
    'Dark (AMOLED)': '<span class="font-bold text-[12px]">A</span>',
    'Splitsbug Theme': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>'
}

for title, icon_html in icons.items():
    old_span = f'<span class="font-bold text-[var(--p-ink)]">{title}</span>'
    new_wrapper = f"""<div class="flex items-center gap-2.5">
                <div class="sm:hidden w-7 h-7 shrink-0 rounded-full bg-[var(--p-soft)] flex items-center justify-center text-[var(--p-ink)] border border-[var(--p-border)]">
                  {icon_html}
                </div>
                <span class="font-bold text-[var(--p-ink)] text-sm sm:text-base">{title}</span>
              </div>"""
    content = content.replace(old_span, new_wrapper)

with open('src/pages/appearance.astro', 'w') as f:
    f.write(content)

