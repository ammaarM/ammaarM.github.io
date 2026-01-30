# Agent Guidelines

## Stack

- **Framework**: Astro 4.x with React integration
- **Language**: TypeScript (strict mode) + JavaScript
- **Package Manager**: npm
- **Styling**: CSS (global + scoped)
- **Content**: Markdown (content collections)

## Before you commit

```bash
# Typecheck
npx tsc --noEmit

# Format
npm run format

# Build check
npm run build
```

No linting or test suite currently configured.

## Coding rules

### Logic reuse

- If logic appears twice, extract it to `src/data/` (static data), `src/scripts/` (client utilities), or a shared component.
- Prefer small, focused functions over large monoliths.
- Keep client scripts in `src/scripts/`, shared data in `src/data/`, content schemas in `src/content/config.ts`.

### Minimal changes

- Change only what's needed for the feature or fix.
- Don't refactor unrelated code in the same commit.
- Keep components single-purpose; split if doing too much.

### Documentation

- Write self-explanatory code with clear naming.
- Add comments only for non-obvious decisions or complex logic.
- Update README only if user-facing behaviour or setup changes.

### Tests

- No test suite exists yet. If adding one, use Vitest or similar.
- Don't add tests for unchanged behaviour.

### Types

- Avoid `any`; prefer `unknown` and narrow with guards if needed.
- Use type inference where possible; add explicit types for public APIs.
- No unnecessary type assertions (`as`); fix the root type issue instead.
- Define types in the same file or co-locate in `src/` when shared.

## When adding features / files

### New shared logic

- **Static data** (profile, config, constants) → `src/data/*.ts`
- **Client utilities** (DOM helpers, formatters) → `src/scripts/*.js|ts`
- **Astro components** → `src/components/*.astro`
- **React components** (if interactive) → `src/components/*.tsx`
- **Content schemas** → `src/content/config.ts`
- **Layouts** → `src/layouts/*.astro`

### File naming

- Use kebab-case for files: `project-card.astro`, `profile.ts`, `site.js`.
- Use PascalCase for component files: `ProjectCard.astro`, `Hero.astro`.
- Match existing patterns in each folder.

### Exports

- Use named exports for data: `export const profile = { ... }`.
- Default export for Astro components (implicit).
- Export types when shared: `export type Profile = typeof profile`.

## PR checklist

- [ ] TypeScript compiles with no errors (`npx tsc --noEmit`)
- [ ] Code formatted (`npm run format`)
- [ ] Build succeeds (`npm run build`)
- [ ] No duplicated logic; extracted to appropriate location
- [ ] File and folder names follow existing conventions
- [ ] Types added for new functions/data; no `any` without justification
- [ ] Changes scoped to the feature/fix; no unrelated refactoring
- [ ] Self-explanatory code; comments added only where necessary
- [ ] Content/assets added to correct directories
- [ ] Verified locally in dev mode (`npm run dev`)
