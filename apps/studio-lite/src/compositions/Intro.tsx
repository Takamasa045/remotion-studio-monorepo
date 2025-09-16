import React from "react";
import {AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import type {IntroProps} from "../project.config";

const Background: React.FC<{accentColor: string}> = ({accentColor}) => (
  <AbsoluteFill
    style={{
      background: "#0b0d12",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    }}
  >
    <AbsoluteFill style={{opacity: 0.08, background: `radial-gradient(circle at center, ${accentColor}, transparent 60%)`}} />
  </AbsoluteFill>
);

const Title: React.FC<Pick<IntroProps, "title" | "accentColor" | "subtitle">> = ({title, subtitle, accentColor}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const titleSpring = spring({frame, fps, config: {damping: 200, mass: 0.6}});
  const subtitleOpacity = interpolate(frame, [15, 35], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  return (
    <div style={{textAlign: "center", position: "relative"}}>
      <div
        style={{
          fontSize: 84,
          fontWeight: 800,
          letterSpacing: -1,
          marginBottom: 24,
          transform: `translateY(${(1 - titleSpring) * 40}px)`,
        }}
      >
        {title}
      </div>
      {subtitle ? (
        <div style={{fontSize: 32, opacity: subtitleOpacity, color: "rgba(255,255,255,0.8)"}}>{subtitle}</div>
      ) : null}
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center", pointerEvents: "none"}}>
        <div
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: "50%",
            border: `2px solid ${accentColor}`,
            opacity: interpolate(frame, [0, 90], [0.4, 0], {extrapolateRight: "clamp"}),
            transform: `scale(${interpolate(frame, [0, 90], [0.65, 1.35], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })})`,
            transition: "opacity 0.3s ease",
          }}
        />
      </AbsoluteFill>
    </div>
  );
};

const Footer: React.FC<{accentColor: string}> = ({accentColor}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [90, 180], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  return (
    <div style={{position: "absolute", bottom: 120, width: "100%", display: "flex", justifyContent: "center"}}>
      <div style={{width: 600, height: 8, background: "rgba(255,255,255,0.12)", borderRadius: 999}}>
        <div style={{width: `${progress * 100}%`, height: "100%", background: accentColor, borderRadius: 999}} />
      </div>
    </div>
  );
};

export const Intro: React.FC<IntroProps> = ({title, subtitle, accentColor}) => {
  return (
    <AbsoluteFill>
      <Background accentColor={accentColor} />
      <Sequence from={10} durationInFrames={180} layout="none">
        <Title title={title} subtitle={subtitle} accentColor={accentColor} />
      </Sequence>
      <Sequence from={45}>
        <Footer accentColor={accentColor} />
      </Sequence>
    </AbsoluteFill>
  );
};
