# Remotion Studio Monorepo

Remotion + React で動画制作を行うためのモノレポです。共通ユーティリティ、アニメーション、ビジュアル表現、テンプレート、デモを含みます。

## 主な特徴

- pnpm workspaces によるモノレポ管理
- Remotion Studio/CLI 対応のデモとテンプレート
- タイムライン管理、Anime.js ブリッジ、トランジション、Three.js/R3F、Pixi/Konva、WebGL シェーダ、各種ユーティリティ
- まとめてレンダリング・アセット同期などのスクリプト
- CI（lint/ビルド/デモの自動レンダリング）

## ディレクトリ構成

```
remotion-studio/
  apps/
    _template/        # 新規プロジェクト用テンプレート
    demo-showcase/    # サンプル/ショーケース
  packages/
    @core/            # 基盤層（タイミング/フック/型）
    @animation/       # アニメーション層（Animeブリッジ/トランジション/イージング）
    @visual/          # ビジュアル層（Canvas2D/Three/Effects/Shaders）
    @audio/           # オーディオ層（雛形）
    @content/         # コンテンツ層（雛形）
    @design/          # デザインシステム（assets/tokens/themes）
  scripts/            # CLI スクリプト群
  docs/               # ドキュメント
```

## 必要要件

- Node.js 18+（推奨: 20）
- pnpm 8+
- ffmpeg（レンダリング時に必要）

## セットアップ & 起動

1) 依存関係インストール

```
pnpm install
```

2) デモを Remotion Studio で起動

```
pnpm -F @studio/demo-showcase run dev
```

3) プレビューサーバー（任意）

```
pnpm -F @studio/demo-showcase run preview
```

4) デモを一括レンダリング

```
pnpm -F @studio/demo-showcase run build
```

## 新規プロジェクト作成

テンプレート（apps/_template）から対話形式で生成します。

```
pnpm create:project
```

作成後:

```
pnpm -F @studio/<your-app> run dev
```

## 便利スクリプト

- 全アプリ/指定アプリの一括レンダリング（並列実行対応）

```
pnpm render:all --parallel 4 --out out
```

- 共通アセットを各アプリの public/assets へ同期

```
pnpm sync:assets              # シンボリックリンク
pnpm sync:assets --mode copy  # コピー
```

## 主なパッケージ

- 基盤
  - @studio/timing（タイムライン、進捗、frame<->ms）
  - @studio/core-hooks（共通フック: useAnimationFrame/useMediaTiming）
  - @studio/core-types（共通型）
- アニメーション
  - @studio/anime-bridge（Anime.js ブリッジと useAnime）
  - @studio/transitions（Fade/CrossFade/Slide/Wipe など）
  - @studio/easings（イージング関数, cubicBezier, Anime 変換）
- ビジュアル
  - @studio/visual-canvas2d（Pixi/Konva 連携）
  - @studio/visual-three（R3F ラッパー、カメラ/ライト）
  - @studio/visual-shaders（ShaderCanvas コンポーネント）
  - @studio/visual-effects（グリッチ/ブラー/グロー 等）
- デザイン/アセット
  - @design/assets（共通アセット。sync-assets で各アプリへリンク/コピー）

注: 一部は peerDependencies（react/three/@react-three/fiber/animejs/pixi.js/konva 等）です。使用するアプリ側の package.json に追加してください。

## CI

.github/workflows/
- ci.yml: 依存インストール → パッケージビルド → Prettier チェック
- render-demo.yml: デモの自動レンダリング（ffmpeg をセットアップし artifacts を保存）

## ライセンス

TBD（必要に応じて追記してください）

