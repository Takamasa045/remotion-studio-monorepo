# @studio/core-hooks Examples

```tsx
import {useAnimationFrame, useMediaTiming} from '@studio/core-hooks';

export const RAFExample = () => {
  const [count, setCount] = React.useState(0);
  useAnimationFrame((dt) => setCount((c) => c + dt), true);
  return <div>Elapsed ms ~ {Math.round(count)}</div>;
};
```

