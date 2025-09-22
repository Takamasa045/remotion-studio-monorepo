export type ProjectConfig = {
  title?: string;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
};

export const projectConfig: ProjectConfig = {
  title: "Demo Showcase",
  width: 1920,
  height: 1080,
  fps: 30,
  durationInFrames: 300,
};

// remotionMCP 標準の別名を用意
export const videoConfig = projectConfig;
export const defaultProps = {} as const;
