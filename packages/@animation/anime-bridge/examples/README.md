# @studio/anime-bridge Examples

```tsx
import {useAnime, defineAnime} from '@studio/anime-bridge';

export const TitleIn = ({frame, fps}: {frame: number; fps: number}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  useAnime(() => defineAnime({targets: ref.current!, opacity: [0,1], translateY: [20,0], duration: 1000}), {frame, fps, durationInFrames: 30, ref});
  return <div ref={ref}>Hello</div>;
};
```
