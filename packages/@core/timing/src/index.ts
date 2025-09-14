import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {Fps, Frame, FrameRange, Progress, Timeline} from "@studio/core-types";

export const frameToMs = (frame: Frame, fps: Fps): number => (frame / fps) * 1000;
export const msToFrame = (ms: number, fps: Fps): Frame => Math.floor((ms / 1000) * fps);

export type UseTimelineOptions = {
  durationInFrames: Frame;
  fps: Fps;
  autoplay?: boolean;
  playbackRate?: number; // 1.0 normal
  loop?: boolean;
  range?: FrameRange;
  clamp?: boolean; // clamp currentFrame to [0, duration]
};

export const useTimeline = (options: UseTimelineOptions): Timeline => {
  const {
    durationInFrames: initialDuration,
    fps: initialFps,
    autoplay = true,
    playbackRate: initialPlaybackRate = 1,
    loop = false,
    range,
    clamp = true,
  } = options;

  const [durationInFrames, setDuration] = useState<Frame>(initialDuration);
  const [fps, setFps] = useState<Fps>(initialFps);
  const [currentFrame, setCurrentFrame] = useState<Frame>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(!!autoplay);
  const [playbackRate, setPlaybackRate] = useState<number>(initialPlaybackRate);

  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  const clampFrame = useCallback(
    (f: Frame): Frame => {
      const start = range ? range.start : 0;
      const end = range ? range.end : durationInFrames - 1;
      if (!clamp) return f;
      return Math.min(Math.max(f, start), end);
    },
    [durationInFrames, clamp, range]
  );

  const tick = useCallback(
    (ts: number) => {
      if (!isPlaying) return;
      const last = lastTsRef.current;
      lastTsRef.current = ts;
      if (last == null) return;
      const deltaMs = ts - last;
      const framesToAdvance = (deltaMs / 1000) * fps * playbackRate;
      setCurrentFrame((prev) => {
        let next = prev + framesToAdvance;
        const start = range ? range.start : 0;
        const end = range ? range.end : durationInFrames - 1;
        if (loop) {
          const len = end - start + 1;
          if (len > 0) {
            // proper modulo for negative values not necessary here as we only add positive
            next = start + (((next - start) % len) + len) % len;
          }
        } else if (clamp) {
          next = Math.min(Math.max(next, start), end);
        }
        return Math.floor(next);
      });
    },
    [isPlaying, fps, playbackRate, loop, clamp, range, durationInFrames]
  );

  useEffect(() => {
    if (!isPlaying) return;
    const loopFn = (ts: number) => {
      tick(ts);
      rafRef.current = requestAnimationFrame(loopFn);
    };
    rafRef.current = requestAnimationFrame((ts) => {
      lastTsRef.current = ts;
      loopFn(ts);
    });
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [tick, isPlaying]);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const seekTo = useCallback(
    (frame: Frame) => {
      setCurrentFrame(clampFrame(frame));
    },
    [clampFrame]
  );

  const progress = useMemo(() => {
    const denom = Math.max(1, durationInFrames - 1);
    return clampFrame(currentFrame) / denom;
  }, [currentFrame, durationInFrames, clampFrame]);

  return useMemo<Timeline>(
    () => ({
      durationInFrames,
      fps,
      currentFrame,
      isPlaying,
      playbackRate,
      range,
      play,
      pause,
      seekTo,
      setFps,
      setDuration,
      setPlaybackRate,
      progress,
    }),
    [
      durationInFrames,
      fps,
      currentFrame,
      isPlaying,
      playbackRate,
      range,
      play,
      pause,
      seekTo,
      setFps,
      setDuration,
      setPlaybackRate,
      progress,
    ]
  );
};

export type UseProgressInput =
  | { timeline: Timeline }
  | { currentFrame: Frame; durationInFrames: Frame };

export const useProgress = (input: UseProgressInput): Progress => {
  return useMemo(() => {
    if ("timeline" in input) {
      const { currentFrame, durationInFrames } = input.timeline;
      const denom = Math.max(1, durationInFrames - 1);
      return {
        value: Math.min(Math.max(currentFrame / denom, 0), 1),
        currentFrame,
        durationInFrames,
      };
    }
    const { currentFrame, durationInFrames } = input;
    const denom = Math.max(1, durationInFrames - 1);
    return {
      value: Math.min(Math.max(currentFrame / denom, 0), 1),
      currentFrame,
      durationInFrames,
    };
  }, [input]);
};

export type { Timeline, FrameRange, Progress } from "@studio/core-types";
