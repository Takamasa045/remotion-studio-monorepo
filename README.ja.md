[EN](./README.md) | [JA](./README.ja.md)
# Remotion Studio Monorepo

Remotion + React の「テンプレート専用」リポジトリです。`apps/_template` を元に新規プロジェクトを作成し、各アプリ内で開発・レンダリングを行います。

## クイックスタート（セットアップ）

このリポジトリは Git サブモジュール（`apps`）を利用しています。クローン時は必ずサブモジュールも取得してください。

前提ソフト（必須）
- Node.js 18+（推奨: 20）/ 推奨: `nvm` などでバージョン管理
- pnpm 8+
- ffmpeg（レンダリングに必要）

バージョン確認
```
node -v
pnpm -v
ffmpeg -version
```

1) リポジトリをクローン（推奨: SSH、サブモジュール込み）

```
# SSH の場合（推奨: サブモジュールURLもSSHのため）
git clone --recurse-submodules git@github.com:Takamasa045/remotion-studio.git

# HTTPS の場合（SSH未設定の方向け）
git clone https://github.com/Takamasa045/remotion-studio.git
cd remotion-studio
# サブモジュールを初期化・取得
 git submodule update --init --recursive
```

2) 依存のインストール（Node.js 18+ / 推奨: 20、pnpm 8+）

```
cd remotion-studio
# pnpm が無ければ（任意の方法で）
# 推奨: corepack を使う（Node 18+ で利用可）
# corepack enable && corepack prepare pnpm@latest --activate
# もしくはグローバル: npm i -g pnpm

# Node バージョン切替（必要な場合）
# nvm install 20 && nvm use 20

pnpm install
```

3) 動作確認（デモアプリで起動）

```
# 例: デモアプリをプレビュー起動
cd apps/demo-showcase
pnpm dev

# レンダリング（mp4 出力）
pnpm build
```

4) 新規プロジェクト作成（テンプレから生成）

```
cd <repo-root>
pnpm create:project
# → 対話で name / width / height / fps / duration / compositionId を入力
cd apps/<name>
pnpm dev
```

補足
- ffmpeg が未インストールの場合は導入してください（macOS: `brew install ffmpeg` / Windows: `choco install ffmpeg` / Linux: 各ディストリのパッケージマネージャ）。
- サブモジュールの取得状況は `git submodule status` で確認できます。HTTPS でクローンした場合に権限エラーが出るときは、SSH 設定を行うか `.gitmodules` の URL を HTTPS に変更して `git submodule sync --recursive` を実行してください。

任意: apps サブモジュールをスパースチェックアウト（_template と demo のみ展開）

```
pnpm run sparse:apps
# 後で 3D-template も展開したい場合:
#   cd apps && git sparse-checkout set _template demo-showcase 3D-template
```

各アプリの起動・ビルド例（公開リポは `_template` と `demo-showcase` と `3D-template` を同梱。初期設定では `3D-template` はワークスペース対象外）
```
# demo アプリの起動
cd apps/demo-showcase
pnpm dev

# テンプレから新規作成（例: my-app）
cd <repo-root>
pnpm create:project
cd apps/my-app
pnpm build
```

## 特徴
- pnpm workspaces を用いた堅牢なモノレポ運用
- 汎用テンプレ（apps/_template）とデモ（apps/demo-showcase）
 
- オフライン参照用リファレンス（docs/remotion-reference.md）
- タイムライン（@studio/timing）、Anime.js ブリッジ、トランジション、R3F、Pixi/Konva、WebGL エフェクト
- 開発効率化スクリプト（dev/preview/build の汎用ランナー、一括レンダリング、アセット同期、テンプレ置換）
- CI（lint / build / デモ自動レンダリング）

## 構成（標準ブループリント）
以下はテンプレ運用の推奨レイアウトです（現状のリポジトリには最小限のみ含まれます）。

```
remotion-studio/
  apps/
    _template/        # 新規プロジェクト用テンプレ（この雛形を複製して使う）
    demo-showcase/    # デモ・ショーケース（例・任意）
  packages/
    @core/            # 基盤層（timing/hooks/types などの共有コード／例・任意）
    @animation/       # アニメーション層（anime-bridge/transitions/easings／例・任意）
    @visual/          # ビジュアル層（canvas2d/three/shaders/effects／例・任意）
    @audio/           # オーディオ層（雛形／例・任意）
    @content/         # コンテンツ層（雛形／例・任意）
    @design/          # デザイン（assets/tokens/themes／例・任意）
  scripts/            # CLI スクリプト群（create-project 等。用途は後述）
  docs/               # ドキュメント（運用メモ・参照資料等。用途は後述）
```

注記: 現在のリポジトリは「テンプレ最小構成」のため、実体としては `apps/_template` と最低限の `scripts`/`docs` のみを含みます。他は将来必要に応じて追加・生成してください。

## 要件
- Node.js 18+（推奨: 20）
- pnpm 8+（推奨: 最新）
- ffmpeg（レンダリングに必要）

## セットアップ
```
pnpm install
```

## 使い方
- 新規アプリ作成: `pnpm create:project`（name / width / height / fps / duration / compositionId を対話入力）
- 生成後にアプリへ移動: `cd apps/<name>`
- 開発サーバ起動（プレビュー）: `pnpm dev`
- ビルド済みプレビュー: `pnpm preview`
- レンダリング（mp4）: `pnpm build`

 

## MCP 設定

### Claude Code
端末で追加:

```
claude mcp add
# Name: remotion-documentation
# Command: npx
# Args: @remotion/mcp@latest
```

GUI ウィザードを使わない場合は設定に以下を追記:

```json
{
  "mcpServers": {
    "remotion-documentation": {
      "command": "npx",
      "args": ["@remotion/mcp@latest"]
    }
  }
}
```

→ Claude のチャットで「remotion-documentation を使って “render h264 フラグ” を調べて」と指示。公式ガイド通りの設定です（remotion.dev）。

### Codex（OpenAI Codex CLI）
`~/.codex/config.toml` に追記:

```toml
[mcp_servers.remotion_documentation]
type = "stdio"
command = "npx"
args = ["@remotion/mcp@latest"]
```

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
cd apps/my-app
pnpm dev
```

### アセット（CSS・フォント・画像・音源・動画など）

- 各アプリは `public/` が公開ルートです。`pnpm create:project` で生成すると、次のサブフォルダが自動作成されます（.gitkeep 付き）。

```
public/
  assets/
    images/   # PNG/JPG/SVG など
    audio/    # MP3/WAV/WEBM など
    video/    # MP4/WEBM など
    fonts/    # WOFF/TTF など（@font-face + staticFile で参照）
    css/      # スタンドアロンCSS（必要なら staticFile で取得）
    data/     # JSON などのデータ
    lottie/   # Lottie JSON
```

- 使い方の例
  - 画像: `/assets/images/logo.png`
  - 音声: `/assets/audio/bgm.mp3`
  - 動画: `/assets/video/clip.mp4`
  - CSS: `src/styles` でインポート推奨（例: `import './styles/app.css'`）。外部CSSを `public/assets/css` に置く場合は `staticFile('/assets/css/app.css')` から取得し、`<style>` へ流し込む等で適用できます。
  - フォント: `public/assets/fonts` へ配置し、CSSの `@font-face` で `src: url(staticFile('/assets/fonts/xxx.woff2'))` を指定。

- リリック（LRC）の配置ルール（標準）
  - 音声ファイルと同じディレクトリ（assets/audio）に、同じベース名で `.lrc` を置きます。
  - 例: `/assets/audio/song.mp3` に対して `/assets/audio/song.lrc`
  - コード例（取得）:
    ```ts
    const lrc = await fetch('/assets/audio/song.lrc').then(r => r.text());
    // 必要に応じて LRC をパースして [{timeMs, text}] などに変換
    ```

<!-- 共通アセット同期スクリプトはテンプレには含めていません。必要なら scripts/ に追加してください。 -->

- バージョン管理の注意
  - 大きなバイナリ（長尺の動画・音源）は Git LFS などの利用を推奨します。
  - プロジェクト固有のストレージ/CDN を使う場合は、`public/` ではなく実行時に取得する運用でもOKです。

### ライブラリの考え方（なぜ必要？ 起動時？ 追加方法？）

なぜ必要か（用途別の代表例）
- アニメーション強化: `animejs`（`@studio/anime-bridge`）/ `@studio/transitions` / `@studio/easings`
- 2D/Canvas 系: `pixi.js`, `konva`（`@studio/visual-canvas2d`）
– 3D/R3F 系: `three`, `@react-three/fiber`, `@react-three/drei`, `@remotion/three`
- 入力検証/スキーマ: `zod`（`@remotion/zod-types` 連携）
- メディアユーティリティ: `@remotion/media-utils` など

起動時（dev/preview/render）の挙動
- Remotion CLI（Webpack）がエントリ `src/index.ts` を基点に依存をバンドルします。
- テンプレはモノレポの独自エイリアスに依存しません（`remotion.config.ts` は素のまま）。
- `pnpm install` 時に一部パッケージは `prepare` スクリプトで `dist` を生成しますが、開発時のバンドルは `src` を参照します（ホットリロードが高速）。
- `public/` 以下のアセットは `staticFile()` で解決され、開発サーバ経由で配信されます。

追加方法（ケース別）
- あるアプリだけで使う
  - `pnpm add <pkg> --filter @studio/<app>`
  - 例: `pnpm add animejs --filter @studio/demo-showcase`
  - 型定義は開発依存で: `pnpm add -D @types/<pkg> --filter @studio/<app>`
- 複数アプリで使う
  - それぞれのアプリに必要な依存を追加してください（テンプレは最小構成）。
- 共有パッケージを作りたい
  - このテンプレでは既定で `packages/` は使いません。必要になったら作成して workspace に追加してください。

PeerDependencies（注意）
- 内製パッケージは、外部ライブラリを `peerDependencies` にしている場合があります。
  - 例: `@studio/visual-three` を使うアプリでは、`pnpm add three @react-three/fiber --filter @studio/<app>` が必要
  - 例: `@studio/visual-canvas2d` を使うアプリでは、`pnpm add pixi.js konva --filter @studio/<app>` が必要

ブラウザ実行の前提（落とし穴）
- Composition 側のコードはブラウザで実行されるため、`fs`, `path`, `net` などの Node.js 専用モジュールは使えません。
  - こういった処理は Node スクリプト（`scripts/` 配下）やビルド時前処理、あるいは `remotion.config.ts` 側へ分離してください。
- ライブラリが CSS を伴う場合は、明示的に import が必要なことがあります。
  - 例: `import 'your-lib/dist/styles.css'`

導入後の基本手順
- 依存追加後は `pnpm install` を実行し、ロックファイルを更新してコミットします。
- 開発: 対象アプリ配下で `pnpm dev` / プレビュー: `pnpm preview` / レンダ: `pnpm build`
- ビルド時にエラーが出る場合は、`remotion.config.ts` で `overrideWebpackConfig` による調整（`alias` 追加、ブラウザ向けビルドを指すようにする等）を検討してください。

#### 3D/R3F 導入メモ
- インストール（アプリ配下）: `pnpm add three @react-three/fiber @react-three/drei @remotion/three@^4.0.350`
- またはルートから（workspace filter）: `pnpm add three @react-three/fiber @react-three/drei @remotion/three@^4.0.350 --filter @studio/<app>`
- 互換性: Remotion v4.0.350 に対して `@remotion/three@^4.0.350` を推奨
- WebGL の安定化（必要時）: 各アプリの `remotion.config.ts` で `Config.setChromiumOpenGlRenderer('angle')` 等を指定可能
- アセット読み込み: `public/` にモデル/テクスチャを置き、`staticFile('/assets/...')` の URL を `useGLTF()` などへ渡す

### どんな人が入れるといいのか（使用例）
このモノレポは全部入りではなく、必要な機能だけを組み合わせる設計になっています。
用途に応じて、以下のようにライブラリ（peerDependencies）を追加してください。

- 🎞 シンプルに動画を作りたい
  - `apps/hello` か `apps/_template` でOK（最小構成）
- ✨ フェードやイージングを付けたい
  - `@studio/transitions`, `@studio/easings` を import すれば追加インストール不要
- 🌀 滑らかなトゥイーンや細かい動きを付けたい
  - `pnpm add animejs --filter @studio/<app>` を実行し、`@studio/anime-bridge` を使用
- 🎨 2D グラフィックス（Pixi / Konva）を使いたい
  - `pnpm add pixi.js konva --filter @studio/<app>` の上で `@studio/visual-canvas2d` を利用
- 🏔 3D 表現（Three.js + React Three Fiber）を使いたい
  - `pnpm add three @react-three/fiber @react-three/drei @remotion/three@^4.0.350 --filter @studio/<app>`
- 🎵 音声や歌詞同期（LRC）を扱いたい
  - `@studio/timing`, `@studio/core-hooks` を利用（追加インストール不要）。歌詞ファイルは `assets/audio/` に配置

<!-- Studio Lite セクションは削除（混乱防止のため） -->

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

## Remotion 設定（テンプレ）
- いま設定は不要です（テンプレはそのまま動きます）。
- `@remotion/cli/config` の `Config.overrideWebpackConfig` は最小のまま利用しています（デフォルトでOK）。
- 必要になったときだけ、各アプリの `remotion.config.ts` を編集してください（例: Webpack の alias を追加）。

## 規約（Entry / Root / 命名）
- これは動作ルールの説明で、いま何かを設定する必要はありません。
- Entry point: 各アプリの `src/index.ts`（または `.tsx`）がエントリで、必ず `registerRoot(Root)` を呼びます。
- Root file: `src/Root.tsx` で `<Composition />` を宣言します（`registerRoot` はここでは呼ばない）。
- CLI: `remotion studio` / `remotion render` はエントリ自動検出を利用し、`--entry-point` を原則省略します。
- 命名: Root ファイルは `Root.tsx`（PascalCase）で統一します。
- 任意: 厳密化したい場合は `remotion.config.ts` に `Config.setEntryPoint('src/index.ts')` を明示可能です。

## TypeScript 設定（テンプレ）
- いま設定は不要です（最小構成のままでOK）。
- 追加のパスエイリアスが必要になったら、必要になったタイミングで拡張してください。

## CI
- いまは何も設定されていません。使いたい場合のみ、GitHub Actions などを追加してください。
- 例（任意）: `.github/workflows/ci.yml`（依存→ビルド→Prettier チェック）
- 例（任意）: `.github/workflows/render-demo.yml`（ffmpeg セットアップ→自動レンダリング→成果物アップロード）

## トラブルシューティング
- remotion コマンドが見つからない
  - 該当アプリに `@remotion/cli` を追加: `pnpm -F @studio/<app> add -D @remotion/cli`
  - もしくはワークスペースに追加: `pnpm -w add -D @remotion/cli`
- サブモジュール関連
  - 初期化・取得していない: `git submodule update --init --recursive`
  - 取得内容を最新にしたい: `git submodule update --remote --merge`
  - HTTPS クローンで権限エラー: `.gitmodules` の URL を HTTPS に変更し同期
    - `git config -f .gitmodules submodule.apps.url https://github.com/Takamasa045/remotion-studio-apps.git`
    - `git submodule sync --recursive`
    - `git submodule update --init --recursive`
  - `fatal: not a git repository` が出る: リポジトリ直下で実行しているか確認
- `import.meta` の警告
  - remotion.config.ts は `process.cwd()` ベースで解決する実装にしているため、警告は出ない構成です（古い設定が残っていれば差し替え）
- tsconfig の `must have at most one "*"` 警告
  - 1エントリ1つの `*` になるよう `paths` を分割済み
- エントリポイントが見つからない
  - 各アプリの `src/index.ts` が Remotion v4 のエントリ。テンプレ/デモは同梱済み。
- ffmpeg が見つからない
  - macOS: `brew install ffmpeg` / Windows: `choco install ffmpeg` / Linux: `apt/yum` などで導入後、`ffmpeg -version` で確認
- Node バージョン起因のエラー
  - `nvm install 20 && nvm use 20` で切り替え。`node -v` で確認
- ポート競合（EADDRINUSE）
  - 既存の開発サーバを停止するか、別ポートで起動
  - 例: macOS で 3000 番のプロセス確認 `lsof -i :3000`

## scripts と docs の用途
- scripts/（CLI スクリプト群）
  - `create-project.ts`
    - 役割: `apps/_template` を複製して `apps/<name>` を作成。Width/Height/FPS/Duration/Composition ID を対話で設定。
    - 使い方: `pnpm create:project`（ルートから）
  - 追加の例（必要になったら作成）
    - `dev.ts`/`preview.ts`/`build-app.ts`: 任意アプリの起動・プレビュー・ビルドを共通のUIで行うランナー
    - `render-all.ts`: 複数アプリ・複数Compositionの一括レンダリング
    - `sync-assets.ts`: 共通アセットの各アプリ `public/` への同期
- docs/（ドキュメント）
  - `remotion-reference.md`: Remotion の主要API/トラブルシューティングの要点を抜粋
  - 推奨: チーム運用メモ（命名規約、パス設計、アセット配置方針、レビュー基準）、利用ライブラリの導入手順、ビルド/配信フローなどを追記
  - 参考: テンプレで生成した各アプリの README も、docs からリンクしておくとオンボーディングが容易です
<!-- 一括レンダリングやMCPのランナーはテンプレには含まれていません。必要に応じて scripts/ に追加してください。 -->

## ライセンス
MIT License（このリポジトリ直下の `LICENSE` を参照）

This repository provides templates and scripts only.
It does not redistribute the Remotion software.
Users install Remotion via npm (e.g. pnpm i remotion @remotion/cli).
This project is unofficial and not affiliated with or endorsed by Remotion.
For Remotion’s license & terms, see the official docs.

（日本語版）

このリポジトリはテンプレート／スクリプトのみを提供します。
Remotion本体の同梱・再配布は行いません（利用者が pnpm i remotion @remotion/cli 等で導入）。
本プロジェクトは非公式であり、Remotionの提携・公認ではありません。
ライセンスと規約は必ず公式ドキュメントをご確認ください。
