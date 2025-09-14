# @studio/visual-canvas2d Examples

```tsx
import {usePixiScene} from '@studio/visual-canvas2d';

export const Bubbles = ({frame, width, height}: any) => {
  const {canvasRef} = usePixiScene({frame, width, height, onFrame: (app) => {/* draw */}});
  return <canvas ref={canvasRef} />;
};
```

