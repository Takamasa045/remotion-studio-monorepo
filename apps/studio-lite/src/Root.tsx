import React from "react";
import {Composition} from "remotion";
import {Intro} from "./compositions/Intro";
import {compositionId, defaultProps, video} from "./project.config";

export const Root: React.FC = () => {
  return (
    <Composition
      id={compositionId}
      component={Intro}
      width={video.width}
      height={video.height}
      fps={video.fps}
      durationInFrames={video.durationInFrames}
      defaultProps={defaultProps}
    />
  );
};
