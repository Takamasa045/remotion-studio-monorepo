# @studio/timing Examples

```tsx
import {useTimeline, useProgress, frameToMs} from '@studio/timing';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export const Example = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tl = useTimeline({durationInFrames: 180, fps, autoplay: false});
  React.useEffect(() => tl.seekTo(frame), [frame]);
  const progress = useProgress({timeline: tl});
  return <div>Progress: {(progress.value*100).toFixed(1)}%</div>;
};
```
