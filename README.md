[EN](./README.md) | [JA](./README.ja.md)

# Remotion Studio Monorepo

![Remotion Studio Monorepo](./docs/images/hero.jpg)

A **template-only** monorepo for building video projects with **Remotion + React**. Create new apps from `apps/_template` and develop independently.

## Quick Start

```bash
# Clone & install
git clone --recurse-submodules git@github.com:Takamasa045/remotion-studio.git
cd remotion-studio && pnpm install

# Create new project
pnpm create:project

# Start development
cd apps/<name> && pnpm dev
```

**3D Template:**
```bash
pnpm create:project -- -t 3d
```

## Prerequisites

- **Node.js** 18+ (recommended: 20)
- **pnpm** 8+
- **ffmpeg** (for rendering)

<details>
<summary>Installation guides</summary>

```bash
# Check versions
node -v && pnpm -v && ffmpeg -version

# Install ffmpeg
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: apt/yum install ffmpeg
```
</details>

## Features

- **Monorepo** powered by pnpm workspaces
- **Centralized dependency management** via **pnpm Catalog**
- **Templates** for 2D & 3D projects (`apps/_template`, `apps/3D-template`)
- **Productivity scripts** (batch rendering, asset sync, template replacement)
- **Offline reference** (`docs/remotion-reference.md`)
- **Timeline utilities** (`@studio/timing`), **Anime.js bridge**, transitions, R3F, Pixi/Konva, WebGL effects
- Optional **CI/CD workflows**

---

## Dependency Management (pnpm Catalog)

This monorepo uses **pnpm Catalog** to centrally manage versions of React, Remotion, TypeScript, and other common dependencies.

### How it works

1. **Version definitions** in `pnpm-workspace.yaml`:
   ```yaml
   catalog:
     react: ^18.3.1
     react-dom: ^18.3.1
     remotion: 4.0.351
     typescript: ^5.6.3
     # ... all @remotion/* packages
   ```

2. **Reference in `package.json`**:
   ```json
   {
     "dependencies": {
       "react": "catalog:",
       "react-dom": "catalog:",
       "remotion": "catalog:"
     }
   }
   ```

3. **Update versions in one place**: Edit `pnpm-workspace.yaml` catalog, then run:
   ```bash
   pnpm install
   ```

### Benefits

* **Single source of truth**: All packages use the same version across the monorepo
* **Easy updates**: Change version once in catalog, update everywhere with `pnpm install`
* **Consistency**: Prevents version mismatches between apps
* **Type safety**: TypeScript and React versions stay aligned

---

## Structure

```
remotion-studio/
├── apps/
│   ├── _template/          # Base template
│   └── 3D-template/        # Three.js template
├── packages/               # (Optional shared packages)
├── scripts/                # CLI tools
└── docs/                   # Documentation
```

## Documentation

| Guide | Description |
|-------|-------------|
| [Structure](./docs/structure.md) | Monorepo architecture |
| [Adding Dependencies](./docs/adding-deps.md) | How to add packages |
| [Assets Guide](./docs/assets.md) | Managing assets |
| [3D Notes](./docs/3d-notes.md) | Three.js / R3F setup |
| [MCP Setup](./docs/mcp-setup.md) | Claude / Codex integration |
| [Upgrading](./docs/upgrading-remotion.md) | Remotion version management |
| [Packages](./docs/packages.md) | Available packages & libraries |
| [Troubleshooting](./docs/troubleshooting.md) | Common issues & solutions |

## Troubleshooting

**Command not found?** → Add `@remotion/cli`: `pnpm -w add -D @remotion/cli`

**Submodule issues?** → `git submodule update --init --recursive`

**More help** → See [docs/troubleshooting.md](./docs/troubleshooting.md)

## License

MIT License — This repo provides **templates only**. Remotion is installed separately via npm.

> **Note:** This is an **unofficial** project, not affiliated with Remotion.
