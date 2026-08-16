SplitBugs Brand Assets
=======================
Generated from the master logo (Logo.png) — vectorized and rebuilt as clean
two-color assets (Brand Blue #4B49FD / Brand Navy #0A1F4C).

FOLDER GUIDE
------------

favicon/
  favicon.ico              Multi-res icon (16/32/48px) for legacy browser tabs
  favicon.png              32x32, canonical fallback
  favicon-16x16.png        \
  favicon-32x32.png         | standard <link rel="icon"> sizes
  favicon-48x48.png        /
  favicon-64x64.png        Larger tab / taskbar use
  favicon-180.png          Apple touch icon (solid bg — iOS ignores alpha
                            and adds its own rounding, so this is pre-filled
                            with Brand Blue + white mark)
  favicon-192.png          Android home screen icon (transparent)
  favicon-192-maskable.png Android "maskable" variant (solid bg, safe zone)
  favicon-512.png          PWA manifest large icon (transparent)
  favicon.svg               Vector version — sharp at any size, used by
                            modern browsers that support SVG favicons

  Suggested <head> tags:
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/favicon-180.png">
    <link rel="manifest" href="/site.webmanifest">

app-icons/ (1024x1024 masters — downscale as needed)
  icon-transparent.png     Symbol only, no background — most flexible
  icon-square.png          Symbol on white, sharp corners
  icon-rounded.png         Squircle background (Brand Blue), white mark —
                            the "ChatGPT tab icon" style you asked for
  icon-circle.png          Circular background (Brand Navy), white mark
  icon-dark.png             Squircle, near-black background, white mark —
                            for dark-mode contexts / dark app stores

logos/
  logo-full.svg / .png     Full lockup: symbol + "SplitsBug" wordmark
  logo-symbol.svg / .png   "SB" mark only, no wordmark
  logo-wordmark.svg / .png "SplitsBug" text only, no mark
  logo-transparent.png     Same as logo-full.png (explicit transparent copy)
  logo-white.png           Full logo as a solid white silhouette — for dark
                            backgrounds
  logo-black.png           Full logo as a solid black silhouette — for
                            single-color print / stamping use

social/
  og-image.png             1200x630 Open Graph share image (white bg)
  twitter-card.png         1200x675 Twitter/X card image (white bg)
  appstore-icon.png        1024x1024, solid Brand Blue bg, no transparency,
                            no pre-applied corner rounding — this is the RAW
                            square Apple/Google expect; the App Store /
                            Play Store apply their own corner mask on
                            submission, so do not round this one yourself.

NOTES
-----
- All vector (.svg) files are true two-path vectors traced from the source
  artwork, not embedded rasters — they scale losslessly.
- Brand Blue: #4B49FD   Brand Navy: #0A1F4C
- Per SplitBugs project guidelines, this identity was built independently —
  no layout, palette, or iconography was referenced from Splitwise.
