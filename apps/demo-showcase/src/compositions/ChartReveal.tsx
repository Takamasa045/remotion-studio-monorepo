import React from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {useTimeline} from "@studio/timing";
import {FadeIn} from "@studio/transitions";

const dataset = [12, 25, 18, 35, 30, 22, 28, 40];

export const ChartReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const duration = 210;
  const tl = useTimeline({durationInFrames: duration, fps, autoplay: false});
  React.useEffect(() => tl.seekTo(frame), [tl, frame]);

  const padding = 120;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  const maxVal = Math.max(...dataset);
  const barW = Math.floor(chartWidth / dataset.length) - 16;

  const progress = tl.progress; // 0..1
  const revealedCount = Math.floor(progress * dataset.length + 0.0001);

  return (
    <AbsoluteFill style={{backgroundColor: "#0b0d12", color: "#fff", fontFamily: "system-ui, sans-serif"}}>
      <div style={{position: "absolute", top: 50, left: 60, fontSize: 36, fontWeight: 700}}>Chart Reveal</div>
      <FadeIn frame={frame} fps={fps} duration={30}>
        <div style={{position: "absolute", left: padding, top: padding, width: chartWidth, height: chartHeight}}>
          <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: 2, background: "#1f2937"}} />
          {dataset.map((v, i) => {
            const h = Math.round((v / maxVal) * (chartHeight - 20));
            const x = i * (barW + 16);
            const visible = i < revealedCount;
            const scale = visible ? 1 : Math.max(0, progress * dataset.length - i);
            return (
              <div key={i} style={{position: "absolute", left: x, bottom: 0, width: barW}}>
                <div style={{
                  height: Math.max(2, Math.round(h * Math.min(1, Math.max(0, scale)))),
                  background: "linear-gradient(180deg,#60a5fa,#2563eb)",
                  borderRadius: 4,
                  transition: "height 0.1s",
                }} />
                <div style={{marginTop: 8, textAlign: "center", fontSize: 14, opacity: 0.8}}>{v}</div>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

