// apps/playlist-mv/src/PlaylistMV.tsx
import {AbsoluteFill, Video, staticFile, useCurrentFrame} from "remotion";
import type {MVProps} from "./Root";
import {assets} from "./project.config";

// ★ 追加: フィルタ定義とテキストFX
import {SvgFilters, SliceReveal, KineticWords, WafuVertical} from "@visual/textfx";

export const PlaylistMV: React.FC<MVProps> = (props) => {
  const f = useCurrentFrame();
  const fps = 30;                          // 必要なら videoConfig から取ってOK
  const start = Math.floor(props.sliceInSec * fps);
  const end   = start + Math.floor(props.sliceDurSec * fps);
  const backgroundVideoSrc = staticFile(assets.backgroundVideo);
  const hasStarted = f >= start;
  const isWithinWindow = hasStarted && f < end;
  const canonicalText = props.sliceText;
  const canonicalWords = canonicalText
    .split(/[\s\u3000,、]+/)
    .map((word) => word.trim())
    .filter(Boolean);
  const wordsForEffect = props.words.length > 0 ? props.words : canonicalWords;
  const wafuTitle = props.wafuTitle || canonicalText;
  const wafuSubtitle = props.wafuSubtitle || canonicalText;

  const effect = props.textEffect ?? "sliceReveal";
  let textEffectElement = null;

  switch (effect) {
    case "sliceReveal":
      textEffectElement = (
        <SliceReveal text={canonicalText} play={isWithinWindow} />
      );
      break;
    case "kineticWords":
      textEffectElement = (
        <div style={{position:"absolute", inset:0, display:"grid", placeItems:"center"}}>
          <KineticWords words={wordsForEffect} play={hasStarted}/>
        </div>
      );
      break;
    case "wafuVertical":
      textEffectElement = (
        <div style={{position:"absolute", bottom:40, right:40, width:480}}>
          <WafuVertical title={wafuTitle} subtitle={wafuSubtitle} play={hasStarted}/>
        </div>
      );
      break;
    default:
      textEffectElement = null;
  }

  return (
    // ★ BPMはCSS変数 --bpm に渡す（CSS側が参照）:contentReference[oaicite:3]{index=3}
    <AbsoluteFill style={{["--bpm" as any]: props.bpm}}>
      {/* 背景動画をループ再生して全体に敷く */}
      <AbsoluteFill style={{zIndex: -1}}>
        <Video
          src={backgroundVideoSrc}
          muted
          loop
          style={{width: "100%", height: "100%", objectFit: "cover"}}
        />
      </AbsoluteFill>

      {/* ★ これを1回置く → GLARE/INK/和風の filter(#disp-noise/#ink-wobble/#ink-spread)が使えるようになる:contentReference[oaicite:4]{index=4} */}
      <SvgFilters />

      {/* プロップで選択されたテキストエフェクトを描画 */}
      {textEffectElement}
    </AbsoluteFill>
  );
};
