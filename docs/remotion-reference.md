# Remotion Reference (Link-First)

このドキュメントは「URLリンク中心」方針です。公式ドキュメントの内容を再配布せず、最小限の要約と出典リンクのみを掲載します。最新情報と詳細は必ずリンク先をご参照ください。

## 主要リンク
- Docs（総合）: https://www.remotion.dev/docs
- API: https://www.remotion.dev/docs/api
- Troubleshooting: https://www.remotion.dev/docs/troubleshooting
- CLI: https://www.remotion.dev/docs/cli

## API ピンポイント（最小要約＋出典）
- useCurrentFrame: 現在のフレーム番号を取得（アニメや補間の基点）
  - 出典: https://www.remotion.dev/docs/use-current-frame
- useVideoConfig: width/height/fps/duration を取得
  - 出典: https://www.remotion.dev/docs/use-video-config
- Composition: コンポジションを登録（id, component, duration など）
  - 出典: https://www.remotion.dev/docs/composition
- Sequence: 指定区間のみ子を表示（from, duration）
  - 出典: https://www.remotion.dev/docs/sequence
- spring / interpolate: 物理ベース/補間ユーティリティ
  - 出典: https://www.remotion.dev/docs/spring / https://www.remotion.dev/docs/interpolate
- AbsoluteFill: 全面レイアウトのショートカット
  - 出典: https://www.remotion.dev/docs/absolute-fill

## トラブルシューティング（最小）
- Composition ID 不一致 → 指定した ID と Composition の `id` を一致させる
  - 出典: https://www.remotion.dev/docs/troubleshooting
- `window is not defined` → ブラウザ環境前提の参照を避ける/ガードを入れる
  - 出典: https://www.remotion.dev/docs/troubleshooting
- アセット 404 → `public/` 配下＋ `staticFile()` を使用
  - 出典: https://www.remotion.dev/docs/staticfile

## レンダリング / ブラウザ
- レンダリング: `remotion render`
  - 出典: https://www.remotion.dev/docs/cli/render
- Chromium の指定（環境変数/引数）
  - 出典: https://www.remotion.dev/docs/chromium#specifying-a-custom-executable
- Chrome for Testing / Headless Shell の導入
  - 出典: https://www.remotion.dev/docs/chromium

## ライセンス / 実務の注意（出典リンク）
- チーム規模の数え方: 関わる全社合算で 4 名以上なら Company License（代理店×クライアント合算）。
- クラウドでレンダリングする場合は Cloud Rendering Unit の自己申告が必要（ローカルのみなら不要）。
  - 出典: https://companies.remotion.dev

（注）上記は最小限の要約です。適用条件や例外・最新の規定は必ず公式の出典を参照してください。

