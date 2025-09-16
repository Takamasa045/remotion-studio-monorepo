# Studio Lite

Studio Lite は Remotion Studio モノレポ内で最小限の構成だけを使って素早くプレビューしたい場合のためのフォルダです。

## ねらい
- **高速起動**: 追加パッケージのビルドやウォッチが不要。
- **依存が少ない**: `react`, `react-dom`, `remotion`, `@remotion/cli` のみ。
- **コピーしやすい**: フォルダをそのまま別リポジトリに移動しても動作。

## 使い方
```bash
pnpm install
pnpm dev studio-lite
```

`apps/studio-lite/src/compositions/Intro.tsx` の JSX を編集すれば即座にプレビューが更新されます。標準テンプレよりもコード量が少なく、Remotion の基本 API（`Composition`, `Sequence`, `spring`, `interpolate` など）のみを利用しています。

## CLI でレンダリングする
```bash
pnpm render:lite -- --browser brave
```

`--browser` には `chrome`, `chrome-testing`, `chromium`, `edge`, `brave`, `vivaldi`, `arc` を指定できます。環境変数からパスを直接指定したい場合は、以下のいずれかを利用してください。

```bash
# 実行ファイルを直接指定
REMOTION_BROWSER_EXECUTABLE="/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" pnpm build:lite

# 互換環境変数（従来の Remotion と同じ）
REMOTION_CHROMIUM_EXECUTABLE=/path/to/chromium pnpm render:lite
```

macOS で Chrome for Testing をローカルにダウンロード済みの場合は、自動的に検出されます。それ以外のブラウザも上記のようにパスを通せば利用できます。

## 拡張するには
- 既存のパッケージを利用したくなった場合は、必要なものだけを追加でインストールしてください。
- それでも設定を最小に保ちたい場合は `remotion.config.ts` での alias 追加は不要です（TypeScript で `paths` を空オブジェクトにしているため、`@studio/*` のエイリアスは解決されません）。
- 共有アセットが必要になったら `pnpm sync:assets` を使うか、`public/` に直接配置してください。

## どれぐらい軽くなるのか
既存の demo-showcase を `pnpm dev demo-showcase` で起動すると、10 以上のワークスペースパッケージのビルド監視が始まります。Studio Lite ではこれらが一切走らないため、ウォッチの立ち上がりが数秒で完了し、依存インストールも最小限です。
