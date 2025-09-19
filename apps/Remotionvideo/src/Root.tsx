import React from "react";
import {Composition} from "remotion";
import {BriefingExplainer} from "./scenes/BriefingExplainer";

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const DURATION = 1580;

export const RemotionvideoRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BriefingExplainer"
        component={BriefingExplainer}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={DURATION}
        defaultProps={{}}
      />
    </>
  );
};

export {BriefingExplainer};
