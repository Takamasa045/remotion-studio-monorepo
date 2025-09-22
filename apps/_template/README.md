# Remotion App Template

This is a minimal Remotion project template.

## How to use

1. Generate a new project using the root CLI:

   - From repository root: `pnpm create:project`
   - Follow the prompts (project name, resolution, FPS, duration)

2. Start developing:

   - `pnpm -C ../../apps/<your-project> run dev` to open Remotion Studio
   - `pnpm -C ../../apps/<your-project> run preview` for preview server
   - `pnpm -C ../../apps/<your-project> run build` to render the default composition

3. Assets

   - `public/` is the static root. The generator creates common subfolders:

   ```
   public/
     assets/
       images/   # PNG/JPG/SVG etc.
       audio/    # MP3/WAV/WEBM etc.
       video/    # MP4/WEBM etc.
       fonts/    # WOFF/TTF etc. (reference via @font-face and staticFile)
       css/      # Standalone CSS files (can fetch via staticFile if needed)
       data/     # JSON or other data blobs
       lottie/   # Lottie JSON animations
   ```

   - Prefer importing CSS from `src` (e.g. `src/styles/`) so it is bundled automatically.
   - Use `staticFile('/assets/...')` to reference files in `public/assets` at runtime.
   - Lyrics (LRC) placement (example):
     - Put `.lrc` next to the audio file with the same basename: `/assets/audio/song.mp3` ↔ `/assets/audio/song.lrc`

## Customization

- The default composition lives in `src/Root.tsx` with placeholders for width/height/FPS/duration.
- Update dependencies in `package.json` as needed.
- Add public assets under `public/` or import CSS from `src/styles/`.

## Optional modules

This template only depends on React + Remotion. Add extra toolkits when you need them:

- ✨ Easings / transitions: Install a library of your choice or author your own helpers.
- 🌀 Tweens: `pnpm add animejs` and wrap it with a hook/component as needed.
- 🎨 2D: `pnpm add pixi.js konva`
- 🏔 3D: `pnpm add three @react-three/fiber`

Refer to the root README for a checklist of recommended libraries and patterns.
