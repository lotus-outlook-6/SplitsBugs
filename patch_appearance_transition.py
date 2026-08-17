import re

with open('src/pages/appearance.astro', 'r') as f:
    content = f.read()

css_addition = """    .animate-soft-rise {
      animation: softRise 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }

    /* Theme transition ripple effect */
    .theme-transition::view-transition-group(root) {
      animation-duration: 0.6s;
    }
    .theme-transition::view-transition-new(root) {
      animation: theme-ripple 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      z-index: 2;
      mix-blend-mode: normal;
    }
    .theme-transition::view-transition-old(root) {
      animation: none;
      z-index: 1;
      mix-blend-mode: normal;
    }
    @keyframes theme-ripple {
      0% { clip-path: circle(0px at var(--click-x, 50%) var(--click-y, 50%)); }
      100% { clip-path: circle(var(--max-radius, 100vw) at var(--click-x, 50%) var(--click-y, 50%)); }
    }"""

content = content.replace('    .animate-soft-rise {\n      animation: softRise 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;\n      opacity: 0;\n    }', css_addition)

js_old = """      cards.forEach(card => {
        card.addEventListener('click', async () => {
          const themeName = card.getAttribute('data-theme');
          if (themeName) {
            localStorage.setItem('splitbug_theme', themeName);
            if (typeof (window as any).applyTheme === 'function') {
              (window as any).applyTheme(themeName);
            }
            updateActiveState(themeName);

            // Persist to Firestore
            try {
              const user = auth.currentUser;
              if (user) {
                await updateDoc(doc(db, 'users', user.uid), { appTheme: themeName });
              }
            } catch (e) {
              console.error('Failed to save theme to Firestore:', e);
            }
          }
        });
      });"""

js_new = """      cards.forEach(card => {
        card.addEventListener('click', async (e) => {
          const themeName = card.getAttribute('data-theme');
          if (!themeName) return;

          const doApply = () => {
            localStorage.setItem('splitbug_theme', themeName);
            if (typeof (window as any).applyTheme === 'function') {
              (window as any).applyTheme(themeName);
            }
            updateActiveState(themeName);
          };

          if (!document.startViewTransition) {
            doApply();
          } else {
            const rect = card.getBoundingClientRect();
            const x = e.clientX || rect.left + rect.width / 2;
            const y = e.clientY || rect.top + rect.height / 2;
            const endRadius = Math.hypot(
              Math.max(x, window.innerWidth - x),
              Math.max(y, window.innerHeight - y)
            );

            document.documentElement.style.setProperty('--click-x', `${x}px`);
            document.documentElement.style.setProperty('--click-y', `${y}px`);
            document.documentElement.style.setProperty('--max-radius', `${endRadius}px`);
            document.documentElement.classList.add('theme-transition');

            const transition = document.startViewTransition(() => {
              doApply();
            });

            transition.finished.finally(() => {
              document.documentElement.classList.remove('theme-transition');
              document.documentElement.style.removeProperty('--click-x');
              document.documentElement.style.removeProperty('--click-y');
              document.documentElement.style.removeProperty('--max-radius');
            });
          }

          // Persist to Firestore
          try {
            const user = auth.currentUser;
            if (user) {
              await updateDoc(doc(db, 'users', user.uid), { appTheme: themeName });
            }
          } catch (err) {
            console.error('Failed to save theme to Firestore:', err);
          }
        });
      });"""

content = content.replace(js_old, js_new)

with open('src/pages/appearance.astro', 'w') as f:
    f.write(content)

