import re

with open('src/pages/appearance.astro', 'r') as f:
    content = f.read()

# Fix the grid class
content = content.replace('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3', 'grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3')

# We'll use regex to find each card and replace its internals
# The card has 3 main divs inside it
# 1. <div class="absolute inset-0..."></div>
# 2. <div class="p-4 border-b...">...</div>
# 3. <div class="p-3 sm:p-5 flex flex-col...">...</div>
# 4. <div class="p-4 border-t...">...</div>

def process_card(match):
    full_match = match.group(0)
    
    # Hide the absolute gradient on mobile
    full_match = full_match.replace('<div class="absolute inset-0', '<div class="hidden sm:block absolute inset-0')
    
    # Wrap everything after the button opening tag and absolute div in <div class="flex flex-col sm:block">... wait
    # We want flex-row on mobile, flex-col on desktop
    # BUT on desktop, block layout works perfectly fine as it was originally. So flex-row sm:block
    
    # Find the top block: <div class="p-4 border-b border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center gap-3">
    full_match = re.sub(
        r'<div class="(p-4 border-b border-\[var\(--p-border\)\] bg-\[var\(--p-canvas\)\] flex items-center gap-3)">',
        r'<div class="\1 sm:w-full w-auto border-b-0 sm:border-b pr-0 sm:pr-4">',
        full_match
    )
    
    # In top block, make icon larger on mobile:
    full_match = re.sub(
        r'<div class="(w-8 h-8 rounded-full bg-\[var\(--p-soft\)\] flex items-center justify-center text-\[var\(--p-ink\)\] border border-\[var\(--p-border\)\])">',
        r'<div class="w-10 h-10 sm:w-8 sm:h-8 shrink-0 rounded-full bg-[var(--p-soft)] flex items-center justify-center text-[var(--p-ink)] border border-[var(--p-border)]">',
        full_match
    )
    
    # In top block, hide the text bars on mobile:
    full_match = re.sub(
        r'<div class="flex-1">',
        r'<div class="flex-1 hidden sm:block">',
        full_match
    )
    
    # Middle block: <div class="p-3 sm:p-5 flex flex-col...
    full_match = re.sub(
        r'<div class="p-3 sm:p-5 flex flex-col',
        r'<div class="hidden sm:flex p-3 sm:p-5 flex-col',
        full_match
    )
    
    # Bottom block: <div class="p-4 border-t ...
    full_match = re.sub(
        r'<div class="p-4 border-t border-\[var\(--p-border\)\] bg-\[var\(--p-canvas\)\] flex items-center justify-between">',
        r'<div class="p-4 border-t-0 sm:border-t border-[var(--p-border)] bg-[var(--p-canvas)] flex items-center justify-between flex-1 sm:flex-none pl-3 sm:pl-4">',
        full_match
    )
    
    # Wrap the 3 blocks in <div class="flex flex-row sm:block w-full">
    # We can do this by finding the absolute div and inserting the wrapper after it
    # And closing it right before </button>
    parts = full_match.split('pointer-events-none"></div>')
    if len(parts) == 2:
        new_match = parts[0] + 'pointer-events-none"></div>\n          <div class="flex flex-row sm:block w-full items-center">' + parts[1]
        new_match = new_match.replace('</button>', '          </div>\n        </button>')
        full_match = new_match
    
    # Add subtitles for mobile
    if "System Default" in full_match:
        full_match = full_match.replace('<span class="font-bold text-[var(--p-ink)]">System Default</span>', '<div class="flex flex-col text-left"><span class="font-bold text-[var(--p-ink)]">System Default</span><span class="text-xs text-[var(--p-ink)] opacity-60 sm:hidden">Auto light/dark</span></div>')
    elif "Light (White)" in full_match:
        full_match = full_match.replace('<span class="font-bold text-[var(--p-ink)]">Light (White)</span>', '<div class="flex flex-col text-left"><span class="font-bold text-[var(--p-ink)]">Light (White)</span><span class="text-xs text-[var(--p-ink)] opacity-60 sm:hidden">Clean and bright</span></div>')
    elif "Light (Cream)" in full_match:
        full_match = full_match.replace('<span class="font-bold text-[var(--p-ink)]">Light (Cream)</span>', '<div class="flex flex-col text-left"><span class="font-bold text-[var(--p-ink)]">Light (Cream)</span><span class="text-xs text-[var(--p-ink)] opacity-60 sm:hidden">Warm and cozy</span></div>')
    elif "Dark (Grey)" in full_match:
        full_match = full_match.replace('<span class="font-bold text-[var(--p-ink)]">Dark (Grey)</span>', '<div class="flex flex-col text-left"><span class="font-bold text-[var(--p-ink)]">Dark (Grey)</span><span class="text-xs text-[var(--p-ink)] opacity-60 sm:hidden">Sleek grey tones</span></div>')
    elif "Dark (AMOLED)" in full_match:
        full_match = full_match.replace('<span class="font-bold text-[var(--p-ink)]">Dark (AMOLED)</span>', '<div class="flex flex-col text-left"><span class="font-bold text-[var(--p-ink)]">Dark (AMOLED)</span><span class="text-xs text-[var(--p-ink)] opacity-60 sm:hidden">Pitch black, saves battery</span></div>')
    elif "Splitsbug Theme" in full_match:
        full_match = full_match.replace('<span class="font-bold text-[var(--p-ink)]">Splitsbug Theme</span>', '<div class="flex flex-col text-left"><span class="font-bold text-[var(--p-ink)]">Splitsbug Theme</span><span class="text-xs text-[var(--p-ink)] opacity-60 sm:hidden">Changes automatically</span></div>')
        full_match = full_match.replace('bg-brand/5', 'bg-brand/5 hidden sm:block')

    return full_match

content = re.sub(r'<button .*?data-theme=.*?</button>', process_card, content, flags=re.DOTALL)

with open('src/pages/appearance.astro', 'w') as f:
    f.write(content)

