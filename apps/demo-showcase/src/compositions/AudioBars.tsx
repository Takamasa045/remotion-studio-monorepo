import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {FadeIn} from "@studio/transitions";

export const AudioBars: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const bars = 64;

  const data = new Array(bars).fill(0).map((_, i) => {
    const t = (frame / fps) * 2 * Math.PI;
    const v = Math.sin(i * 0.35 + t) * 0.5 + 0.5; // 0..1
    return v ** 1.5;
  });

  const maxBarHeight = height * 0.5;
  const gap = 4;
  const barWidth = Math.max(2, Math.floor((width - (bars - 1) * gap) / bars));

  return (
    <AbsoluteFill style={{backgroundColor: "#0d0f14", color: "#fff"}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontSize: 28, opacity: 0.8}}>
        Audio Bars (dummy data)
      </div>
      <FadeIn frame={frame} fps={fps} duration={30}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{display: "flex", alignItems: "flex-end", gap}}>
            {data.map((v, idx) => (
              <div
                key={idx}
                style={{
                  width: barWidth,
                  height: Math.max(2, Math.round(v * maxBarHeight)),
                  background: "linear-gradient(180deg, #34d399, #059669)",
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

