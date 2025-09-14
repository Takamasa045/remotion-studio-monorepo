import React, {CSSProperties, ReactNode, useMemo, useRef} from "react";
import {useAnime, defineAnime} from "@studio/anime-bridge";
import {toAnimeEasing, EasingFunction} from "@studio/easings";

export type BaseTransitionProps = {
  frame: number; // current frame from Remotion
  fps: number;
  duration: number; // frames
  easing?: string | EasingFunction;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
};

export const FadeIn: React.FC<BaseTransitionProps> = ({
  frame,
  fps,
  duration,
  easing = "linear",
  style,
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useAnime(
    () =>
      defineAnime({
        targets: ref.current!,
        autoplay: false,
        duration: Math.max(1, Math.round((duration / fps) * 1000)),
        easing: toAnimeEasing(easing),
        opacity: [0, 1],
      }),
    {frame, fps, durationInFrames: duration, ref}
  );
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export const FadeOut: React.FC<BaseTransitionProps> = ({
  frame,
  fps,
  duration,
  easing = "linear",
  style,
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useAnime(
    () =>
      defineAnime({
        targets: ref.current!,
        autoplay: false,
        duration: Math.max(1, Math.round((duration / fps) * 1000)),
        easing: toAnimeEasing(easing),
        opacity: [1, 0],
      }),
    {frame, fps, durationInFrames: duration, ref}
  );
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export type CrossFadeProps = Omit<BaseTransitionProps, "children"> & {
  from: ReactNode;
  to: ReactNode;
  containerStyle?: CSSProperties;
};

export const CrossFade: React.FC<CrossFadeProps> = ({
  frame,
  fps,
  duration,
  easing = "linear",
  className,
  containerStyle,
  from,
  to,
}) => {
  const refA = useRef<HTMLDivElement | null>(null);
  const refB = useRef<HTMLDivElement | null>(null);

  useAnime(
    () =>
      defineAnime({
        targets: refA.current!,
        autoplay: false,
        duration: Math.max(1, Math.round((duration / fps) * 1000)),
        easing: toAnimeEasing(easing),
        opacity: [1, 0],
      }),
    {frame, fps, durationInFrames: duration, ref: refA}
  );

  useAnime(
    () =>
      defineAnime({
        targets: refB.current!,
        autoplay: false,
        duration: Math.max(1, Math.round((duration / fps) * 1000)),
        easing: toAnimeEasing(easing),
        opacity: [0, 1],
      }),
    {frame, fps, durationInFrames: duration, ref: refB}
  );

  const container: CSSProperties = useMemo(
    () => ({ position: "relative", display: "block", ...containerStyle }),
    [containerStyle]
  );
  const layer: CSSProperties = { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 };

  return (
    <div className={className} style={container}>
      <div ref={refA} style={layer}>{from}</div>
      <div ref={refB} style={layer}>{to}</div>
    </div>
  );
};

export type Direction = "left" | "right" | "up" | "down";

export type SlideInProps = BaseTransitionProps & {
  direction?: Direction;
  distance?: string | number; // e.g. '100%' or 200
};

export const SlideIn: React.FC<SlideInProps> = ({
  frame,
  fps,
  duration,
  easing = "linear",
  style,
  className,
  children,
  direction = "up",
  distance = "100%",
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [prop, start] = useMemo(() => {
    switch (direction) {
      case "left":
        return ["translateX", typeof distance === "number" ? -distance : `-${distance}`];
      case "right":
        return ["translateX", distance];
      case "down":
        return ["translateY", distance];
      case "up":
      default:
        return ["translateY", typeof distance === "number" ? -distance : `-${distance}`];
    }
  }, [direction, distance]);

  useAnime(
    () =>
      defineAnime({
        targets: ref.current!,
        autoplay: false,
        duration: Math.max(1, Math.round((duration / fps) * 1000)),
        easing: toAnimeEasing(easing),
        [prop as string]: [start as any, 0],
        opacity: [0, 1],
      }),
    {frame, fps, durationInFrames: duration, ref}
  );

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export type WipeDirection = "lr" | "rl" | "tb" | "bt"; // left->right etc.

export type WipeProps = BaseTransitionProps & {
  direction?: WipeDirection;
  backgroundColor?: string; // optional bg to avoid transparency bleeding
};

const wipeFromTo = (dir: WipeDirection): [string, string] => {
  switch (dir) {
    case "rl":
      return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
    case "tb":
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
    case "bt":
      return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
    case "lr":
    default:
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
  }
};

export const Wipe: React.FC<WipeProps> = ({
  frame,
  fps,
  duration,
  easing = "linear",
  style,
  className,
  children,
  direction = "lr",
  backgroundColor,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [from, to] = useMemo(() => wipeFromTo(direction), [direction]);

  useAnime(
    () =>
      defineAnime({
        targets: ref.current!,
        autoplay: false,
        duration: Math.max(1, Math.round((duration / fps) * 1000)),
        easing: toAnimeEasing(easing),
        clipPath: [from, to],
      }),
    {frame, fps, durationInFrames: duration, ref}
  );

  const s: CSSProperties = useMemo(
    () => ({ overflow: "hidden", backgroundColor, ...style }),
    [style, backgroundColor]
  );

  return (
    <div ref={ref} className={className} style={s}>
      {children}
    </div>
  );
};

export { toAnimeEasing } from "@studio/easings";
