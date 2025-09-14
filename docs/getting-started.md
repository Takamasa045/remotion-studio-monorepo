# Getting Started

This guide helps you set up the Remotion Studio monorepo, create your first project, and use the shared packages.

## Prerequisites

- Node.js 18+ (recommended 20)
- pnpm 8+

## Install

1. Install dependencies in the monorepo directory:

   - `pnpm -C remotion-studio install`

2. (Optional) Link shared design assets into apps:

   - `pnpm -C remotion-studio sync:assets` (symlink) or `pnpm -C remotion-studio sync:assets --mode copy`

## Create your first app

You can start from the demo or generate a fresh project from the template.

### Option A: Run the demo

1. Install demo peer deps (already in demo package.json):

   - `pnpm -C remotion-studio -F @studio/demo-showcase install`

2. Start Remotion Studio:

   - `pnpm -C remotion-studio -F @studio/demo-showcase run dev`

3. Preview server (optional):

   - `pnpm -C remotion-studio -F @studio/demo-showcase run preview`

4. Render demo videos:

   - `pnpm -C remotion-studio -F @studio/demo-showcase run build`

### Option B: Create a new app

1. Generate from the template via CLI:

   - `pnpm -C remotion-studio create:project`

2. Follow prompts (name, width, height, FPS, duration).

3. Start developing:

   - `pnpm -C remotion-studio -F @studio/<your-app> run dev`

## Using packages

All shared packages are available under the `@studio/*` alias.

- Timing utilities:

  ```tsx
  import {useTimeline, useProgress, frameToMs} from '@studio/timing';

  const {fps} = useVideoConfig();
  const timeline = useTimeline({durationInFrames: 180, fps});
  useEffect(() => timeline.seekTo(frame), [frame]);
  ```

- Anime.js bridge + transitions:

  ```tsx
  import {useAnime, defineAnime} from '@studio/anime-bridge';
  import {FadeIn} from '@studio/transitions';

  const ref = useRef<HTMLDivElement>(null);
  useAnime(() => defineAnime({targets: ref.current!, opacity: [0,1], duration: 1000}), {frame, fps, durationInFrames: 30, ref});
  ```

- Canvas2D (Pixi/Konva):

  ```tsx
  import {usePixiScene} from '@studio/visual-canvas2d';
  const {canvasRef} = usePixiScene({frame, width, height, onFrame: (app) => {/* draw */}});
  ```

- Three.js (React Three Fiber):

  ```tsx
  import {ThreeCanvas, CameraPreset, DefaultLights, useRemotionFrame} from '@studio/visual-three';
  <ThreeCanvas frame={frame} fps={fps} width={1920} height={1080}>
    <CameraPreset />
    <DefaultLights />
    {/* R3F objects */}
  </ThreeCanvas>
  ```

- WebGL effects:

  ```tsx
  import {BlurEffect, GlitchEffect, GlowEffect} from '@studio/visual-effects';
  <BlurEffect width={w} height={h} frame={frame} fps={fps} strength={2} />
  ```

## Rendering all apps

- Render every composition from every app in parallel:

  - `pnpm -C remotion-studio render:all --parallel 4 --out out`

## Notes

- Some visuals require peer dependencies in your app (animejs, pixi.js, konva, three, @react-three/fiber).
- The demo app already declares these dependencies.
