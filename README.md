# {{YOUR_NAME}} · Portfolio

A modern, performant, and accessible personal portfolio built with React, Vite, and Tailwind CSS. It automatically pulls public repositories from GitHub, supports custom featured projects, and deploys to GitHub Pages with CI/CD.

## ✨ Features

- React 18 + TypeScript with Vite for fast, modern builds
- Tailwind CSS + shadcn/ui primitives with 3 accent themes and dark/light/system mode
- Framer Motion animations (section reveals, hover tilt, page transitions)
- GitHub REST API integration with filtering, search, and optional case-study pages
- Markdown-driven hero/about copy and JSON-driven skills + featured projects
- Command palette (<kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd>) and “Now” activity widget
- Accessible, semantic layout with skip links and keyboard focus states
- Print-friendly `/resume` view and animated 404 page
- GitHub Actions workflow for building, testing, linting, and deploying to `gh-pages`

## 📁 Project structure

```
├── content/              # Editable markdown/JSON content
├── public/               # Static assets, resume placeholder, sitemap/robots output
├── scripts/              # Post-build scripts (sitemap/robots)
├── src/
│   ├── assets/           # Local fallback images
│   ├── components/       # UI + feature components (theme toggle, command palette, etc.)
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Data fetching + content utilities
│   ├── pages/            # Route-level components (home, case-study, resume, 404)
│   ├── providers/        # Theme context
│   ├── types/            # Shared TypeScript types
│   └── data/             # Bundled fallback data
```

## 🚀 Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Copy environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the values with your details (GitHub username, LinkedIn URL, optional analytics ID). If you maintain a private GitHub token for higher rate limits, you can add it under `VITE_GITHUB_TOKEN` (optional).

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to preview.

4. **Content updates**
- `content/hero.md` and `content/about.md` control hero/about copy.
- `content/skills.json` expects a JSON object keyed by category, e.g. `{ "Languages": ["TypeScript", "Python"] }`.
- `content/featured.json` can include overrides per project (`title`, `description`, `tags`, `image`, `repo`, `homepage`).
- Replace `public/resume/{{YOUR_GITHUB_USERNAME}}-resume.pdf` with your actual resume.

5. **Assets to upload locally**
   - **Avatar:** place a square headshot at `public/avatar.jpg`. The component falls back to a generated gradient if the file is missing.
   - **Open Graph cover:** add a `public/og-cover.png` (1200×630 recommended) for richer social previews.
   - You can drop any additional static assets (images, fonts, favicons) into `public/` and reference them directly.
   - Update `{{YOUR_LINKEDIN_PHOTO_URL}}` in `src/components/avatar.tsx` if you prefer sourcing the avatar from LinkedIn.

## 🧪 Quality checks

```bash
npm run lint      # ESLint + accessibility rules
npm run test      # Vitest unit tests
npm run typecheck # TypeScript project references
npm run build     # Production build + sitemap/robots generation
```

Husky hooks (pre-commit) run `lint-staged` to lint and format staged files automatically.

## 📦 Deployment

1. Ensure your repository has GitHub Pages enabled on the `gh-pages` branch.
2. Push to `main` — the GitHub Actions workflow in `.github/workflows/deploy.yml` will install dependencies, run lint/tests/typecheck, build the site, and deploy the contents of `dist/` to `gh-pages`.
3. Configure your repository settings so Pages serves from the `gh-pages` branch (root directory).

## 🔧 Configuration

- **Theme defaults**: Update `content/site.json` to change the default theme mode or accent.
- **Analytics**: Drop a GA4 or Plausible ID into `VITE_ANALYTICS_ID` and extend `src/utils/analytics.ts` (placeholder file) to send events.
- **Rate limiting**: For heavy traffic, consider adding a GitHub personal access token to `.env` (e.g., `VITE_GITHUB_TOKEN`) and forwarding it in `fetchGitHubRepos` headers.

## ♿ Accessibility & performance

- Semantic HTML structure with region landmarks and skip links
- Keyboard-friendly controls, visible focus states, and prefers-reduced-motion support
- Responsive images, code-splitting, and caching for fast Lighthouse scores (95+ target)

## 🤝 License

MIT — free to remix and adapt. Please attribute back if you use this as a starting point.
