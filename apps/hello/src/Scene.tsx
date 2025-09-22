import React from 'react';
import {Sequence} from 'remotion';
import {Hello, HelloJs} from '@visual/hello';
import type {HelloProps} from './Root';

export const Scene: React.FC<HelloProps> = (p) => {
  return (
    <>
      {/* Cut1: CSS版 */}
      <Sequence from={0} durationInFrames={75}>
        <Hello {...p} />
      </Sequence>

      {/* Cut2: JS版 */}
      <Sequence from={75} durationInFrames={75}>
        <HelloJs {...p} text="Hello Remotion! (JS版)" color="#16a34a" speed={2} delay={300}/>
      </Sequence>
    </>
  );
};
