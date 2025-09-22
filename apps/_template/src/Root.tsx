import React from "react";
import {Composition, AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";

// These placeholders are replaced by scripts/create-project.ts when generating a new project
const WIDTH = __WIDTH__;
const HEIGHT = __HEIGHT__;
const FPS = __FPS__;
const DURATION = __DURATION__;

const TemplateMain: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", background: "#0b0d12", color: "#fff"}}>
      <div style={{textAlign: "center"}}>
        <div style={{fontSize: 64, fontWeight: 800, marginBottom: 16}}>New Remotion Project</div>
        <div style={{fontSize: 24, opacity: 0.8}}>Frame: {frame} / FPS: {fps}</div>
      </div>
    </AbsoluteFill>
  );
};

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="TemplateMain" component={TemplateMain} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={DURATION} />
    </>
  );
};
export {TemplateMain};
