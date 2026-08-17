import re

with open('src/pages/appearance.astro', 'r') as f:
    content = f.read()

card_skeleton = """        <div class="rounded-2xl overflow-hidden border-2 border-hairline bg-canvas shadow-sm">
          <div class="flex flex-row sm:block items-center w-full">
            <div class="p-4 sm:border-b border-hairline flex items-center gap-3 w-auto sm:w-full">
              <div class="w-10 h-10 sm:w-8 sm:h-8 shrink-0 rounded-full skeleton-circle"></div>
              <div class="flex-1 hidden sm:block">
                <div class="skeleton h-2.5 w-24 rounded-full mb-1.5"></div>
                <div class="skeleton h-2 w-16 rounded-full"></div>
              </div>
            </div>
            <div class="hidden sm:flex p-3 sm:p-5 flex-col gap-2 sm:gap-3 bg-canvas-soft h-24 sm:h-32">
              <div class="self-end skeleton h-6 w-20 rounded-xl rounded-tr-sm"></div>
              <div class="self-start skeleton h-6 w-28 rounded-xl rounded-tl-sm"></div>
            </div>
            <div class="p-4 sm:border-t border-hairline flex items-center justify-between flex-1 sm:flex-none">
              <div class="flex flex-col gap-1.5 sm:block">
                <div class="skeleton h-4 w-24 rounded sm:mb-0"></div>
                <div class="skeleton h-2.5 w-32 rounded sm:hidden"></div>
              </div>
              <div class="w-5 h-5 rounded-full skeleton-circle shrink-0"></div>
            </div>
          </div>
        </div>"""

skeleton_html = f"""      <!-- Skeleton Loader -->
      <div id="themeSkeleton" class="flex flex-col sm:grid sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
{chr(10).join([card_skeleton for _ in range(6)])}
      </div>"""

# Replace old skeleton
content = re.sub(
    r'<!-- Skeleton Loader -->.*?<div class="hidden flex-col',
    skeleton_html + '\n\n      <div class="hidden flex-col',
    content,
    flags=re.DOTALL
)

# Add CSS animation
css_anim = """    .preview-dark-amoled { --p-canvas: #000000; --p-soft: #0a0a0a; --p-ink: #ffffff; --p-border: #2f2f2f; --p-brand: #818cf8; }

    @keyframes softRise {
      0% { opacity: 0; transform: translateY(15px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-soft-rise {
      animation: softRise 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }"""
content = content.replace('.preview-dark-amoled { --p-canvas: #000000; --p-soft: #0a0a0a; --p-ink: #ffffff; --p-border: #2f2f2f; --p-brand: #818cf8; }', css_anim)


# Add JS animation logic in showGrid()
js_old = """      function showGrid() {
        if (skeleton) {
          skeleton.style.display = 'none'; // Force hide to override sm:grid
        }
        if (themeGrid) {
          themeGrid.classList.remove('hidden');
          themeGrid.classList.add('flex', 'sm:grid');
        }
      }"""

js_new = """      function showGrid() {
        if (skeleton) {
          skeleton.style.display = 'none';
        }
        if (themeGrid) {
          themeGrid.classList.remove('hidden');
          themeGrid.classList.add('flex', 'sm:grid');
          
          // Animate cards rising
          const cards = document.querySelectorAll('.theme-card');
          cards.forEach((card, index) => {
            card.classList.add('animate-soft-rise');
            card.style.animationDelay = `${index * 50}ms`;
          });
        }
      }"""
content = content.replace(js_old, js_new)


with open('src/pages/appearance.astro', 'w') as f:
    f.write(content)

