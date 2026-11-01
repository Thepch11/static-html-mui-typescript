# Static HTML MUI TypeScript

A responsive static resource hub built with React, TypeScript, Material UI, and Vite.

Repository: [Thepch11/static-html-mui-typescript](https://github.com/Thepch11/static-html-mui-typescript).

## Architecture

```text
static-html-mui-typescript/      # Local checkout
├── index.html                  # Vite HTML entry
├── styles.css                  # Global accessibility and base styles
├── src/
│   ├── main.tsx                 # React mount and MUI providers
│   ├── App.tsx                  # Responsive resource hub
│   └── theme.ts                 # Shared MUI tokens
├── documents/                  # Public documents, copied unchanged
├── reports/                    # Public report data, copied unchanged
├── assets/                     # Public images and icons, copied unchanged
├── scripts/                    # Static copy and build verification
└── vite.config.ts              # Output names and relative URLs
```

`npm run build` generates the requested deployment architecture:

```text
dist/
├── index.html
├── bundle.js
├── styles.css
├── documents/
├── reports/
└── assets/
```

`bundle.js` is generated from TypeScript; edit `src/`, not the bundle. Additional generated chunks, if needed, go under `assets/`. MUI component styling uses Emotion at runtime; `styles.css` contains the global styles.

## Development

Requires Node.js 22.12+ and npm. Install locked dependencies with `npm ci`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local Vite development. |
| `npm run lint` | Check source and configuration with ESLint. |
| `npm run typecheck` | Run strict TypeScript checking. |
| `npm run build` | Type-check, build, copy public folders, verify the output contract. |
| `npm run preview` | Serve the production build locally. |
| `npm run check:build` | Recheck an existing build's structure and resource files. |

Use the URL printed by Vite. Resource cards open a Markdown file, sample JSON, and an SVG; Markdown is not rendered inside the app. Add content to the corresponding folders and update resource links in `src/App.tsx`.

## Static Deployment

Upload only the contents of `dist/` to the hosting root. Relative entry and resource URLs support the GitHub Pages repository subpath `/static-html-mui-typescript/`. The application uses section anchors and has no client-side router.

GitHub Pages settings, CI deployment, a custom 404 page, and remote publication are not configured. Before the first push, inspect the remote history. This build uses stable `bundle.js` and `styles.css` names as requested; configure hosting caches to revalidate those files on updates.

## Contributing

See [AGENTS.md](AGENTS.md) for conventions and [TODO.md](TODO.md) for outstanding work. Check mobile/desktop layouts, keyboard navigation, resource URLs, and console errors when changing the UI. All files in `documents/`, `reports/`, and `assets/` are public build inputs: exclude secrets and internal reference documents.

## Verification

Lint, strict type checking, production build, and artifact checks passed. Browser checks verified rendering at the repository subpath, a working report link, no horizontal overflow at 375px and 1440px, and keyboard focus on the skip link. No browser warnings/errors were captured during those checks. Full accessibility auditing and remote deployment remain pending.

The installation audit reported 12 moderate advisories in the development ESLint dependency chain (including transitive `minimatch`). No automatic major-version or forced audit fixes were applied. Review tooling updates before CI adoption.
