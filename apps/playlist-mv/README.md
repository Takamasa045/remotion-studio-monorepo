# Remotion App Template

This is a minimal Remotion project template.

## How to use

1. Generate a new project using the workspace CLI:

   - From monorepo root: `pnpm tsx scripts/create-project.ts`
   - Follow the prompts (project name, resolution, FPS, duration)

2. Start developing:

   - `pnpm -F @studio/<your-project> run dev` to open Remotion Studio
   - `pnpm -F @studio/<your-project> run preview` for preview server
   - `pnpm -F @studio/<your-project> run build` to render the default composition

3. Assets (images / audio / video)

   - Each app exposes `public/` as static root. Create subfolders for assets as needed:

   ```bash
   mkdir -p public/assets/{images,audio,video}
   ```

   - Examples to reference in code:
     - Image: `/assets/images/logo.png`
     - Audio: `/assets/audio/bgm.mp3`
     - Video: `/assets/video/clip.mp4`

   - Lyrics (LRC) placement (recommended):
     - Put `.lrc` next to the audio file with the same basename.
     - Example: `/assets/audio/song.mp3` ↔ `/assets/audio/song.lrc`
     - Fetch example:
       ```ts
       const text = await fetch('/assets/audio/song.lrc').then(r => r.text());
       ```

   - To reuse shared design assets, link/copy from the monorepo package `@design/assets/assets`:
     - Symlink: `pnpm -C ../../ sync:assets`
     - Copy: `pnpm -C ../../ sync:assets --mode copy`

## Customization

- The default composition lives in `src/Root.tsx` with placeholders for width/height/FPS/duration
- Update dependencies in `package.json` as needed
- Add public assets under `public/`
## Optional modules

This template only depends on React + Remotion. Add extra toolkits when you need them:

- 🎞 Minimal video work: Nothing else to install.
- ✨ Basic fades / easings: Import `@studio/transitions` / `@studio/easings` (already available in the monorepo).
- 🌀 Detailed tweens: `pnpm add animejs --filter @studio/<your-app>` then use `@studio/anime-bridge`.
- 🎨 2D Pixi / Konva scenes: `pnpm add pixi.js konva --filter @studio/<your-app>` then import `@studio/visual-canvas2d`.
- 🏔 Three.js + R3F: `pnpm add three @react-three/fiber --filter @studio/<your-app>` then import `@studio/visual-three`.
- 🎵 Audio / lyrics sync: Use `@studio/timing` + `@studio/core-hooks` (no extra install). Place `.lrc` files in `public/assets/audio`.

Refer to the root README for a fuller matrix of recommended modules.

