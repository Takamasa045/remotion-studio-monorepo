import {registerRoot} from 'remotion';
import React from 'react';
import {Composition} from 'remotion';

const Hello: React.FC = () => (
  <div style={{fontSize: 80, display:'flex', alignItems:'center', justifyContent:'center', height:'100%'}}>
    Hello Remotion 👋
  </div>
);

const Root: React.FC = () => (
  <>
    <Composition
      id="Hello"
      component={Hello}
      durationInFrames={150}
      fps={30}
      width={1280}
      height={720}
    />
  </>
);

registerRoot(Root);
