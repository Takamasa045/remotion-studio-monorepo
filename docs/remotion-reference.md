# Remotion Reference Digest

Remotion の主要 API とトラブルシューティングの抜粋です。公式ドキュメントの該当ページへのリンクも記載しているので、詳細はリンク先を参照してください。

## よく使うフック・コンポーネント
- `useCurrentFrame()` – 現在のフレーム番号を取得します。Timeline に依存する計算はこの値を利用します。 ([Docs](https://www.remotion.dev/docs/use-current-frame))
- `useVideoConfig()` – `width`, `height`, `durationInFrames`, `fps` などコンポジション設定を返します。 ([Docs](https://www.remotion.dev/docs/use-video-config))
- `Composition` – 1 つのビデオコンポジションを登録します。`id`, `component`, `durationInFrames` などを必須で指定します。 ([Docs](https://www.remotion.dev/docs/composition))
- `Sequence` – 子コンポーネントを特定のフレーム範囲で表示します。`from`, `durationInFrames` の指定が必須です。([Docs](https://www.remotion.dev/docs/sequence))
- `spring`, `interpolate` – アニメーション用の補間関数。`spring` は物理ベースで `interpolate` は線形補間＋カーブ指定が可能。([Docs](https://www.remotion.dev/docs/spring), [Docs](https://www.remotion.dev/docs/interpolate))
- `AbsoluteFill` – ビデオ全体を覆う div を配置するショートカット。 ([Docs](https://www.remotion.dev/docs/absolute-fill))

## よくあるエラーと対処
| エラー | 原因 | 対処 |
| ------- | ------ | ----- |
| `useCurrentFrame can only be used within a Remotion composition` | `registerRoot` されたコンポーネント外でフックを呼んでいる | `src/index.ts` で `registerRoot` 済みのツリー内にコンポーネントを配置する |
| `Could not find composition with the ID "Main"` | `remotion render` の引数が `Composition id` と一致していない | `Composition id` を確認し、`remotion render <ID> out/video.mp4` を使う |
| `ReferenceError: window is not defined` | Node 実行時に `window` 参照をしている | コンポーネント内で `typeof window !== 'undefined'` を挟むか、SSR で触れないようにする |
| 音声・画像のパスが 404 になる | `public/` 以下に置かれていない、または `staticFile()` を使っていない | `public/assets/...` に配置するか、`staticFile('assets/...')` を使用 |
| Chrome Headless Shell のダウンロード失敗 | ネットワーク制限で `storage.googleapis.com` に到達できない | オフライン環境向けに `REMOTION_BROWSER_EXECUTABLE` を設定するか、ネットワーク許可を得て再試行 |

## レンダリングとブラウザ設定
- CLI からは `remotion render` を利用します。
- Chromium 系ブラウザは `--browser-executable=/path/to/chromium` か、環境変数 `REMOTION_BROWSER_EXECUTABLE=/path/to/chromium` で指定できます。
- Remotion v4 では `headless-shell` か `chrome-for-testing` の利用を推奨。`pnpm remotion install chrome --chrome-mode headless-shell` で取得できます。

<!-- MCP ツールの記述はテンプレからは外しています。必要に応じて導入してください。 -->

## 参考リンク
- Remotion Docs: https://www.remotion.dev/docs
- Troubleshooting: https://www.remotion.dev/docs/troubleshooting
- CLI コマンド一覧: https://www.remotion.dev/docs/cli
