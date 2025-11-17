[EN](./README.md) | [JA](./README.ja.md)

# Remotion Studio Monorepo

![Remotion Studio Monorepo](./docs/images/hero.jpg)

**Remotion + React** で動画プロジェクトを構築するための **テンプレート専用** モノレポです。`apps/_template` から新規アプリを作成し、独立して開発できます。

## クイックスタート

```bash
# クローン & インストール
git clone --recurse-submodules git@github.com:Takamasa045/remotion-studio.git
cd remotion-studio && pnpm install

# 新規プロジェクト作成
pnpm create:project

# 開発開始
cd apps/<name> && pnpm dev
```

**3Dテンプレート:**
```bash
pnpm create:project -- -t 3d
```

## 前提条件

- **Node.js** 18+ (推奨: 20)
- **pnpm** 8+
- **ffmpeg** (レンダリングに必要)

<details>
<summary>インストールガイド</summary>

```bash
# バージョン確認
node -v && pnpm -v && ffmpeg -version

# ffmpeg インストール
# macOS: brew install ffmpeg
# Windows: choco install ffmpeg
# Linux: apt/yum install ffmpeg
```
</details>

## 特徴

- **pnpm workspaces** によるモノレポ
- **2D・3D テンプレート** 搭載
- **生産性スクリプト** (一括レンダリング、アセット同期)
- **オフライン参照** (`docs/remotion-reference.md`)
- オプションで **CI/CD ワークフロー**

## 構成

```
remotion-studio/
├── apps/
│   ├── _template/          # 基本テンプレート
│   └── 3D-template/        # Three.js テンプレート
├── packages/               # (任意の共有パッケージ)
├── scripts/                # CLIツール
└── docs/                   # ドキュメント
```

## ドキュメント

| ガイド | 説明 |
|-------|-------------|
| [Structure](./docs/structure.ja.md) | モノレポ構成 |
| [Adding Dependencies](./docs/adding-deps.ja.md) | パッケージ追加方法 |
| [Assets Guide](./docs/assets.ja.md) | アセット管理 |
| [3D Notes](./docs/3d-notes.ja.md) | Three.js / R3F セットアップ |
| [MCP Setup](./docs/mcp-setup.ja.md) | Claude / Codex 連携 |
| [Upgrading](./docs/upgrading-remotion.ja.md) | Remotion バージョン管理 |
| [Packages](./docs/packages.ja.md) | 利用可能なパッケージ一覧 |
| [Troubleshooting](./docs/troubleshooting.ja.md) | よくある問題と解決方法 |

## トラブルシューティング

**コマンドが見つからない?** → `@remotion/cli` を追加: `pnpm -w add -D @remotion/cli`

**サブモジュールの問題?** → `git submodule update --init --recursive`

**詳細なヘルプ** → [docs/troubleshooting.ja.md](./docs/troubleshooting.ja.md) 参照

## ライセンス

MIT License — このリポジトリは **テンプレートのみ** 提供。Remotion は npm 経由で別途インストールします。

> **注:** これは **非公式** プロジェクトで、Remotion との提携はありません。
