# Remotion Studio Monorepo

Remotion + React で動画制作を行うためのモノレポです。タイムライン、アニメーション、ビジュアル、テンプレート、スクリプト、CI を一式同梱し、素早く制作〜レンダリングまで回せます。

## 特徴
- pnpm workspaces を用いた堅牢なモノレポ運用
- 汎用テンプレ（apps/_template）とデモ（apps/demo-showcase）
- 軽量スタータ（apps/studio-lite / 複数の Chromium 系ブラウザに対応）
- オフライン参照用リファレンス（docs/remotion-reference.md）
- タイムライン（@studio/timing）、Anime.js ブリッジ、トランジション、R3F、Pixi/Konva、WebGL エフェクト
- 開発効率化スクリプト（dev/preview/build の汎用ランナー、一括レンダリング、アセット同期、テンプレ置換）
- CI（lint / build / デモ自動レンダリング）

## 構成
```
remotion-studio/
  apps/
    studio-lite/      # 依存の少ないシンプルなスタータ
    _template/        # 新規プロジェクト用テンプレ
    demo-showcase/    # デモ・ショーケース
  packages/
    @core/            # 基盤層（timing/hooks/types）
    @animation/       # アニメーション層（anime-bridge/transitions/easings）
    @visual/          # ビジュアル層（canvas2d/three/shaders/effects）
    @audio/           # オーディオ層（雛形）
    @content/         # コンテンツ層（雛形）
    @design/          # デザイン（assets/tokens/themes）
  scripts/            # CLI スクリプト群
  docs/               # ドキュメント
```

## 要件
- Node.js 18+（推奨: 20）
- pnpm 8+（推奨: 最新）
- ffmpeg（レンダリングに必要）

## セットアップ
```
pnpm install
```

## よく使うコマンド（ルート）
- Remotion Hub で全プロジェクトをまとめて起動
  - `pnpm --filter @studio/remotion-hub dev`
- 任意アプリを起動（汎用ランナー）
  - `pnpm dev <app>` 例: `pnpm dev demo-showcase`
  - 軽量スタータのみを使う: `pnpm dev studio-lite`
  - `pnpm preview <app>` 例: `pnpm preview test`
  - `pnpm build:app <app>` 例: `pnpm build:app demo-showcase`
  - Studio Lite を CLI からレンダリング: `pnpm render:lite -- --browser brave`
  - Remotion docs を MCP 経由で検索: `pnpm mcp:remotion`
- 一括レンダリング
  - `pnpm render:all --parallel 4 --out out`
- 共通アセット同期
  - `pnpm sync:assets`（シンボリックリンク）
  - `pnpm sync:assets --mode copy`（コピー）

### MCP（Model Context Protocol）連携（remotionmcp など）
- ローカル/外部の MCP サーバを HTTP でアダプトして stdio で利用するランナーを同梱しています。
- 既定値: `MCP_NAME=remotionmcp`, `MCP_URI=http://localhost:4000`

```
# そのまま（http://localhost:4000 を想定）
pnpm mcp:remotion

# 明示的に URI/NAME を指定
MCP_URI=http://localhost:8787 pnpm mcp:remotion
MCP_NAME=my-remotion MCP_URI=https://example.com/mcp pnpm mcp:remotion
```

- ~/.codex/config.toml を利用中の場合は、同等のエントリ（command/args/env）を追加してもOKです。
- 本リポ内で MCP をパッケージ化したい場合は、`packages/@tools/remotion-mcp` として取り込み、
  ルートの `scripts` から起動できるようにも構成可能です（要望あれば対応します）。

#### Claude Code で remotiondocs を使う場合
- `.claude/config.json` などに次のエントリを追加してください。

```json
{
  "name": "remotiondocs",
  "command": "pnpm",
  "args": ["mcp:remotion"],
  "workingDirectory": "/Users/takamasa/remotion-studio"
}
```

- `Claude > MCP` から `remotiondocs` を有効化すると、Remotion の公式ドキュメント検索をチャット内から利用できます。
- 主要 API やトラブルシューティングの抜粋は `docs/remotion-reference.md` にまとめています。オフラインでも参照可能です。

## 新規プロジェクト作成
テンプレ（apps/_template）から対話で生成します。
```
pnpm create:project
```
入力例:
- name: `my-app` → apps/my-app として作成 / package 名は `@studio/my-app`
- width/height/fps/duration: 数値で指定

生成後（デフォルトでは Composition ID は `Main` に設定されます。対話で変更可）:
```
pnpm dev my-app
```

### アセット（動画・音楽・画像）の配置について

- 各アプリは `public/` が公開ルートです。新規作成直後は空なので、必要に応じて以下のようなディレクトリを作成してください。

```bash
mkdir -p apps/<your-app>/public/assets/{images,audio,video}
```

- 使い方の例
  - 画像: `/assets/images/logo.png`
  - 音声: `/assets/audio/bgm.mp3`
  - 動画: `/assets/video/clip.mp4`

- リリック（LRC）の配置ルール（標準）
  - 音声ファイルと同じディレクトリ（assets/audio）に、同じベース名で `.lrc` を置きます。
  - 例: `/assets/audio/song.mp3` に対して `/assets/audio/song.lrc`
  - コード例（取得）:
    ```ts
    const lrc = await fetch('/assets/audio/song.lrc').then(r => r.text());
    // 必要に応じて LRC をパースして [{timeMs, text}] などに変換
    ```

- 共通アセットを使う場合（推奨）
  - 共有パッケージ `@design/assets/assets` を各アプリの `public/assets` にリンク/コピーできます。
  - シンボリックリンク: `pnpm sync:assets`
  - コピー: `pnpm sync:assets --mode copy`

- バージョン管理の注意
  - 大きなバイナリ（長尺の動画・音源）は Git LFS などの利用を推奨します。
  - プロジェクト固有のストレージ/CDN を使う場合は、`public/` ではなく実行時に取得する運用でもOKです。

### ライブラリの追加・共有
- pnpm ワークスペースなので、利用したいアプリだけに依存を入れる場合は `pnpm add <pkg> --filter @studio/<app>` を使います。例: Remotion Hub でのみ利用 → `pnpm add @remotion/lottie --filter @studio/remotion-hub`。
- 全アプリ共通で使う場合は `pnpm add <pkg> -w` でルートに追加するか、必要なアプリそれぞれに同じ依存を追加します。型定義パッケージ（`@types/*`）も同様です。
- ブラウザ実行が必要なライブラリかを確認してください。Node.js 専用モジュールは Remotion のバンドラーでエラーになります。
- 独自の共通コードは `packages/` 配下にパッケージを作成し、`"name": "@studio/<pkg>"` として公開すると、どのアプリからも `@studio/<pkg>` で参照できます。
- 依存を追加したら `pnpm install` を実行し、`pnpm-lock.yaml` の更新を含めてコミットするようにしてください。

### もっと軽量に始めたい場合（Studio Lite）
- `apps/studio-lite` は React + Remotion のみに依存する極小構成です。
- 追加パッケージのビルドや別パッケージ監視が発生しないので、初回セットアップと起動が速いです。
- コマンド例
  - `pnpm dev studio-lite`
  - `pnpm preview studio-lite`
  - `pnpm build:app studio-lite`
  - CLI レンダリング: `pnpm render:lite -- --browser <chrome|chromium|brave|edge|vivaldi|arc>`
- フォルダごとコピーすれば単体リポジトリとしても利用できます。
- Remotion API/トラブルシューティングの抜粋: [`docs/remotion-reference.md`](./docs/remotion-reference.md)

### テンプレのプレースホルダ
- `__PACKAGE__` → `@studio/<slug>` に置換
- `__APP_NAME__` → `<slug>` に置換
- （必要なら）`pnpm templateize` でテンプレ自体をプレースホルダ化

## パッケージ一覧（要点）
- 基盤
  - `@studio/timing`: タイムライン/進捗/フレーム換算
  - `@studio/core-hooks`: `useAnimationFrame`, `useMediaTiming`
  - `@studio/core-types`: 共有型
- アニメーション
  - `@studio/anime-bridge`: Anime.js ブリッジ + `useAnime`
  - `@studio/transitions`: `FadeIn/FadeOut/CrossFade/SlideIn/Wipe`
  - `@studio/easings`: cubicBezier/各種 Easing + Anime 変換
- ビジュアル
  - `@studio/visual-canvas2d`: Pixi/Konva 連携
  - `@studio/visual-three`: R3F ラッパー、カメラ/ライトプリセット
  - `@studio/visual-shaders`: ShaderCanvas（WebGL）
  - `@studio/visual-effects`: グリッチ/ブラー/グロー等（シェーダベース）
- デザイン
  - `@design/assets`: 共通アセット（`pnpm sync:assets`で各アプリへ）

注: 一部は peerDependencies（react/three/@react-three/fiber/animejs/pixi.js/konva 等）です。必要なアプリで追加してください。

## Remotion 設定
- 新API: `@remotion/cli/config` の `Config.overrideWebpackConfig`
- remotion.config.ts はモノレポの `packages/**/src` を再帰走査して `{pkg.name → src}` の alias を自動生成

## TypeScript 設定
- ルート `tsconfig.base.json` の `paths`:
  - `@studio/*` → `packages/@core/*/src`, `@animation/*/src`, `@visual/*/src`, `@audio/*/src`, `@content/*/src`
  - `@design/*` → `packages/@design/*/src`, `packages/@design/*`
- 各アプリの `tsconfig.json` も同様の設定

## CI
- `.github/workflows/ci.yml`：依存→ビルド→Prettier チェック
- `.github/workflows/render-demo.yml`：ffmpeg セットアップ→デモ自動レンダリング→成果物アップロード

## トラブルシューティング
- remotion コマンドが見つからない
  - 該当アプリに `@remotion/cli` を追加: `pnpm -F @studio/<app> add -D @remotion/cli`
  - もしくはワークスペースに追加: `pnpm -w add -D @remotion/cli`
- `import.meta` の警告
  - remotion.config.ts は `process.cwd()` ベースで解決する実装にしているため、警告は出ない構成です（古い設定が残っていれば差し替え）
- tsconfig の `must have at most one "*"` 警告
  - 1エントリ1つの `*` になるよう `paths` を分割済み
- エントリポイントが見つからない
  - 各アプリの `src/index.ts` が Remotion v4 のエントリ。テンプレ/デモは同梱済み。

## ライセンス
TBD（必要に応じて追記）
