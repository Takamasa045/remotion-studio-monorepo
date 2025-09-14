import {useEffect, useMemo, useRef, useState} from "react";

// Minimal Anime.js types (avoids requiring external type packages)
export type AnimeEasing = string | ((t: number) => number);
export type AnimeParams = Record<string, unknown> & {
  targets?: any;
  duration?: number; // ms
  easing?: AnimeEasing;
  autoplay?: boolean;
};

export type AnimeInstance = {
  seek: (time: number) => void;
  pause: () => void;
  play: () => void;
  restart?: () => void;
  reset?: () => void;
  finished?: Promise<void>;
  duration: number; // ms
};

// Consumers must have animejs installed (peerDependency).
// Lazy require to avoid TS resolution errors when not installed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _anime: any | null = null;
const anime = () => {
  if (!_anime) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const lib = require("animejs");
      _anime = lib?.default ?? lib;
    } catch (e) {
      console.warn("animejs is not installed. Using a no-op stub.");
      _anime = (params: AnimeParams) => ({
        seek: () => void 0,
        pause: () => void 0,
        play: () => void 0,
        duration: typeof params.duration === 'number' ? params.duration : 1000,
      });
    }
  }
  return _anime as (params: AnimeParams) => AnimeInstance;
};

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export type AnimeControllerOptions = {
  fps: number;
  durationInFrames: number;
  loop?: boolean;
};

export type AnimeController = {
  attach: (instance: AnimeInstance | null) => void;
  setFrame: (frame: number) => void;
  setProgress: (progress01: number) => void;
  play: () => void;
  pause: () => void;
  getInstance: () => AnimeInstance | null;
  getProgress: () => number;
};

export const createAnimeController = ({
  fps,
  durationInFrames,
  loop = false,
}: AnimeControllerOptions): AnimeController => {
  let inst: AnimeInstance | null = null;
  let progress = 0; // 0..1

  const seek = (p: number) => {
    progress = clamp01(p);
    const i = inst;
    if (!i || !Number.isFinite(i.duration)) return;
    const time = i.duration * progress;
    i.seek(time);
  };

  return {
    attach: (i) => {
      inst = i;
      if (inst) {
        // ensure paused; controller drives the playhead via seek
        try { inst.pause(); } catch {}
        seek(progress);
      }
    },
    setFrame: (frame: number) => {
      const total = Math.max(1, durationInFrames);
      const p0 = frame / total;
      let p = p0;
      if (loop) {
        p = ((p % 1) + 1) % 1;
      } else {
        p = clamp01(p);
      }
      seek(p);
    },
    setProgress: (p: number) => seek(p),
    play: () => {
      inst?.play();
    },
    pause: () => {
      inst?.pause();
    },
    getInstance: () => inst,
    getProgress: () => progress,
  };
};

export type UseAnimeOptions = {
  frame: number;
  fps: number;
  durationInFrames: number;
  loop?: boolean;
  autoplay?: boolean; // Anime's internal autoplay, defaults to false because controller seeks
  ref?: React.RefObject<HTMLElement | SVGElement | null>;
};

export type UseAnimeResult = {
  ref: React.RefObject<HTMLElement | SVGElement | null>;
  instance: AnimeInstance | null;
  controller: AnimeController;
  progress: number;
};

/**
 * React hook to control Anime.js by Remotion frame.
 * Usage: const {ref} = useAnime(() => ({ opacity: [0,1] }), { frame, fps, durationInFrames })
 */
export const useAnime = (
  definition: AnimeParams | (() => AnimeParams),
  options: UseAnimeOptions
): UseAnimeResult => {
  const {frame, fps, durationInFrames, loop = false, autoplay = false} = options;
  const autoRef = useRef<HTMLElement | SVGElement | null>(null);
  const ref = options.ref ?? autoRef;

  const controller = useMemo(
    () => createAnimeController({fps, durationInFrames, loop}),
    [fps, durationInFrames, loop]
  );

  const [instance, setInstance] = useState<AnimeInstance | null>(null);

  useEffect(() => {
    const params = typeof definition === "function" ? (definition as () => AnimeParams)() : definition;
    const targets = params.targets ?? ref.current ?? undefined;
    if (!targets) return;
    const i = anime()({
      ...params,
      targets,
      autoplay,
    });
    setInstance(i);
    controller.attach(i);
    return () => {
      // attempt to pause and reset when unmounting
      try { i.pause(); } catch {}
      try { i.reset?.(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definition, ref, autoplay]);

  useEffect(() => {
    controller.setFrame(frame);
  }, [frame, controller]);

  return {
    ref,
    instance,
    controller,
    progress: clamp01(durationInFrames > 0 ? frame / durationInFrames : 0),
  };
};

// Helper to define anime params with preserved typing
export const defineAnime = <T extends AnimeParams>(params: T) => params;

export type {AnimeParams as AnimeDefinition};
