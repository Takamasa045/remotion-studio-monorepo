// Core shared types for the Remotion studio monorepo

export type Frame = number;
export type Fps = number;
export type TimeMs = number;

export interface FrameRange {
  start: Frame;
  end: Frame; // inclusive
}

export interface Progress {
  value: number; // 0..1
  currentFrame: Frame;
  durationInFrames: Frame;
}

export interface TimelineState {
  durationInFrames: Frame;
  fps: Fps;
  currentFrame: Frame;
  isPlaying: boolean;
  playbackRate: number; // 1.0 normal speed
  range?: FrameRange;
}

export interface TimelineControls {
  play: () => void;
  pause: () => void;
  seekTo: (frame: Frame) => void;
  setFps: (fps: Fps) => void;
  setDuration: (frames: Frame) => void;
  setPlaybackRate: (rate: number) => void;
}

export type Timeline = TimelineState & TimelineControls & {
  progress: number; // derived 0..1
};

export interface CompositionConfig {
  id: string;
  width: number;
  height: number;
  fps: Fps;
  durationInFrames: Frame;
  defaultProps?: Record<string, unknown>;
  // Optional human-friendly name
  label?: string;
}

export interface Scene {
  id: string;
  name?: string;
  startFrame: Frame;
  durationInFrames: Frame;
  children?: Scene[];
  // Arbitrary metadata for tooling
  meta?: Record<string, unknown>;
}

