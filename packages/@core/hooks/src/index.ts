import {useEffect, useMemo, useRef, useState} from "react";
import type {Fps, Frame} from "@studio/core-types";

export type RAFCallback = (dt: number, ts: number) => void;

export const useAnimationFrame = (cb: RAFCallback, enabled: boolean = true) => {
  const cbRef = useRef(cb);
  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  useEffect(() => {
    if (!enabled) return;
    const loop = (ts: number) => {
      const last = lastRef.current;
      lastRef.current = ts;
      const dt = last == null ? 0 : ts - last;
      cbRef.current(dt, ts);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastRef.current = null;
    };
  }, [enabled]);
};

export type UseMediaTimingResult = {
  time: number; // seconds
  frame: Frame;
  durationFrames: Frame | null;
  isPlaying: boolean;
  playbackRate: number;
};

export const useMediaTiming = (
  media: HTMLMediaElement | null | undefined,
  fps: Fps
): UseMediaTimingResult => {
  const playingRef = useRef(false);
  const rateRef = useRef(1);
  const [state, setState] = useState<UseMediaTimingResult>(() => ({
    time: 0,
    frame: 0,
    durationFrames: null,
    isPlaying: false,
    playbackRate: 1,
  }));

  useEffect(() => {
    if (!media) return;
    const onPlay = () => (playingRef.current = true);
    const onPause = () => (playingRef.current = false);
    const onRate = () => (rateRef.current = media.playbackRate || 1);
    const onLoaded = () => {
      setState((prev) => ({
        ...prev,
        time: media.currentTime || 0,
        frame: Math.floor((media.currentTime || 0) * fps),
        durationFrames:
          media.duration != null && isFinite(media.duration)
            ? Math.floor(media.duration * fps)
            : null,
      }));
    };
    media.addEventListener("play", onPlay);
    media.addEventListener("playing", onPlay);
    media.addEventListener("pause", onPause);
    media.addEventListener("ratechange", onRate);
    media.addEventListener("loadedmetadata", onLoaded);
    // init values
    onRate();
    onLoaded();
    return () => {
      media.removeEventListener("play", onPlay);
      media.removeEventListener("playing", onPlay);
      media.removeEventListener("pause", onPause);
      media.removeEventListener("ratechange", onRate);
      media.removeEventListener("loadedmetadata", onLoaded);
    };
  }, [media, fps]);

  useAnimationFrame(() => {
    const time = media?.currentTime ?? 0;
    const duration = media?.duration ?? null;
    const durationFrames = duration != null && isFinite(duration) ? Math.floor(duration * fps) : null;
    const frame = Math.floor(time * fps);
    const next: UseMediaTimingResult = {
      time,
      frame,
      durationFrames,
      isPlaying: playingRef.current,
      playbackRate: rateRef.current,
    };
    setState((prev) =>
      prev.time !== next.time ||
      prev.frame !== next.frame ||
      prev.durationFrames !== next.durationFrames ||
      prev.isPlaying !== next.isPlaying ||
      prev.playbackRate !== next.playbackRate
        ? next
        : prev
    );
  }, true);

  return state;
};

// Re-export base types for convenience
export type {Fps, Frame} from "@studio/core-types";
