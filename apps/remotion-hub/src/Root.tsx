import React from "react";
import {Folder} from "remotion";
import {RemotionvideoRoot} from "../../Remotionvideo/src/Root";
import {CSSanimationRoot} from "../../CSSanimation/src/Root";

export const RemotionHubRoot: React.FC = () => {
  return (
    <>
      <Folder name="remotionvideo">
        <RemotionvideoRoot />
      </Folder>
      <Folder name="css-animation">
        <CSSanimationRoot />
      </Folder>
    </>
  );
};
