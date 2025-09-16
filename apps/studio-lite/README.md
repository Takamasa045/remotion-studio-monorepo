# Studio Lite

A minimal Remotion project that lives inside the monorepo but keeps dependencies and configuration to the bare essentials. Use this when you want to prototype quickly without pulling in every toolkit package.

## Commands
- `pnpm dev studio-lite` – Start the Remotion Studio preview
- `pnpm preview studio-lite` – Render a local preview as a website
- `pnpm build:app studio-lite` – Export an MP4 via the shared helper script

You can copy this folder out of the monorepo if you prefer a completely standalone project. Only `react`, `react-dom`, `remotion` and `@remotion/cli` are required.
