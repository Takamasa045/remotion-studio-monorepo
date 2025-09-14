import React, {useRef} from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {useAnime, defineAnime} from "@studio/anime-bridge";
import {FadeIn} from "@studio/transitions";
import {useTimeline} from "@studio/timing";

export const AnimeTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  // Local timeline example (optional). Keep in sync with global frame.
  const tl = useTimeline({durationInFrames: 150, fps, autoplay: false});
  React.useEffect(() => tl.seekTo(frame), [tl, frame]);

  const titleRef = useRef<HTMLDivElement | null>(null);
  useAnime(
    () =>
      defineAnime({
        targets: titleRef.current!,
        autoplay: false,
        duration: Math.round((45 / fps) * 1000),
        easing: "easeOutExpo",
        translateY: [40, 0],
        opacity: [0, 1],
        scale: [0.95, 1],
        letterSpacing: ["-4px", "0px"],
      }),
    {frame, fps, durationInFrames: 45, ref: titleRef}
  );

  const subtitleRef = useRef<HTMLDivElement | null>(null);
  useAnime(
    () =>
      defineAnime({
        targets: subtitleRef.current!,
        autoplay: false,
        duration: Math.round((60 / fps) * 1000),
        easing: "easeOutQuad",
        translateY: [20, 0],
        opacity: [0, 1],
      }),
    {frame: Math.max(0, frame - 15), fps, durationInFrames: 60, ref: subtitleRef}
  );

  return (
    <AbsoluteFill style={{justifyContent: "center", alignItems: "center", backgroundColor: "#0b0d12"}}>
      <FadeIn frame={frame} fps={fps} duration={30}>
        <div style={{textAlign: "center", color: "#fff"}}>
          <div ref={titleRef} style={{fontSize: 96, fontWeight: 800, lineHeight: 1, marginBottom: 24}}>
            Remotion Studio
          </div>
          <div ref={subtitleRef} style={{fontSize: 36, opacity: 0.85}}>
            Motion Graphics & Visual Playground
          </div>
        </div>
      </FadeIn>
    </AbsoluteFill>
  );
};

