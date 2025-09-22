import React from "react";
import {Composition} from "remotion";
import {AnimeTitle} from "./compositions/AnimeTitle";
import {PixiBubbles} from "./compositions/PixiBubbles";
import {ThreeLogo} from "./compositions/ThreeLogo";
import {AudioBars} from "./compositions/AudioBars";
import {ChartReveal} from "./compositions/ChartReveal";

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="AnimeTitle"
        component={AnimeTitle}
        durationInFrames={150}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
      />
      <Composition
        id="PixiBubbles"
        component={PixiBubbles}
        durationInFrames={300}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
      />
      <Composition
        id="ThreeLogo"
        component={ThreeLogo}
        durationInFrames={240}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
      />
      <Composition
        id="AudioBars"
        component={AudioBars}
        durationInFrames={300}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
      />
      <Composition
        id="ChartReveal"
        component={ChartReveal}
        durationInFrames={210}
        width={WIDTH}
        height={HEIGHT}
        fps={FPS}
      />
    </>
  );
};
