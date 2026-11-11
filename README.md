# Get Lyrics

A modern, animated song and lyrics finder built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS v4**. Search millions of tracks by song title or artist, listen to 30-second audio previews, and read formatted lyrics in a distraction-free modal.

**Live URL:** [https://code.wapborhan.com/get-lyrics](https://code.wapborhan.com/get-lyrics)

---

## Features

- **Instant Track Search** — Queries the [Lyrics.ovh](https://lyrics.ovh) Suggest API with `AbortController` cancellation for fast, clean searches.
- **Full Lyrics Reader Modal** — Click any track card to fetch and view full lyrics with smooth modal animations, `Escape` / backdrop dismissal, and one-click **Copy Lyrics**.
- **30-Second Audio Previews** — Play or pause track previews directly from result cards or inside the lyrics modal, with automatic single-track playback management.
- **Quick-Try Picks & Empty/Error States** — Includes one-click suggestion pills, navbar quick picks, animated loading skeletons, retryable error banners, and a Google Lyrics fallback link when Lyrics.ovh does not have a track.
- **Modern Animated Tailwind UI** — Glassmorphic cards, floating neon ambient gradients, custom CSS keyframe animations, and a responsive mobile navigation drawer.

---

## Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/vite`)
- **Linting:** ESLint + `typescript-eslint` + React Hooks & React Refresh plugins
- **API:** [Lyrics.ovh API](https://lyricsovh.docs.apiary.io/)

---

## Project Structure

```text
get-lyrics/
├── .github/workflows/
│   └── deploy.yml        # GitHub Actions workflow to build & deploy to GitHub Pages
├── public/
│   └── favicon.svg
├── src/
│   ├── App.tsx           # Main search experience, hero, loading skeletons, & state
│   ├── Header.tsx        # Sticky glassmorphic navbar with responsive mobile drawer
│   ├── Lyrics.tsx        # Track results grid, audio preview player, & lyrics modal
│   ├── Footer.tsx        # Glassmorphic footer
│   ├── types.ts          # TypeScript interfaces for track & lyrics API responses
│   ├── index.css         # Tailwind v4 import & custom keyframe animations
│   └── main.tsx          # React root entry point
├── index.html
├── package.json
├── tsconfig.app.json
└── vite.config.ts        # Vite config with /get-lyrics/ production base path
```

---

## Getting Started

### Prerequisites

- **Node.js** `20+` (CI uses Node `22`)
- **Yarn** (recommended, lockfile included) or **npm**

### Installation

```bash
yarn install
```

### Development

Starts the Vite development server at `http://localhost:5173/`:

```bash
yarn dev
```

### Production Build & Lint

Type-checks with `tsc -b`, builds the production bundle into `dist/` (configured with `base: "/get-lyrics/"`), and runs ESLint:

```bash
yarn build
yarn lint
```

Preview the production build locally:

```bash
yarn preview
```

---

## Deployment (GitHub Pages)

This repository deploys automatically to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Every push to `main` (or manual `workflow_dispatch`) installs dependencies with `yarn install --frozen-lockfile` and runs `yarn build`.
2. The generated `./dist` directory is uploaded and published with `actions/deploy-pages`.
3. [`vite.config.ts`](vite.config.ts) sets `base: '/get-lyrics/'` for production builds so assets resolve properly under `https://code.wapborhan.com/get-lyrics/`.

In your GitHub repository settings, make sure **Settings → Pages → Build and deployment → Source** is set to **GitHub Actions**.

---

## Credits

- **Developed by:** [Borhan Uddin](https://www.wapborhan.com)
- **Lyrics & Track Data:** [Lyrics.ovh](https://lyrics.ovh)
