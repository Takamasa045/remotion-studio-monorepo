import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const useSpringProgress = (delay = 0, config?: Parameters<typeof spring>[0]["config"]) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: config ?? {
      damping: 200,
      stiffness: 200,
      mass: 1.2,
    },
  });
  return progress;
};

export const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
  delay?: number;
}> = ({title, subtitle, delay = 0}) => {
  const progress = useSpringProgress(delay);
  const translateY = interpolate(progress, [0, 1], [40, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    easing: Easing.linear,
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#f5f7fa",
        padding: "0 160px",
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        <div style={{fontSize: 72, fontWeight: 800, letterSpacing: -1}}>{title}</div>
        {subtitle ? (
          <div
            style={{
              marginTop: 32,
              fontSize: 30,
              lineHeight: 1.4,
              opacity: 0.9,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

export const ParagraphBlock: React.FC<{
  heading: string;
  body: string;
  delay?: number;
}> = ({heading, body, delay = 0}) => {
  const progress = useSpringProgress(delay);
  const translateX = interpolate(progress, [0, 1], [120, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{justifyContent: "center", color: "#0b1021"}}>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.96)",
          margin: "0 140px",
          padding: "72px 80px",
          borderRadius: 36,
          boxShadow: "0 30px 80px rgba(11,16,33,0.3)",
          transform: `translateX(${translateX}px)`,
          opacity,
        }}
      >
        <div style={{fontSize: 48, fontWeight: 700, color: "#141a2a", marginBottom: 24}}>
          {heading}
        </div>
        <div style={{fontSize: 28, lineHeight: 1.55, color: "#28314f"}}>{body}</div>
      </div>
    </AbsoluteFill>
  );
};

export const BulletList: React.FC<{
  title: string;
  items: {title: string; description: string}[];
  delay?: number;
}> = ({title, items, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        color: "#f5f6fb",
        padding: "60px 140px",
      }}
    >
      <div style={{fontSize: 54, fontWeight: 800, marginBottom: 32}}>{title}</div>
      <div style={{display: "grid", gap: 24, gridTemplateColumns: "repeat(2, minmax(0, 1fr))"}}>
        {items.map((item, index) => {
          const start = delay + index * 8;
          const progress = spring({
            fps,
            frame: Math.max(0, frame - start),
            config: {
              damping: 200,
              stiffness: 150,
            },
          });
          const translateY = interpolate(progress, [0, 1], [30, 0], {
            easing: Easing.out(Easing.cubic),
            extrapolateRight: "clamp",
          });
          const opacity = interpolate(progress, [0, 1], [0, 1], {
            extrapolateRight: "clamp",
          });
          return (
            <div
              key={item.title}
              style={{
                background: "rgba(19, 27, 48, 0.72)",
                border: "1px solid rgba(160, 180, 255, 0.14)",
                padding: "32px",
                borderRadius: 28,
                transform: `translateY(${translateY}px)`,
                opacity,
                backdropFilter: "blur(10px)",
              }}
            >
              <div style={{fontSize: 28, fontWeight: 700, marginBottom: 12}}>{item.title}</div>
              <div style={{fontSize: 22, lineHeight: 1.5, opacity: 0.82}}>{item.description}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const SplitColumns: React.FC<{
  left: React.ReactNode;
  right: React.ReactNode;
  delay?: number;
}> = ({left, right, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({
    fps,
    frame: Math.max(0, frame - delay),
    config: {
      damping: 180,
      stiffness: 160,
    },
  });
  const leftX = interpolate(progress, [0, 1], [-80, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const rightX = interpolate(progress, [0, 1], [80, 0], {
    easing: Easing.out(Easing.cubic),
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{padding: "60px 120px", color: "#ededfc"}}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "center",
          opacity,
        }}
      >
        <div style={{transform: `translateX(${leftX}px)`}}>{left}</div>
        <div style={{transform: `translateX(${rightX}px)`}}>{right}</div>
      </div>
    </AbsoluteFill>
  );
};
