# @studio/transitions Examples

```tsx
import {FadeIn, SlideIn} from '@studio/transitions';

export const Demo = ({frame, fps}: {frame: number; fps: number}) => (
  <FadeIn frame={frame} fps={fps} duration={30}>
    <SlideIn frame={frame} fps={fps} duration={45} direction="up">
      <div>Content</div>
    </SlideIn>
  </FadeIn>
);
```
