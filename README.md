# Remotion Studio Monorepo

Remotion + React の「テンプレート専用」リポジトリです。`apps/_template` を元に新規プロジェクトを作成し、各アプリ内で開発・レンダリングを行います。

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

## よく使うコマンド（テンプレ使用）
- 新規アプリ作成
  - `pnpm create:project`
  - 指示に従って name / width / height / fps / duration / compositionId を入力
- アプリの起動（作成後）
  - `pnpm -C apps/<name> run dev`（プレビュー）
  - `pnpm -C apps/<name> run preview`（ビルドされたプレビュー）
  - `pnpm -C apps/<name> run build`（mp4レンダリング）

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
<!-- 一括レンダリングやMCPのランナーはテンプレには含めていません。必要に応じて scripts/ に追加してください。 -->

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
- 開発: `pnpm dev <app>` / プレビュー: `pnpm preview <app>` / レンダ: `pnpm build:app <app>`
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
- `import.meta` の警告
  - remotion.config.ts は `process.cwd()` ベースで解決する実装にしているため、警告は出ない構成です（古い設定が残っていれば差し替え）
- tsconfig の `must have at most one "*"` 警告
  - 1エントリ1つの `*` になるよう `paths` を分割済み
- エントリポイントが見つからない
  - 各アプリの `src/index.ts` が Remotion v4 のエントリ。テンプレ/デモは同梱済み。

## ライセンス
MIT License（このリポジトリ直下の `LICENSE` を参照）
