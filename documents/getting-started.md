# Getting Started

This application uses React, TypeScript, MUI, and Vite.

- Run `npm ci` to install dependencies from the lockfile.
- Run `npm run dev` to start local development.
- Run `npm run lint` and `npm run typecheck` before building.
- Run `npm run build` to produce and verify `dist/`.
- Run `npm run preview` to inspect the production build.

## Content folders

Place public documents in `documents/`, report data in `reports/`, and images or icons in `assets/`. The build copies these folders into `dist/` unchanged. Never store credentials or private material here.

Only publish the contents of `dist/`. React source lives in `src/`; do not manually edit the generated `bundle.js`.

Markdown is served as a file; an in-app Markdown renderer is not included.
