# @studio/visual-three Examples

```tsx
import {ThreeCanvas, CameraPreset, DefaultLights, useRemotionFrame} from '@studio/visual-three';

const SpinningBox = () => {
  const ref = React.useRef<any>(null);
  useRemotionFrame(() => { if (ref.current) ref.current.rotation.y += 0.03; }, []);
  return (
    // eslint-disable-next-line react/no-unknown-property
    <mesh ref={ref}>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <boxGeometry args={[1,1,1]} />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <meshStandardMaterial color="#34d399" />
    </mesh>
  );
};

export const Scene = ({frame, fps}: any) => (
  <ThreeCanvas frame={frame} fps={fps} width={1280} height={720}>
    <CameraPreset />
    <DefaultLights />
    <SpinningBox />
  </ThreeCanvas>
);
```

