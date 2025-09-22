import React from "react";
import {Composition, AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {projectConfig} from "./project.config";
import {RemotionPages, calcTotalDuration, PAGES_COUNT} from "./scenes/RemotionPages";
import {McpTextSlide} from "./scenes/McpTextSlide";
import {McpDeck, MCP_DECK_DURATION} from "./scenes/McpDeck";

// These placeholders are replaced by scripts/create-project.ts when generating a new project
const WIDTH = projectConfig.width;
const HEIGHT = projectConfig.height;
const FPS = projectConfig.fps;
const DURATION = projectConfig.durationInFrames;

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
      <Composition id="Main" component={TemplateMain} width={WIDTH} height={HEIGHT} fps={FPS} durationInFrames={DURATION} />
      <Composition
        id="RemotionPages"
        component={RemotionPages}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={calcTotalDuration(PAGES_COUNT)}
      />
      <Composition
        id="McpSlide"
        component={McpTextSlide}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={240}
        defaultProps={{
          title: "RemotionMCP",
          subtitle: "Modular Composition Pipeline",
          bullets: [
            "Build slides as composable React scenes",
            "Drive content from data and props",
            "Consistent motion, clean design, fast renders",
          ],
        }}
      />
      <Composition
        id="McpDeck"
        component={McpDeck}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={MCP_DECK_DURATION}
      />
    </>
  );
};
export {TemplateMain};
