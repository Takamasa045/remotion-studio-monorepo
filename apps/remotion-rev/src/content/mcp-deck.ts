export type SlideSpec = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  accent?: string;
};

// テーマカラー
const A = {
  orange: "#FF7A1A",
  green: "#6BE675",
  blue: "#8AA2FF",
};

export const mcpSlides: SlideSpec[] = [
  {
    title: "Remotionの基礎と自動化ワークフロー",
    subtitle: "コードで動画を作る。データで運用を回す。",
    bullets: [
      "映像の設計をReactで宣言し、フレーム単位で制御",
      "テンプレート + 入力データで大量生成・再現性の高い運用",
      "デザインとロジックを分離し、変更に強い構造に",
      "CI/CDやスケジューラと連携し、定時・大量レンダリング",
      "チームでレビュー可能なコード資産として蓄積",
    ],
    accent: A.blue,
  },
  {
    title: "Remotionとは？",
    subtitle: "Web技術で完結する映像制作",
    bullets: [
      "タイムライン編集ではなく、Reactコンポーネントで映像を構築",
      "HTML/CSS/TypeScriptの資産・知見をそのまま活用",
      "ブラウザでプレビューしながら即時反映（Hot Reload）",
      "Node/CLIからスクリプト実行可能で自動化に強い",
      "SVG・画像・音声・動画などWeb資産と相性が良い",
    ],
    accent: A.orange,
  },
  {
    title: "Remotionの基本的な特徴",
    bullets: [
      "Compositionでサイズ・FPS・尺を宣言、再利用しやすい構成",
      "Sequenceでシーンを時間配置、重ね合わせやクロスフェード",
      "interpolate/spring で自然なモーション設計",
      "静的アセット（画像/フォント/音声）を安定的に参照",
      "CLI/Node API による高速レンダリングと並列化",
    ],
    accent: A.blue,
  },
  {
    title: "はじめてのRemotionプロジェクト",
    bullets: [
      "npm init video で雛形生成 → 依存インストール",
      "remotion studio でコンポジションをプレビュー",
      "Root.tsx で Composition を登録（幅/高さ/FPS/尺）",
      "シーンは小さなコンポーネントに分割して保守性を確保",
      "デザインはトークン化（色/間隔/影）で一貫性を担保",
    ],
    accent: A.green,
  },
  {
    title: "プロジェクト作成の手順",
    bullets: [
      "ターミナルで npm init video → プロジェクト名を入力",
      "テンプレート（Blank/Hello World等）を選択",
      "cd <project> && npm i && npm run dev でStudio起動",
      "src/Root.tsx に最初のCompositionを登録",
      "public/assets に画像/音声を整理して配置",
    ],
    accent: A.orange,
  },
  {
    title: "開発とプレビューの流れ",
    bullets: [
      "remotion studio でプレビュー、フレーム表示とスクラブが可能",
      "コード保存で即反映、モーションの微調整が高速",
      "props でテキスト/色/画像を差し替えできる設計",
      "デバッグは分割統治：小さなシーン単位で確認",
      "パフォーマンスはuseMemo等で最小限の再計算に",
    ],
    accent: A.blue,
  },
  {
    title: "動画の書き出し方法",
    bullets: [
      "remotion render <ID> out/video.mp4 で書き出し",
      "幅・高さ・FPS・尺・シードをCLIで指定可能",
      "コーデックや画質・ピクセルフォーマットの調整で互換性確保",
      "複数コンポジション/バリアントをスクリプトで一括出力",
      "音声（BGM/SE）をミックスし、ラウドネスを意識",
    ],
    accent: A.orange,
  },
  {
    title: "Remotionによる自動化ワークフロー",
    bullets: [
      "Nodeスクリプトからレンダリングキューを制御",
      "GitHub Actions/CIで定期・イベント駆動の自動生成",
      "CSV/JSON/API入力により大量の動画を量産",
      "失敗時の再試行・ログ収集・通知を標準化",
      "成果物をクラウド/ストレージへ自動アップロード",
    ],
    accent: A.green,
  },
  {
    title: "テンプレート作成",
    bullets: [
      "テキスト/画像/カラーをprops化して差し替え前提に",
      "レイアウト/モーション/装飾を責務分離し再利用性向上",
      "デザイントークン（色/タイポ/余白/影）で一貫性",
      "レスポンシブや比率差異（16:9/1:1/9:16）を吸収",
      "アクセシビリティと可読性（サイズ/行間/コントラスト）",
    ],
    accent: A.blue,
  },
  {
    title: "データ連携の仕組み",
    bullets: [
      "JSON/CSV/APIからデータ取得 → 型定義で安全に取り回し",
      "テンプレートpropsにマッピングし、動的に内容を反映",
      "画像URL・カラーコード・数値を正規化、バリデーション",
      "キャッシュ戦略とフォールバックで欠損に強く",
      "再レンダリング時の差分管理とトレーサビリティ",
    ],
    accent: A.orange,
  },
  {
    title: "自動レンダリングの実践",
    bullets: [
      "並列度とメモリ上限を調整して安定稼働",
      "ジョブごとにパラメータ（尺/色/テキスト）差し替え",
      "失敗ジョブのリトライ/バックオフ/部分レンダリング",
      "コンテナ/クラウド実行でスケールアウト",
      "メトリクス（所要時間/失敗率/コスト）を可視化",
    ],
    accent: A.blue,
  },
  {
    title: "活用例：パーソナライズド動画",
    bullets: [
      "ユーザー名・実績・嗜好に応じて文言/色/画像を変更",
      "A/Bテスト用バリアントを一括生成し効果検証",
      "セグメント別の尺やCTAを最適化",
      "Pll/キャッシュで大量生成時の負荷を軽減",
      "個人情報の取り扱い/マスキングの運用ルール整備",
    ],
    accent: A.green,
  },
  {
    title: "活用例：SNSコンテンツと解説動画",
    bullets: [
      "9:16/1:1/16:9 をテンプレのpropsで自動バリアント化",
      "安全域・字幕位置・UI被りを考慮したレイアウト",
      "フォーマット別の最適長・冒頭3秒の掴みを自動化",
      "ブランドカラー/フォント/モーションを統一",
      "投稿先ごとのエクスポート設定をスクリプト化",
    ],
    accent: A.orange,
  },
  {
    title: "まとめ",
    bullets: [
      "Remotionで映像制作をソフトウェア開発プロセスに統合",
      "テンプレ + データの仕組みで運用がスケール",
      "自動化で安定品質・短納期・費用最適化を実現",
      "次のステップ：要件ヒアリング→テンプレ設計→PoC→本番運用",
      "計測と改善のループで継続的に価値を最大化",
    ],
    accent: A.blue,
  },
];
