export type EasingFn = (t: number) => number;

export const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// Cubic Bezier implementation adapted for small footprint
// Returns a function mapping [0,1] -> [0,1]
export const cubicBezier = (p0x: number, p0y: number, p1x: number, p1y: number): EasingFn => {
  const cx = 3 * p0x;
  const bx = 3 * (p1x - p0x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p0y;
  const by = 3 * (p1y - p0y) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;

  const solveT = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleX(t) - x;
      const d = sampleDX(t);
      if (Math.abs(x2) < 1e-6 || d === 0) return t;
      t = t - x2 / d;
    }
    return t;
  };

  return (x: number) => clamp01(sampleY(solveT(clamp01(x))));
};

// Common easings
export const linear: EasingFn = (t) => t;
export const quadIn: EasingFn = (t) => t * t;
export const quadOut: EasingFn = (t) => 1 - (1 - t) * (1 - t);
export const quadInOut: EasingFn = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const cubicIn: EasingFn = (t) => t * t * t;
export const cubicOut: EasingFn = (t) => 1 - Math.pow(1 - t, 3);
export const cubicInOut: EasingFn = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const expoIn: EasingFn = (t) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1)));
export const expoOut: EasingFn = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const expoInOut: EasingFn = (t) =>
  t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
export const sineIn: EasingFn = (t) => 1 - Math.cos((t * Math.PI) / 2);
export const sineOut: EasingFn = (t) => Math.sin((t * Math.PI) / 2);
export const sineInOut: EasingFn = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

export const makeIn = (fn: EasingFn): EasingFn => (t) => fn(t);
export const makeOut = (fn: EasingFn): EasingFn => (t) => 1 - fn(1 - t);
export const makeInOut = (fn: EasingFn): EasingFn => (t) => (t < 0.5 ? fn(t * 2) / 2 : 1 - fn((1 - t) * 2) / 2);

// Convert our easing to Anime.js custom easing function
export const toAnimeEasing = (easing: string | EasingFn): string | ((t: number) => number) => {
  if (typeof easing === "string") return easing;
  return (t: number) => clamp01(easing(clamp01(t)));
};

export const Easings = {
  linear,
  quadIn,
  quadOut,
  quadInOut,
  cubicIn,
  cubicOut,
  cubicInOut,
  expoIn,
  expoOut,
  expoInOut,
  sineIn,
  sineOut,
  sineInOut,
  cubicBezier,
};

export type { EasingFn as EasingFunction };

