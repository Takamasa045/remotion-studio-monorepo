import React from "react";
import {AbsoluteFill} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {BeatMarkers, BeatVisualizer} from "../components/BeatToolkit";
import {BulletList, ParagraphBlock, SplitColumns, TitleCard} from "../components/AnimatedText";

const gradientBackground = {
  background: "radial-gradient(circle at top left, #2c3e8d 0%, #0a0f23 55%, #05070f 100%)",
};

const ElevatedCard: React.FC<{children: React.ReactNode; width?: string}> = ({children, width = "100%"}) => {
  return (
    <div
      style={{
        background: "rgba(12,17,35,0.82)",
        borderRadius: 28,
        padding: "36px",
        border: "1px solid rgba(150, 178, 255, 0.16)",
        boxShadow: "0 30px 120px rgba(8,12,28,0.55)",
        width,
        color: "#f5f7ff",
        lineHeight: 1.5,
      }}
    >
      {children}
    </div>
  );
};

const IntroScene: React.FC = () => (
  <AbsoluteFill style={gradientBackground}>
    <TitleCard
      title="Remotion × AI"
      subtitle="次世代リリックMV制作を加速する包括的ブリーフィング"
    />
  </AbsoluteFill>
);

const ParadigmShiftScene: React.FC = () => (
  <AbsoluteFill style={gradientBackground}>
    <SplitColumns
      left={
        <div>
          <div style={{fontSize: 48, fontWeight: 700, marginBottom: 20}}>コードがタイムラインになる</div>
          <div style={{fontSize: 26, opacity: 0.85}}>
            useCurrentFrame() を軸に、フレーム = 状態 と捉えることで、
            バージョン管理・コンポーネント再利用・データ駆動といったソフトウェア工学の
            恩恵が映像制作にそのまま持ち込めます。
          </div>
        </div>
      }
      right={
        <ElevatedCard>
          <div style={{fontFamily: "JetBrains Mono, Menlo, monospace", fontSize: 20}}>
            {`const frame = useCurrentFrame();
const {fps} = useVideoConfig();
const opacity = interpolate(frame, [0, 15], [0, 1]);
return (
  <Sequence from={beats.kick} durationInFrames={30}>
    <PunchLine style={{opacity}} />
  </Sequence>
);`}
          </div>
        </ElevatedCard>
      }
    />
  </AbsoluteFill>
);

const TimelineScene: React.FC = () => (
  <AbsoluteFill style={{...gradientBackground, background: "linear-gradient(120deg, #101730, #050913 70%, #040610)"}}>
    <BulletList
      title="React的なタイムライン構築"
      items={[
        {
          title: "<Sequence>",
          description: "クリップをプログラム的に配置。ネストで相対フレーム管理が自在。",
        },
        {
          title: "<Series>",
          description: "シーンを直列に自動配置。演出をコードの羅列として保持できる。",
        },
        {
          title: "staticFile()",
          description: "アセット読み込みを型安全に。配信環境でもパス解決が安定。",
        },
        {
          title: "パフォーマンス最適化",
          description: "OffthreadVideo や concurrency 調整で高負荷レンダリングにも対応。",
        },
      ]}
    />
  </AbsoluteFill>
);

const SyncScene: React.FC = () => (
  <AbsoluteFill style={{...gradientBackground, background: "radial-gradient(circle at center, #0c1b3f 0%, #050912 65%)"}}>
    <AbsoluteFill style={{paddingTop: 80}}>
      <ParagraphBlock
        heading="音・テキストと完璧に同期"
        body="Whisper などで抽出したタイムスタンプ付き歌詞を用いれば、行単位・単語単位でのリリックモーションをコードで制御可能。さらにビート検出結果をトリガーに演出を同期すれば、音像と映像がリズムレベルでロックします。"
        delay={10}
      />
    </AbsoluteFill>
    <BeatVisualizer />
  </AbsoluteFill>
);

const WorkflowScene: React.FC = () => (
  <AbsoluteFill style={gradientBackground}>
    <SplitColumns
      left={
        <ElevatedCard>
          <div style={{fontSize: 30, fontWeight: 700, marginBottom: 12}}>ゼロタッチ自動生成</div>
          <ul style={{fontSize: 22, paddingLeft: 20}}>
            <li>AIが歌詞解析・背景生成・コード組み込みまで一気通貫</li>
            <li>サーバーレンダリングと連携すれば大量の楽曲をバッチ生成</li>
            <li>制作プロセスは「素材投入 → 自動レンダリング」へ</li>
          </ul>
        </ElevatedCard>
      }
      right={
        <ElevatedCard>
          <div style={{fontSize: 30, fontWeight: 700, marginBottom: 12}}>半自動・協調編集</div>
          <ul style={{fontSize: 22, paddingLeft: 20}}>
            <li>クリエイターが骨組みを作り、AIが演出パーツを補完</li>
            <li>自然言語プロンプトでビートエフェクトやテキスト演出を追加</li>
            <li>Remotion Studioで人間が最終微調整を行い精度を担保</li>
          </ul>
        </ElevatedCard>
      }
    />
  </AbsoluteFill>
);

const DialogueScene: React.FC = () => (
  <AbsoluteFill style={{...gradientBackground, background: "linear-gradient(160deg, #0f1a32, #080d17)"}}>
    <BulletList
      title="制作現場のダイアログ"
      items={[
        {
          title: "質感の言語化",
          description: "「ザラつき」→ カラーグレーディング + フィルムグレイン + グラフィティ風タイポ",
        },
        {
          title: "動きのニュアンス",
          description: "「ヌルっと出す」→ フェード時間を延ばし、モーションブラーで余韻を演出",
        },
        {
          title: "パンチライン強調",
          description: "リリックのキーワードにグリッチやRGBズレを瞬時に挿入",
        },
        {
          title: "ジャンル別スタイル",
          description: "Boom Bap, Trap, Lo-Fi などサブジャンルごとに演出テンプレを用意",
        },
      ]}
    />
  </AbsoluteFill>
);

const ToolsScene: React.FC = () => (
  <AbsoluteFill style={{...gradientBackground, background: "radial-gradient(circle at bottom, #13244a, #060910 70%)"}}>
    <SplitColumns
      delay={6}
      left={
        <ElevatedCard>
          <div style={{fontSize: 36, fontWeight: 700, marginBottom: 16}}>Remotion が向くケース</div>
          <div style={{fontSize: 22}}>
            <p>React / Web 技術を熟知し、コードで映像を管理したい。</p>
            <p>API 連携やデータ駆動で大量生成・自動更新を目指す。</p>
            <p>3D / 可視化 / カスタムシェーダーなど拡張性を重視。</p>
          </div>
        </ElevatedCard>
      }
      right={
        <ElevatedCard>
          <div style={{fontSize: 36, fontWeight: 700, marginBottom: 16}}>TextAlive が向くケース</div>
          <div style={{fontSize: 22}}>
            <p>GUIで歌詞タイミングを直感的に合わせたい。</p>
            <p>プログラミングよりもビジュアルデザインに集中したい。</p>
            <p>短期間で試作を回し、アーティストと対面で詰め込みたい。</p>
          </div>
        </ElevatedCard>
      }
    />
  </AbsoluteFill>
);

const OutroScene: React.FC = () => (
  <AbsoluteFill style={gradientBackground}>
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", color: "#f6f7fe"}}>
      <div style={{fontSize: 60, fontWeight: 800}}>創造性 × スケールの両立へ</div>
      <div style={{fontSize: 26, opacity: 0.8, marginTop: 24, maxWidth: 880, textAlign: "center"}}>
        Remotion のプログラマティックな表現力と、Claude Code をはじめとする AI コパイロットの
        生成力を掛け合わせ、MV 制作は「指示＝演出」へと進化します。
      </div>
    </AbsoluteFill>
    <BeatMarkers beatFrames={[30, 90, 150, 210]} />
  </AbsoluteFill>
);

export const BriefingExplainer: React.FC = () => {
  return (
    <AbsoluteFill>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={150}>
          <IntroScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({durationInFrames: 18})} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={200}>
          <ParadigmShiftScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming({durationInFrames: 12})} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={210}>
          <TimelineScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({durationInFrames: 18})} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={240}>
          <SyncScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming({durationInFrames: 12})} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={210}>
          <WorkflowScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({durationInFrames: 18})} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={210}>
          <DialogueScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={linearTiming({durationInFrames: 12})} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={210}>
          <ToolsScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition timing={springTiming({durationInFrames: 18})} presentation={fade()} />
        <TransitionSeries.Sequence durationInFrames={150}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
