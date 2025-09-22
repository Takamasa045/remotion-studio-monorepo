export const compositionId = "PlaylistMV" as const;

const width = 1920;
const height = 1080;
const fps = 60;
const durationSeconds = 145.854;

export const videoConfig = {
  width,
  height,
  fps,
  durationInFrames: Math.round(durationSeconds * fps),
} as const;

export const assets = {
  backgroundVideo: "assets/video/background-loop.mp4",
  overlayVideo: "assets/audio/preview-mixed.webm",
} as const;

export type PlaylistMVProps = {
  title: string;
};

export const defaultProps: PlaylistMVProps = {
  title: "Playlist MV",
};

