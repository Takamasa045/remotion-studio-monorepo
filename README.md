[EN](./README.md) | [JA](./README.ja.md)

# Remotion Studio Monorepo

A template‑only repository for **Remotion + React**. Create new projects from `apps/_template`, then develop & render **inside each app**.

## Quick Start (3 commands)

```bash
# 1) Clone (with submodules, via SSH)
git clone --recurse-submodules git@github.com:Takamasa045/remotion-studio.git
cd remotion-studio

# 2) Optional: only _template + 3D-template in apps
pnpm run sparse:apps

# 3) Install dependencies
pnpm install
```

---

## Quick Start

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
# Later, to include demo as well:
#   (cd apps && git sparse-checkout set _template 3D-template demo-showcase)
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

## Requirements

* Node.js 18+ (20 recommended)
* pnpm 8+ (latest recommended)
* ffmpeg

### Setup

```bash
pnpm install
```

### Usage

* Create new app: `pnpm create:project` (interactive)
* Move into app: `cd apps/<name>`
* Preview: `pnpm dev`
* Preview built output: `pnpm preview`
* Render (mp4): `pnpm build`

---

## MCP Setup (optional)

### Claude Code

Add via terminal:

```bash
claude mcp add
# Name: remotion-documentation
# Command: npx
# Args: @remotion/mcp@latest
```

Manual settings (if not using GUI):

```json
{
  "mcpServers": {
    "remotion-documentation": {
      "command": "npx",
      "args": ["@remotion/mcp@latest"]
    }
  }
}
```

Usage example in chat: “Use **remotion-documentation** to look up the **render h264** flag.” (per remotion.dev guidance)

### Codex (OpenAI Codex CLI)

Append to `~/.codex/config.toml`:

```toml
[mcp_servers.remotion_documentation]
type = "stdio"
command = "npx"
args = ["@remotion/mcp@latest"]
```

---

## Creating a New Project (details)

```bash
pnpm create:project
```

**Example inputs**

* `name: my-app` → creates `apps/my-app` (pkg name `@studio/my-app`)
* `width / height / fps / duration`: numeric values

**After generation**

```bash
cd apps/my-app
pnpm dev
```

---

## Assets (CSS / Fonts / Images / Audio / Video)

Each app serves static files from `public/`. After `pnpm create:project`, subfolders are scaffolded with `.gitkeep`:

```
public/
  assets/
    images/  # PNG/JPG/SVG …
    audio/   # MP3/WAV/WEBM …
    video/   # MP4/WEBM …
    fonts/   # WOFF/TTF … (use @font-face + staticFile)
    css/     # Optional CSS (can be injected)
    data/    # JSON, etc.
    lottie/  # Lottie JSON
```

**Examples**

* Image: `/assets/images/logo.png`
* Audio: `/assets/audio/bgm.mp3`
* Video: `/assets/video/clip.mp4`
* CSS: Prefer `src/styles` imports (e.g. `import './styles/app.css'`). If placing under `public/assets/css`, fetch via `staticFile('/assets/css/app.css')` and inject into `<style>`.
* Fonts: Place under `public/assets/fonts` and define in CSS with `@font-face` (e.g. `src: url(staticFile('/assets/fonts/xxx.woff2'))`).

**Lyrics (LRC) convention**

* Put the `.lrc` file **next to** the audio file, e.g. `/assets/audio/song.mp3` → `/assets/audio/song.lrc`

```ts
const lrc = await fetch('/assets/audio/song.lrc').then(r => r.text());
// Parse into [{ timeMs, text }] as needed
```

**Version control**

* For large binaries (long videos/audio), consider **Git LFS**.
* Alternatively, fetch assets at runtime from external storage/CDN.

---

## Why These Libraries? (When / How)

**Typical use cases**

* **Animation**: `animejs` via `@studio/anime-bridge`, plus `@studio/transitions`, `@studio/easings`
* **2D / Canvas**: Pixi.js, Konva via `@studio/visual-canvas2d`
* **3D / R3F**: `three`, `@react-three/fiber`, `@react-three/drei`, `@remotion/three`
* **Validation**: `zod` (+ `@remotion/zod-types`)
* **Media utils**: `@remotion/media-utils`, etc.

**Dev / Preview / Render behavior**

* Remotion CLI (Webpack) bundles from `src/index.ts` (entry).
* Template avoids monorepo‑specific aliases; `remotion.config.ts` is minimal.
* During `pnpm install`, some packages build `dist` via `prepare`, while dev uses `src` for faster HMR.
* Assets under `public/` are resolved via `staticFile()`.

**Adding dependencies**

* **One app only**

  ```bash
  pnpm add <pkg> --filter @studio/<app>
  pnpm add -D @types/<pkg> --filter @studio/<app>
  ```
* **Multiple apps**

  * Add per app (template remains minimal).
* **Shared packages**

  * Not used by default. Create under `packages/` when needed and add to the workspace.

**PeerDependencies (important)**

* `@studio/visual-three` → install `three @react-three/fiber`
* `@studio/visual-canvas2d` → install `pixi.js konva`

**Browser context (pitfalls)**

* Composition code runs in the **browser**. Node‑only modules like `fs`, `path`, `net` are not available.
* Move such logic to Node scripts (`scripts/`), build‑time prep, or `remotion.config.ts`.
* Some libraries require CSS imports, e.g.:

  ```ts
  import 'your-lib/dist/styles.css'
  ```

**After adding deps (typical flow)**

```bash
pnpm install
# In target app
pnpm dev      # preview
pnpm preview  # preview built output
pnpm build    # render
```

If needed, customize Webpack via `Config.overrideWebpackConfig` in `remotion.config.ts`.

---

## 3D / R3F Notes

**Per‑app install**

```bash
pnpm add three @react-three/fiber @react-three/drei @remotion/three@^4.0.350
```

**Or from root (workspace filter)**

```bash
pnpm add three @react-three/fiber @react-three/drei @remotion/three@^4.0.350 --filter @studio/<app>
```

* Compatibility: Remotion `v4.0.350` ↔ `@remotion/three@^4.0.350`.
* WebGL stability: in `remotion.config.ts`, you may set `Config.setChromiumOpenGlRenderer('angle')`.
* Asset loading: place models/textures in `public/`, pass URLs from `staticFile('/assets/...)` to loaders like `useGLTF()`.

---

## Who Is This For?

This monorepo is **not** a kitchen‑sink. Compose only what you need and add `peerDependencies` per use case.

* **Simple videos** → use `apps/_template` (minimal)
* **Fades & easings** → `@studio/transitions`, `@studio/easings`
* **Nuanced motion** → `pnpm add animejs --filter @studio/<app>` + `@studio/anime-bridge`
* **2D (Pixi/Konva)** → `pnpm add pixi.js konva --filter @studio/<app>` + `@studio/visual-canvas2d`
* **3D (Three.js + R3F)** → install `three @react-three/fiber @react-three/drei @remotion/three@^4.0.350`
* **Audio & LRC lyrics** → `@studio/timing`, `@studio/core-hooks` (place `.lrc` under `assets/audio/`)

---

## Template Placeholders

* `__PACKAGE__` → `@studio/<slug>`
* `__APP_NAME__` → `<slug>`

Optional: run `pnpm templateize` to parameterize the template itself.

---

## Package List (highlights)

**Foundation**

* `@studio/timing`: timeline / progress / frame conversions
* `@studio/core-hooks`: `useAnimationFrame`, `useMediaTiming`
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
