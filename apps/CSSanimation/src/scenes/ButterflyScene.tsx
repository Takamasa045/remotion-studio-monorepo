import React, {useMemo} from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";

const toDegrees = (radians: number) => (radians * 180) / Math.PI;

const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

type ButterflyProps = {
  offset: number;
  size: number;
  opacity?: number;
};

const Butterfly: React.FC<ButterflyProps> = ({offset, size, opacity = 1}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();

  const localFrame = frame - offset;
  if (localFrame < 0 || localFrame > durationInFrames) {
    return null;
  }

  const progress = localFrame / durationInFrames;

  const getPoint = (t: number) => {
    const clamped = Math.min(Math.max(t, 0), 1);
    const x = width * (0.05 + clamped * 0.9 + 0.05 * Math.sin(clamped * Math.PI * 4));
    const y = height * (0.55 + 0.2 * Math.sin(clamped * Math.PI * 2) + 0.05 * Math.sin(clamped * Math.PI * 9));
    return {x, y};
  };

  const {x, y} = getPoint(progress);
  const next = getPoint(progress + 1 / durationInFrames);
  const directionAngle = toDegrees(Math.atan2(next.y - y, next.x - x));

  const wingFlap = 25 + Math.sin(localFrame * 0.4) * 20;
  const subtleTilt = Math.sin(localFrame * 0.03) * 8;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    width: size,
    height: size,
    transform: `translate(-50%, -50%) rotate(${directionAngle + subtleTilt}deg)`,
    transformStyle: "preserve-3d",
    opacity,
  };

  const wingStyle = (side: "left" | "right"): React.CSSProperties => ({
    position: "absolute",
    top: "50%",
    left: "50%",
    width: size * 0.8,
    height: size * 0.9,
    borderRadius: side === "left" ? "70% 100% 50% 80%" : "100% 70% 80% 50%",
    background: "radial-gradient(circle at 20% 20%, #fef6ff, #f4a9ff 40%, #7f3bff 85%)",
    transformOrigin: side === "left" ? "100% 50%" : "0% 50%",
    transform: `translateY(-50%) rotate(${side === "left" ? -wingFlap : wingFlap}deg)`
      + ` scale(${side === "left" ? 1 : -1}, 1)`
      + ` translateX(${side === "left" ? -size * 0.05 : size * 0.05}px)`,
    boxShadow: "0 12px 25px rgba(127, 59, 255, 0.35)",
  });

  const bodyStyle: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: size * 0.12,
    height: size * 0.9,
    background: "linear-gradient(180deg, #2e0f36, #4a1460)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: "0 0 20px rgba(127, 59, 255, 0.4)",
  };

  const antennaStyle: React.CSSProperties = {
    position: "absolute",
    top: "15%",
    left: "50%",
    width: size * 0.02,
    height: size * 0.4,
    background: "linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0))",
    transform: "translateX(-50%) rotate(-8deg)",
    borderRadius: "50%",
  };

  const antennaRightStyle: React.CSSProperties = {
    ...antennaStyle,
    transform: "translateX(-50%) rotate(8deg)",
  };

  return (
    <div style={baseStyle}>
      <div style={wingStyle("left")} />
      <div style={wingStyle("right")} />
      <div style={bodyStyle} />
      <div style={antennaStyle} />
      <div style={antennaRightStyle} />
    </div>
  );
};

export const ButterflyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();

  const trails = [0, 12, 24];

  const particles = useMemo(() => {
    return Array.from({length: 40}).map((_, index) => {
      const pr = pseudoRandom(index + 1);
      const pr2 = pseudoRandom(index + 42);
      return {
        x: pr * width,
        y: pr2 * height,
        size: 4 + pseudoRandom(index + 84) * 12,
        speedFactor: 0.5 + pseudoRandom(index + 123) * 1.5,
      };
    });
  }, [width, height]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #04070e 0%, #1b0735 40%, #321c5a 100%)",
        overflow: "hidden",
      }}
    >
      <AbsoluteFill
        style={{
          background: "radial-gradient(circle at 20% 20%, rgba(255, 167, 241, 0.25), transparent 55%)",
        }}
      />
      <AbsoluteFill>
        {particles.map((particle, index) => {
          const offset = (frame / durationInFrames) * Math.PI * particle.speedFactor;
          const driftX = Math.sin(offset + index) * 40;
          const driftY = Math.cos(offset * 0.7 + index) * 30;
          const twinkle = 0.3 + Math.abs(Math.sin(frame * 0.05 + index)) * 0.7;
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: particle.x + driftX,
                top: particle.y + driftY,
                width: particle.size,
                height: particle.size,
                borderRadius: "50%",
                background: "rgba(255, 208, 255, 0.8)",
                opacity: Math.min(1, twinkle),
                filter: "blur(0.5px)",
              }}
            />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
        <div
          style={{
            color: "rgba(255, 233, 255, 0.85)",
            fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
            letterSpacing: 8,
            fontSize: width * 0.04,
            textTransform: "uppercase",
            textAlign: "center",
            pointerEvents: "none",
            textShadow: "0 0 20px rgba(255, 198, 255, 0.6)",
          }}
        >
          Dream Flight
        </div>
      </AbsoluteFill>
      {trails.map((trail, index) => (
        <Butterfly key={index} offset={trail} size={140 - index * 15} opacity={1 - index * 0.28} />
      ))}
    </AbsoluteFill>
  );
};

export default ButterflyScene;
