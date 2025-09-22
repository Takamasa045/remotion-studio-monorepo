import React, {useMemo} from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export type McpTextSlideProps = {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  accent?: string; // hex for accent color
  bg?: string; // background gradient CSS
};

const defaultProps: Required<McpTextSlideProps> = {
  title: "RemotionMCP",
  subtitle: "Modular Composition Pipeline",
  bullets: [
    "Declarative timeline with reusable scenes",
    "Data-driven props and automation",
    "Consistent motion system and themes",
  ],
  accent: "#8aa2ff",
  bg: "radial-gradient(1200px 800px at 20% 20%, #151926, #0b0d12)",
};

export const McpTextSlide: React.FC<McpTextSlideProps> = (p) => {
  const props = {...defaultProps, ...p};
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    durationInFrames: 45,
    damping: 200,
    stiffness: 120,
  });

  const pulse = interpolate(Math.sin(frame / 22), [-1, 1], [0.96, 1.04]);
  const s = Math.min(width, height);
  const titleSize = Math.round(s * 0.095); // 約10%の大きさ
  const subSize = Math.round(s * 0.035);
  const bulletSize = Math.round(s * 0.032);
  const pad = Math.round(s * 0.075);

  return (
    <AbsoluteFill
      style={{
        background: props.bg,
        color: "#e9eeff",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
      }}
    >
      <AnimatedGrid opacity={0.12} />
      {/* ambient blobs */}
      <Blob left="-10%" top="-20%" size={Math.round(s * 0.5)} color="#2c3352" opacity={0.55} drift={0.6} />
      <Blob right="-12%" bottom="-18%" size={Math.round(s * 0.62)} color="#1f2440" opacity={0.5} drift={0.8} />
      <Stripe corner="tr" color={props.accent!} />
      <Stripe corner="bl" color="#5c6cd4" delay={40} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: pad,
          display: "grid",
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        <div style={{width: "92%", maxWidth: Math.round(width * 0.96), position: "relative"}}>
          <RotatingRing size={Math.round(s * 0.9)} thickness={2} color={props.accent!} />
          <div style={{position: "relative", zIndex: 2}}>
            <GradientTitle text={props.title} accent={props.accent!} progress={entrance} size={titleSize} />
            {props.subtitle && <Subtitle text={props.subtitle} delay={12} size={subSize} />}
            {props.bullets && props.bullets.length > 0 && (
              <BulletList items={props.bullets} accent={props.accent!} startDelay={24} size={bulletSize} />
            )}
          </div>
        </div>
      </div>

      {/* corner rule */}
      <div style={{position: "absolute", left: pad, bottom: Math.round(pad * 0.8), width: 160, height: 2, background: props.accent, opacity: 0.5}} />
    </AbsoluteFill>
  );
};

const GradientTitle: React.FC<{text: string; accent: string; progress: number; size: number}> = ({text, accent, progress, size}) => {
  const chars = useMemo(() => text.split(""), [text]);
  return (
    <div style={{display: "flex", flexWrap: "wrap", gap: 12, alignItems: "baseline", justifyContent: "center", textAlign: "center"}}>
      <div style={{display: "flex", flexWrap: "wrap"}}>
        {chars.map((ch, i) => (
          <Char key={i} index={i} total={chars.length} progress={progress} accent={accent} size={size}>
            {ch}
          </Char>
        ))}
      </div>
    </div>
  );
};

const Char: React.FC<{index: number; total: number; progress: number; accent: string; size: number; children: React.ReactNode}> = ({index, total, progress, accent, size, children}) => {
  const local = interpolate(
    progress,
    [0, 0.2, 1],
    [0, 1, 1],
    {extrapolateLeft: "clamp", extrapolateRight: "clamp"}
  );
  const delay = index * 0.02; // 20ms per char in progress space
  const show = Math.max(0, Math.min(1, local - delay));
  const y = interpolate(show, [0, 1], [24, 0], {easing: Easing.out(Easing.cubic)});
  const o = show;

  return (
    <span
      style={{
        fontWeight: 800,
        fontSize: size,
        letterSpacing: 1.2,
        lineHeight: 1.02,
        display: "inline-block",
        transform: `translateY(${y}px)`,
        opacity: o,
        backgroundImage: `linear-gradient(90deg, ${accent}, #e5f0ff)`,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        textShadow: "0 6px 30px rgba(28,40,88,0.45)",
      }}
    >
      {children}
    </span>
  );
};

const Subtitle: React.FC<{text: string; delay?: number; size?: number}> = ({text, delay = 0, size = 28}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, durationInFrames: 35});
  const y = interpolate(s, [0, 1], [16, 0], {easing: Easing.out(Easing.cubic)});
  const o = s;
  return (
    <div
      style={{
        marginTop: 16,
        fontSize: size,
        letterSpacing: 0.5,
        opacity: o,
        transform: `translateY(${y}px)`,
        color: "#b6c4ff",
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};

const BulletList: React.FC<{items: string[]; accent: string; startDelay?: number; size?: number}> = ({items, accent, startDelay = 0, size = 24}) => {
  const columns = items.length >= 4 ? 2 : 1;
  const gap = 16;
  return (
    <div
      style={{
        marginTop: 28,
        display: "grid",
        gap,
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        alignItems: "start",
      }}
    >
      {items.map((t, i) => (
        <Bullet key={i} text={t} accent={accent} delay={startDelay + i * 5} size={size} />
      ))}
    </div>
  );
};

const Bullet: React.FC<{text: string; accent: string; delay?: number; size?: number}> = ({text, accent, delay = 0, size = 24}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, durationInFrames: 30});
  const x = interpolate(s, [0, 1], [14, 0], {easing: Easing.out(Easing.cubic)});
  const o = s;
  return (
    <div style={{display: "flex", alignItems: "flex-start", gap: 14, opacity: o, transform: `translateX(${x}px)`}}>
      <div style={{marginTop: 8, width: 12, height: 12, borderRadius: 999, background: accent, boxShadow: `0 0 0 8px rgba(138,162,255,0.12)`}} />
      <div style={{fontSize: size, color: "#d7deff", lineHeight: 1.38}}>{text}</div>
    </div>
  );
};

const Blob: React.FC<
  ({left?: string; right?: string; top?: string; bottom?: string} & {size: number; color: string; opacity: number; drift?: number})
> = ({size, color, opacity, drift = 1, ...pos}) => {
  const frame = useCurrentFrame();
  const t = frame / 120;
  const dx = Math.sin(t * drift) * 12;
  const dy = Math.cos(t * 0.7 * drift) * 10;
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size,
        background: color,
        filter: "blur(60px)",
        opacity,
        transform: `translate(${dx}px, ${dy}px) scale(${interpolate(Math.sin(t), [-1,1], [0.98,1.02])})`,
        ...pos,
      }}
    />
  );
};

const AnimatedGrid: React.FC<{opacity?: number}> = ({opacity = 0.1}) => {
  const frame = useCurrentFrame();
  const shift = frame * 0.4;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "60px 60px, 60px 60px",
        backgroundPosition: `${-shift}px ${-shift}px, ${shift}px ${shift}px`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const RotatingRing: React.FC<{size: number; thickness?: number; color: string}> = ({size, thickness = 2, color}) => {
  const frame = useCurrentFrame();
  const rot = frame * 0.2;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
        borderRadius: size,
        border: `${thickness}px solid rgba(255,255,255,0.08)`,
        boxShadow: `inset 0 0 0 ${Math.max(1, Math.floor(thickness/2))}px rgba(255,255,255,0.04)`,
        filter: "blur(0.3px)",
        opacity: 0.35,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: size,
          borderTop: `${thickness}px solid ${color}`,
          borderLeft: `${thickness}px solid transparent`,
          borderRight: `${thickness}px solid transparent`,
          borderBottom: `${thickness}px solid transparent`,
        }}
      />
    </div>
  );
};

const Stripe: React.FC<{corner: "tr" | "bl"; color: string; delay?: number}> = ({corner, color, delay = 0}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - delay);
  const move = interpolate(Math.sin(t / 35), [-1, 1], [-30, 30]);
  const base = {
    position: "absolute" as const,
    width: 240,
    height: 240,
    opacity: 0.25,
    transform: `translate(${move}px, ${-move}px) rotate(45deg)`,
    backgroundImage: `repeating-linear-gradient(90deg, ${color}, ${color} 6px, transparent 6px, transparent 14px)`,
    filter: "blur(0.2px)",
  };
  if (corner === "tr") {
    return <div style={{...base, right: -40, top: -40}} />;
  }
  return <div style={{...base, left: -40, bottom: -40}} />;
};
