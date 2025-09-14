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

## Customization

- The default composition lives in `src/Root.tsx` with placeholders for width/height/FPS/duration
- Update dependencies in `package.json` as needed
- Add public assets under `public/`

