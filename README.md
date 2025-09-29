[EN](./README.md) | [JA](./README.ja.md)

# Remotion Studio Monorepo

A template‑only repository for **Remotion + React**. Create new projects from `apps/_template`, then develop & render **inside each app**.

## Shortest Guide

Run the minimal commands to scaffold and start an app (assumes prerequisites are installed, SSH is set up).

```bash
# 1) Clone (with submodules, via SSH)
git clone --recurse-submodules git@github.com:Takamasa045/remotion-studio.git
cd remotion-studio

# 2) Install dependencies
pnpm install

# 3) Scaffold a new app from template
pnpm create:project

# 4) Start the app (example)
cd apps/<name>
pnpm dev
```

Start with the 3D template (non‑interactive):

```
pnpm create:project -- -t 3d
```

(Interactively, answer “y” to “Use 3D template?”)

Develop outside the template repo (recommended to avoid impacting it):

```
pnpm create:project -- <name> --dest ../my-app
cd ../my-app
git init && git remote add origin <your-repo> && pnpm install
pnpm dev
```

---

## Full Setup

For first-time setup and team-wide onboarding. Includes prerequisites, submodules and optional sparse-checkout.

> This repository uses **Git submodules** (`apps`). **Be sure to fetch submodules** when cloning.

### Prerequisites

* **Node.js 18+** (recommended: 20) — consider using **nvm**
* **pnpm 8+**
* **ffmpeg** (required for rendering)

Check versions:

```bash
node -v
pnpm -v
ffmpeg -version
```

### Clone (submodules included)

**SSH (recommended, submodule URLs are SSH):**

```bash
git clone --recurse-submodules git@github.com:Takamasa045/remotion-studio.git
```

**HTTPS:**

```bash
git clone https://github.com/Takamasa045/remotion-studio.git
cd remotion-studio
# Initialize & fetch submodules if you didn’t use --recurse-submodules
git submodule update --init --recursive
```

### Install

```bash
cd remotion-studio
# If pnpm is not installed:
# corepack enable && corepack prepare pnpm@latest --activate
# or: npm i -g pnpm
# (Optional) Switch Node:
# nvm install 20 && nvm use 20
pnpm install
```

### Create a New Project (from template)

```bash
cd <repo-root>
pnpm create:project
# Answer prompts: name / width / height / fps / duration / compositionId
cd apps/<name>
pnpm dev
```

---

## Notes

* Install `ffmpeg` if missing:

  * macOS: `brew install ffmpeg`
  * Windows: `choco install ffmpeg`
  * Linux: use your distro’s package manager
* Check submodule status: `git submodule status`.

  * If you cloned via HTTPS and hit permission errors, either set up SSH **or** change `.gitmodules` URLs to HTTPS and run `git submodule sync --recursive`.
* **Public repo contents (examples)**: `_template`, `3D-template`.

Optional: sparse-checkout the apps submodule (only `_template` and `3D-template`)

```bash
pnpm run sparse:apps
# Later, to include more apps (example):
#   (cd apps && git sparse-checkout set _template 3D-template <app-name>)
```

## Features

* Monorepo powered by **pnpm workspaces**
* **Templates** `apps/_template`, `apps/3D-template`
* **Offline reference**: `docs/remotion-reference.md`
* **Timeline utilities** (`@studio/timing`), **Anime.js bridge**, transitions, R3F, Pixi/Konva, WebGL effects
* Productivity scripts (dev/preview/build runners, **batch rendering**, **asset sync**, **template replacement**)
* Optional CI (lint / build / automatic demo rendering)

---

## Structure (Standard Blueprint)

```
remotion-studio/
  apps/
    _template/        # Template skeleton used by pnpm create:project
    3D-template/      # 3D template
  packages/
    @core/            # Shared timing/hooks/types (optional)
    @animation/       # Anime bridge / transitions / easings (optional)
    @visual/          # Canvas2D/Three/shaders/effects (optional)
    @audio/           # Audio layer (optional)
    @content/         # Content layer (optional)
    @design/          # Assets/tokens/themes (optional)
  scripts/            # CLI scripts (create-project, runners, etc.)
  docs/               # References & ops notes
```

> This repo ships **minimal template** parts: `apps/_template` plus minimal `scripts/` and `docs/`. Add others as needed.

---

## More Docs

- Structure (Blueprint): `docs/structure.md`
- Adding dependencies: `docs/adding-deps.md`
- Assets guide: `docs/assets.md`
- 3D / R3F notes: `docs/3d-notes.md`
- MCP setup (Claude / Codex): `docs/mcp-setup.md`
* `@studio/core-types`: shared types

**Animation**

* `@studio/anime-bridge`: Anime.js bridge + `useAnime`
* `@studio/transitions`: `FadeIn` / `FadeOut` / `CrossFade` / `SlideIn` / `Wipe`
* `@studio/easings`: `cubicBezier` + common easings (Anime conversions)

**Visual**

* `@studio/visual-canvas2d`: Pixi/Konva integration
* `@studio/visual-three`: R3F wrappers, camera/light presets
* `@studio/visual-shaders`: `ShaderCanvas` (WebGL)
* `@studio/visual-effects`: glitch / blur / glow (shader‑based)

**Design**

* `@design/assets`: shared assets (sync via `pnpm sync:assets`)

> Some are `peerDependencies` (`react`, `three`, `@react-three/fiber`, `animejs`, `pixi.js`, `konva`, etc.). Install them in the apps that need them.

---

## Remotion Settings (Template)

No settings required. The template works out of the box with minimal `remotion.config.ts`. Edit only if necessary (e.g., aliases).

---

## Conventions (Entry / Root / Naming)

* **Entry**: `src/index.ts` (or `.tsx`) per app → must call `registerRoot(Root)`
* **Root file**: `src/Root.tsx` declares `<Composition />` (do **not** call `registerRoot` here)
* **CLI**: `remotion studio` / `remotion render` auto‑detect entry → omit `--entry-point`
* **Naming**: Use `Root.tsx` (PascalCase) for the root component
* Optional strictness: `Config.setEntryPoint('src/index.ts')` in `remotion.config.ts`

---

## TypeScript Settings

Defaults are minimal. Add path aliases only if needed.

---

## CI (optional)

Not configured by default. Add GitHub Actions if desired, e.g.:

* `.github/workflows/ci.yml` (install → build → Prettier check)
* `.github/workflows/render-demo.yml` (setup ffmpeg → auto‑render → upload artifacts)

---

## Troubleshooting

**`remotion` command not found**

```bash
pnpm -F @studio/<app> add -D @remotion/cli
# or workspace‑wide:
pnpm -w add -D @remotion/cli
```

**Submodules**

```bash
git submodule update --init --recursive          # init/fetch
git submodule update --remote --merge            # update to latest
# If HTTPS clone causes permission issues, switch .gitmodules to HTTPS and sync:
git config -f .gitmodules submodule.apps.url \
  https://github.com/Takamasa045/remotion-studio-apps.git
git submodule sync --recursive
git submodule update --init --recursive
```

**`fatal: not a git repository`** → ensure you run commands at the repo root.

**`import.meta` warnings** → `remotion.config.ts` resolves with `process.cwd()`. Replace older configs if needed.

**`tsconfig` “must have at most one *”** → Ensure each paths entry has at most one `*`.

**Entry point not found** → Each app must have `src/index.ts` as the Remotion v4 entry; template/demo already include it.

**`ffmpeg` not found**

```bash
# macOS
brew install ffmpeg
# Windows
choco install ffmpeg
# Linux
ffmpeg -version  # ensure installed via apt/yum/etc.
```

**Node version issues**

```bash
nvm install 20 && nvm use 20
node -v
```

**Port conflict (`EADDRINUSE`)**

```bash
# Example (macOS): check port 3000
lsof -i :3000
```

---

## Purpose of `scripts/` and `docs/`

### `scripts/` (CLI)

* `create-project.ts` — duplicates `apps/_template` → `apps/<name>`; prompts **Width/Height/FPS/Duration/Composition ID**

  * Run from root: `pnpm create:project`
* Examples (optional to add): `dev.ts` / `preview.ts` / `build-app.ts` / `render-all.ts` / `sync-assets.ts`

### `docs/` (Documentation)

* `remotion-reference.md`: highlights of Remotion APIs & troubleshooting
* Team ops notes: naming rules, path strategy, asset policy, review criteria
* Library setup steps, build/distribution flow
* Tip: Link from `docs/` to each generated app’s README for onboarding

---

## License

**MIT License** — see `LICENSE` at the repository root.

> This repository provides **templates and scripts only** and **does not redistribute Remotion**.
> Install Remotion via npm (e.g., `pnpm i remotion @remotion/cli`).
> This project is **unofficial** and **not affiliated with or endorsed by Remotion**. For Remotion’s license & terms, see the official docs.
