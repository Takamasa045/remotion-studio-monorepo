import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from "remotion";
import {McpTextSlide} from "./McpTextSlide";
import {mcpSlides} from "../content/mcp-deck";

const DURATION = 150; // frames per slide (~5s @30fps)
const CROSSFADE = 12; // frames overlap

export const McpDeck: React.FC = () => {
  return (
    <AbsoluteFill>
      {mcpSlides.map((s, i) => (
        <Sequence key={i} from={i * (DURATION - CROSSFADE)} durationInFrames={DURATION} layout="none">
          <FadeWrap duration={DURATION} crossfade={CROSSFADE}>
            <McpTextSlide title={s.title} subtitle={s.subtitle} bullets={s.bullets} accent={s.accent} />
          </FadeWrap>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const FadeWrap: React.FC<{duration: number; crossfade: number; children: React.ReactNode}> = ({duration, crossfade, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(
    frame,
    [0, crossfade, duration - crossfade, duration],
    [0, 1, 1, 0],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );
  return <div style={{opacity: o}}>{children}</div>;
};

export const MCP_DECK_DURATION = ((): number => {
  const count = mcpSlides.length;
  if (count === 0) return DURATION;
  return DURATION + (count - 1) * (DURATION - CROSSFADE);
})();

