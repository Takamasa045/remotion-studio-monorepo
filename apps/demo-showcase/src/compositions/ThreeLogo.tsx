import React, {useRef} from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {ThreeCanvas, CameraPreset, DefaultLights, useRemotionFrame} from "@studio/visual-three";

export const ThreeLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const Mesh: React.FC = () => {
    const ref = useRef<any>(null);
    useRemotionFrame(() => {
      if (!ref.current) return;
      ref.current.rotation.x += 0.02;
      ref.current.rotation.y += 0.03;
    }, []);
    return (
      // eslint-disable-next-line react/no-unknown-property
      <mesh ref={ref} position={[0, 0, 0]}>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <torusKnotGeometry args={[1, 0.35, 200, 32]} />
        {/* eslint-disable-next-line react/no-unknown-property */}
        <meshStandardMaterial color="#35d0ff" metalness={0.3} roughness={0.35} />
      </mesh>
    );
  };

  return (
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 50%, #051017, #03080c)"}}>
      <ThreeCanvas frame={frame} fps={fps} width={width} height={height} dpr={1}>
        <CameraPreset position={[0, 0, 4]} />
        <DefaultLights />
        <Mesh />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

