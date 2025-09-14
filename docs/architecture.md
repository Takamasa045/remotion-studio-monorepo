# Architecture

This monorepo hosts a Remotion-based video studio composed of apps, shared packages, and tooling.

## Monorepo Layout

- `apps/`
  - Application projects (e.g., `demo-showcase`, app template `_template`).
- `packages/`
  - Shared libraries grouped by domain:
    - Core: `core-types`, `core-timing`, `core-hooks`
    - Animation: `animation-anime-bridge`, `animation-transitions`, `animation-easings`
    - Visual: `visual-canvas2d`, `visual-three`, `visual-effects`
    - Aliases: `anime-bridge`, `transitions`, `timing`
    - Assets: `@design/assets`
- `scripts/`
  - Dev CLI: project scaffolding, bulk render, assets sync.
- `docs/`
  - Documentation.

## Responsibilities

- `@studio/core-types`: Shared type definitions used across packages (timeline, composition, scene, etc.).
- `@studio/timing`: Timeline state, progress computation, frame-time conversions, React hooks.
- `@studio/core-hooks`: Common hooks such as `useAnimationFrame`, `useMediaTiming`.
- `@studio/anime-bridge`: Anime.js bridge mapped to Remotion frames + React hook.
- `@studio/transitions`: Reusable transition components implemented with Anime.js.
- `@studio/easings`: Easing utilities and cubicBezier helper.
- `@studio/visual-canvas2d`: Pixi.js / Konva integration hooks.
- `@studio/visual-three`: React Three Fiber wrapper and presets.
- `@studio/visual-effects`: WebGL shader-based visual effects as components.
- `@studio/anime-bridge`, `@studio/transitions`, `@studio/timing`: Thin alias packages for cleaner imports.
- `@design/assets`: Shared public assets to link/copy into app `public/` folders.

## Dependency Graph

```mermaid
graph TD
  subgraph Core
    CT[@studio/core-types]
  CTime[@studio/timing]
    CHooks[@studio/core-hooks]
  end

  subgraph Animation
    ABridge[@studio/anime-bridge]
    ATrans[@studio/transitions]
    AEase[@studio/easings]
  end

  subgraph Visual
    V2D[@studio/visual-canvas2d]
    V3D[@studio/visual-three]
    VFX[@studio/visual-effects]
  end

  Apps[apps/*]

  CTime --> CT
  CHooks --> CT
  ABridge --> CT
  ATrans --> ABridge
  ATrans --> AEase
  V2D --> CT
  V3D --> CT
  VFX --> CT

  Apps --> CTime
  Apps --> CHooks
  Apps --> ABridge
  Apps --> ATrans
  Apps --> AEase
  Apps --> V2D
  Apps --> V3D
  Apps --> VFX

  subgraph Aliases
    ATiming[@studio/timing]
    ATransAlias[@studio/transitions]
    ABridgeAlias[@studio/anime-bridge]
  end

  ATiming --> CTime
  ATransAlias --> ATrans
  ABridgeAlias --> ABridge
```

## Build & Render Flow

- Type-check/build packages with `pnpm -r build`.
- Apps import packages via `@studio/*` aliases (Webpack alias resolves to `packages/*/src`).
- Rendering uses Remotion CLI; `scripts/render-all.ts` orchestrates multi-app, multi-composition renders in parallel.
