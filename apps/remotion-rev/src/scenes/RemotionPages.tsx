import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {HtmlPage} from "../components/HtmlPage";

const PAGES = Array.from({length: 14}, (_, i) => `/assets/Remotion/page_${i + 1}.html`);
export const PAGES_COUNT = PAGES.length;

// Timing (30fps assumed, but reads from video config)
const PAGE_DURATION = 90; // frames per page
const CROSSFADE = 12; // frames overlap for crossfade

export const calcTotalDuration = (count: number) => {
  if (count <= 0) return PAGE_DURATION;
  return PAGE_DURATION + (count - 1) * (PAGE_DURATION - CROSSFADE);
};

export const RemotionPages: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "linear-gradient(180deg,#0b0d12,#12151d)", overflow: "hidden"}}>
      {/* Subtle grid */}
      <AnimatedGrid opacity={0.08} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.06,
          backgroundImage:
            "radial-gradient(circle at 25% 20%, #fff 0%, transparent 20%), radial-gradient(circle at 70% 60%, #fff 0%, transparent 25%)",
          backgroundSize: "180px 180px, 220px 220px",
          mixBlendMode: "soft-light",
          pointerEvents: "none",
        }}
      />

      {PAGES.map((src, index) => {
        const from = index * (PAGE_DURATION - CROSSFADE);
        return (
          <Sequence key={src} from={from} durationInFrames={PAGE_DURATION} layout="none">
            <Slide src={src} pageDuration={PAGE_DURATION} crossfade={CROSSFADE} />
          </Sequence>
        );
      })}

      {/* Decorative corner accent */}
      <div style={{position: "absolute", left: 32, bottom: 28, width: 96, height: 2, background: "#9fb0ff", opacity: 0.35}} />
    </AbsoluteFill>
  );
};

const Slide: React.FC<{src: string; pageDuration: number; crossfade: number}> = ({src, pageDuration, crossfade}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, crossfade, pageDuration - crossfade, pageDuration],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );

  // Ken Burns: scale 1.0 -> 1.04, move up 24px over the slide
  const progress = interpolate(frame, [0, pageDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const {width, height} = useVideoConfig();
  const targetW = 1280;
  const targetH = 720;
  const margin = 60;
  const scale = Math.min((width - margin * 2) / targetW, (height - margin * 2) / targetH);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: targetW,
          height: targetH,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "50% 50%",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 18px 80px rgba(0,0,0,0.5)",
          background: "#fff",
        }}
      >
        <HtmlPage
          src={src}
          opacity={opacity}
          kenBurns={{scale: 1.04, translateY: -24, progress}}
          style={{padding: 24}}
        />
      </div>
    </AbsoluteFill>
  );
};

const AnimatedGrid: React.FC<{opacity?: number}> = ({opacity = 0.08}) => {
  const frame = useCurrentFrame();
  const shift = frame * 0.4;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "70px 70px, 70px 70px",
        backgroundPosition: `${-shift}px ${-shift}px, ${shift}px ${shift}px`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};
