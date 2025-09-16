export const compositionId = "Intro" as const;

export const video = {
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 210,
} as const;

export type IntroProps = {
  title: string;
  subtitle?: string;
  accentColor: string;
};

export const defaultProps: IntroProps = {
  title: "Remotion Studio Lite",
  subtitle: "Minimal starter ready for quick edits",
  accentColor: "#5b6bff",
};
