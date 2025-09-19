import React, {useMemo} from "react";
import {visualizeAudio, type AudioData} from "@remotion/media-utils";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

const createSyntheticAudioData = (): AudioData => {
  const sampleRate = 44100;
  const durationInSeconds = 8;
  const totalSamples = sampleRate * durationInSeconds;
  const data = new Float32Array(totalSamples);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const bass = Math.sin(2 * Math.PI * 2 * t);
    const mid = 0.6 * Math.sin(2 * Math.PI * 8 * t + Math.PI / 3);
    const high = 0.3 * Math.sin(2 * Math.PI * 14 * t + Math.PI / 6);
    const envelope = Math.sin(Math.PI * (t / durationInSeconds));
    data[i] = (bass + mid + high) * envelope;
  }

  return {
    channelWaveforms: [data],
    sampleRate,
    durationInSeconds,
    numberOfChannels: 1,
    resultId: "synthetic-demo",
    isRemote: false,
  };
};

export const BeatVisualizer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const audioData = useMemo(createSyntheticAudioData, []);
  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 64,
    smoothing: true,
  });

  return (
    <AbsoluteFill style={{justifyContent: "flex-end", padding: "0 120px 120px", color: "#f1f6ff"}}>
      <div style={{fontSize: 26, marginBottom: 16, opacity: 0.72}}>ビート解析の疑似デモ</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(64, minmax(0, 1fr))",
          gap: 4,
          height: 220,
          background: "rgba(9, 14, 29, 0.68)",
          borderRadius: 20,
          padding: "20px 24px",
          border: "1px solid rgba(120, 160, 255, 0.12)",
          backdropFilter: "blur(14px)",
        }}
      >
        {visualization.map((amplitude, index) => {
          const height = interpolate(amplitude, [0, 1], [4, 180], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={index}
              style={{
                background: "linear-gradient(180deg, #7b9dff, #3047ff)",
                borderRadius: 8,
                alignSelf: "flex-end",
                height,
              }}
            />
          );
        })}
      </div>
      <div style={{fontSize: 22, marginTop: 20, lineHeight: 1.5, maxWidth: 760}}>
        @remotion/media-utils の visualizer を使い、フレームごとに波形を評価することで、
        キックやハイハットに合わせたエフェクトをコントロールできることを示しています。
      </div>
    </AbsoluteFill>
  );
};

export const BeatMarkers: React.FC<{beatFrames: number[]}> = ({beatFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const beatWindow = 10;

  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
      <div style={{display: "flex", gap: 16}}>
        {beatFrames.map((beat) => {
          const delta = Math.abs(frame - beat);
          const scale = interpolate(delta, [0, beatWindow], [1.2, 0.8], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(delta, [0, beatWindow], [1, 0.2], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={beat}
              style={{
                width: 120,
                height: 120,
                borderRadius: 24,
                border: "2px solid rgba(84, 156, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${scale})`,
                opacity,
                transition: "transform 0.2s linear",
              }}
            >
              <div style={{fontSize: 20, fontWeight: 600}}>{Math.round((beat / fps) * 100) / 100}s</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
