# Repository Guidelines

## Project Structure & Module Organization

The application uses React, TypeScript, MUI, and Vite. `src/main.tsx` mounts React and MUI providers, `src/App.tsx` contains the responsive resource hub, and `src/theme.ts` defines shared tokens. `index.html` is the entry point; `styles.css` contains global styles.

Root `documents/`, `reports/`, and `assets/` contain public files copied unchanged by `scripts/copy-static.mjs`. Reference Markdown files at the repository root are development documentation and are not copied. `dist/` is generated and ignored: it contains `index.html`, `bundle.js`, `styles.css`, and the three public folders.

## Build, Test, and Development Commands

Use Node.js 22.12+ and npm:

- `npm ci`: install locked dependencies.
- `npm run dev`: start local development.
- `npm run lint`: run ESLint.
- `npm run typecheck`: check strict TypeScript types.
- `npm run build`: type-check, build, copy static content, and verify output.
- `npm run preview`: preview the production build.
- `npm run check:build`: verify an existing build's structure and resource URLs.

## Coding Style & Naming Conventions

Use two-space indentation, single quotes, and semicolons in TypeScript. Use PascalCase for React components and camelCase for variables and functions. Prefer function components, typed data, MUI components, shared theme tokens, and responsive `sx` styles. Keep global CSS focused on base styles and accessibility. Follow the ESLint configuration; no formatter is configured.

## Testing Guidelines

The build verifier checks artifact names, required directories, sample resources, JSON validity, and relative entry URLs. No unit/browser framework or coverage threshold is configured. Run lint and build for code changes. Check mobile and desktop layouts, keyboard navigation, resource links, and console errors for UI changes. Report unavailable verification honestly.

## Commit & Pull Request Guidelines

Git uses `main` and `origin` at `https://github.com/Thepch11/static-html-mui-typescript.git`. Inspect remote history before the first push. Use concise imperative subjects, for example `feat: add static resource hub`.

Explain purpose, affected behavior, verification, and relevant issues in pull requests. Include screenshots for UI changes. Never commit credentials or private content to public resource folders.
