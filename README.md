# Ammaar Murshid — Portfolio

This repo contains my personal portfolio, now built with [Astro](https://astro.build/) for a fully static, componentised
architecture. The design mirrors the previous HTML/CSS version while making it easier to evolve content and projects.

## Getting started

```bash
bun install
bun run dev
```

The site will be available at `http://localhost:4321`. Astro supports hot module reloading so component and content changes are
reflected immediately.

## Project structure

```
└── src
    ├── components      # UI building blocks (hero, about, projects, contact, etc.)
    ├── content         # Markdown content collections (projects)
    ├── layouts         # Base layout with SEO metadata
    ├── pages           # Page routes (index.astro)
    ├── scripts         # Small progressive enhancements (theme toggle, nav interactions)
    └── styles          # Global stylesheet migrated from the static site
```

Project cards are sourced from the `src/content/projects` collection. Add a new Markdown file with the required frontmatter
(`title`, `description`, optional `url`, `repo`, `tech`, `featured`, `sortOrder`) and Markdown body to feature another project.

## Commands

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `bun run dev`     | Start a local development server |
| `bun run build`   | Build the static production site |
| `bun run preview` | Preview the built `dist` output  |
| `bun run format`  | Format files with Prettier       |

## Deployment

GitHub Pages deployment is automated via `.github/workflows/deploy.yml`. Pushes to `main` trigger a build with `bun run build`
and publish the generated `dist` directory to the `gh-pages` branch.

For Netlify or Vercel, set the build command to `bun run build` and the publish directory to `dist`.
