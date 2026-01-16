[EN](./README.md) | [JA](./README.ja.md)

# Remotion Studio Monorepo

![Remotion Studio Monorepo](./docs/images/hero.jpg)

**Remotion + React** で動画プロジェクトを構築するための **テンプレート専用** モノレポです。`apps/_template` から新規アプリを作成し、独立して開発できます。

## クイックスタート

```bash
# クローン & インストール
git clone git@github.com:Takamasa045/remotion-studio-monorepo.git
cd remotion-studio-monorepo && pnpm install

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

- **Node.js** 20+ (推奨: 22)
- **pnpm** 10+
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

- **pnpm workspaces** によるモノレポ運用
- **pnpm Catalog による依存関係の一元管理**
- **2D・3D テンプレート** 搭載（`apps/_template`、`apps/3D-template`）
- **生産性スクリプト** (一括レンダリング、アセット同期、テンプレート置換)
- **オフライン参照** (`docs/remotion-reference.md`)
- **タイムライン/アニメ/2D/3D/WebGL のユーティリティ群**
- オプションで **CI/CD ワークフロー**

---

## 依存関係の管理（pnpm Catalog）

このモノレポでは **pnpm Catalog** を使用して、React、Remotion、TypeScript などの共通依存関係のバージョンを一元管理しています。

### 仕組み

1. **`pnpm-workspace.yaml` でバージョンを定義**:

   ```yaml
   catalog:
     react: ^18.3.1
     react-dom: ^18.3.1
     remotion: 4.0.406
     typescript: ^5.6.3
     # ... すべての @remotion/* パッケージ
   ```

2. **各 `package.json` で参照**:

   ```json
   {
     "dependencies": {
       "react": "catalog:",
       "react-dom": "catalog:",
       "remotion": "catalog:"
     }
   }
   ```

3. **一箇所でバージョンを更新**: `pnpm-workspace.yaml` の catalog を編集後、以下を実行:
   ```bash
   pnpm install
   ```

### メリット

- **単一の信頼できる情報源**: モノレポ全体で同じバージョンを使用
- **簡単な更新**: catalog で一度変更すれば、`pnpm install` で全体を更新
- **一貫性**: アプリ間でのバージョン不一致を防止
- **型安全性**: TypeScript と React のバージョンが常に整合

---

## 構成

```
remotion-studio-monorepo/
├── apps/
│   ├── _template/          # 基本テンプレート
│   └── 3D-template/        # Three.js テンプレート
├── packages/               # (任意の共有パッケージ)
├── scripts/                # CLIツール
└── docs/                   # ドキュメント
```

## ドキュメント

| ガイド                                          | 説明                        |
| ----------------------------------------------- | --------------------------- |
| [Structure](./docs/structure.ja.md)             | モノレポ構成                |
| [Adding Dependencies](./docs/adding-deps.ja.md) | パッケージ追加方法          |
| [Assets Guide](./docs/assets.ja.md)             | アセット管理                |
| [3D Notes](./docs/3d-notes.ja.md)               | Three.js / R3F セットアップ |
| [MCP Setup](./docs/mcp-setup.ja.md)             | Claude / Codex 連携         |
| [Upgrading](./docs/upgrading-remotion.ja.md)    | Remotion バージョン管理     |
| [Packages](./docs/packages.ja.md)               | 利用可能なパッケージ一覧    |
| [Troubleshooting](./docs/troubleshooting.ja.md) | よくある問題と解決方法      |

## トラブルシューティング

**コマンドが見つからない?** → `@remotion/cli` を追加: `pnpm -w add -D @remotion/cli`

**サブモジュールの問題?** → `git submodule update --init --recursive`

**詳細なヘルプ** → [docs/troubleshooting.ja.md](./docs/troubleshooting.ja.md) 参照

## ライセンス

MIT License — このリポジトリは **テンプレートのみ** 提供。Remotion は npm 経由で別途インストールします。

> **注:** これは **非公式** プロジェクトで、Remotion との提携はありません。
