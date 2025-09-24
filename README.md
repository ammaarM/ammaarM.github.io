# Ultra-lean static portfolio

This repository hosts a lightweight, accessible personal portfolio. It is crafted with plain HTML, CSS, and JavaScript so it can be deployed directly with GitHub Pages—no build tools required.

## Project structure

```
/
├── index.html      # Semantic markup + inline critical styles
├── styles.css      # Main styling (light/dark themes, layout, animations)
├── script.js       # Theme toggle, reveal animations, GitHub repos
├── favicon.svg     # Simple gradient monogram icon
├── robots.txt      # Allow all crawlers + sitemap pointer
├── sitemap.xml     # Root + section anchors
└── assets/
    └── .gitkeep    # Placeholder – add avatar/resume assets here
```

## Customisation

- **Identity**: Update text in `index.html` (name, tagline, bio, skills, contact links) as needed.
- **Avatar**: Drop a square JPG at `assets/avatar.jpg`. The script swaps to initials automatically if the file is missing or fails to load.
- **Resume**: Upload your PDF resume as `assets/resume.pdf`. The “Download CV” button links to that path.
- **Skills & content**: Edit section copy, skill chips, and contact details directly in the markup.
- **Theme defaults**: Change colour tokens in `styles.css` to refresh the palette. The toggle cycles light → dark → system and persists the choice in `localStorage`.

## GitHub projects

`script.js` fetches the latest repositories for `ammaarM` (excluding forks and archived repos). Results are sorted by stars, then last update, and capped at 12 cards. If the API call fails, a small curated fallback list renders instead. Adjust the username or fallback data inside `script.js` if you fork this project.

## Deployment

1. Commit your changes to the `main` branch.
2. In GitHub, open **Settings → Pages** and choose the `main` branch with `/ (root)`.
3. Save—Pages will publish the site at `https://<username>.github.io/` within a minute or two.

## Local preview

Open `index.html` in your browser (double-click or use a static server like `python -m http.server`). No dependencies or build steps are required.

## Accessibility & performance notes

- Includes a skip link, semantic landmarks, focus outlines, and high-contrast colour pairs.
- Respects `prefers-reduced-motion` (reveals and transitions are disabled for reduced-motion users).
- Critical CSS (fonts, layout shell) is inlined in `index.html` to speed up first paint; the rest lives in `styles.css`.

## TODOs after cloning

- [ ] Replace placeholder copy with your story and achievements.
- [ ] Add `assets/avatar.jpg` and ensure it’s optimised for the web.
- [ ] Upload `assets/resume.pdf` or update the CTA link to your preferred resume host.
- [ ] Review `robots.txt` and `sitemap.xml` if you change URLs or section IDs.
