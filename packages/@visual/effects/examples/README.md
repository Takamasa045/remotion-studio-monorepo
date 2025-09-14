# @studio/visual-effects Examples

```tsx
import {BlurEffect, GlitchEffect, GlowEffect} from '@studio/visual-effects';

export const Effects = ({frame, fps, width, height}: any) => (
  <>
    <BlurEffect width={width} height={height} frame={frame} fps={fps} strength={2} />
    <GlitchEffect width={width} height={height} frame={frame} fps={fps} strength={1} />
    <GlowEffect width={width} height={height} frame={frame} fps={fps} strength={1} />
  </>
);
```

