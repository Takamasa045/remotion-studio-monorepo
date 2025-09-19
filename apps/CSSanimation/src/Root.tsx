import React from "react";
import {Composition} from "remotion";
import {ButterflyScene} from "./scenes/ButterflyScene";

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const DURATION = 180;

export const CSSanimationRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ButterflyMain"
        component={ButterflyScene}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
        durationInFrames={DURATION}
      />
    </>
  );
};

export {ButterflyScene};
