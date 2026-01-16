import React from "react";
import {
  Composition,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LinkedParticles } from "./scenes/LinkedParticles";

// These placeholders are replaced by scripts/create-project.ts when generating a new project
const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const DURATION = 180;

const TemplateMain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0d12",
        color: "#fff",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 64, fontWeight: 800, marginBottom: 16 }}>
          New Remotion Project
        </div>
        <div style={{ fontSize: 24, opacity: 0.8 }}>
          Frame: {frame} / FPS: {fps}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="y"
        component={TemplateMain}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={DURATION}
      />
      <Composition
        id="LinkedParticles"
        component={LinkedParticles}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={DURATION}
        defaultProps={{ seed: "LinkedParticles" }}
      />
    </>
  );
};

export { TemplateMain };
