import React, {useEffect, useMemo, useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {LinkedParticlesSceneManager} from './LinkedParticlesSceneManager';

export const LinkedParticles: React.FC<{showGUI?: boolean}> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const manager = useMemo(() => new LinkedParticlesSceneManager(width, height), [
    width,
    height,
  ]);

  // mount/unmount
  useEffect(() => {
    const el = mountRef.current;
    if (!el) {
      return () => {
        manager.dispose();
      };
    }
    manager.mount(el);
    return () => {
      manager.dispose();
    };
  }, [manager]);

  // resize (frame-agnostic)
  useEffect(() => {
    manager.resize(width, height);
  }, [manager, width, height]);

  // frame-driven update
  useEffect(() => {
    manager.update(frame, fps);
  }, [manager, frame, fps]);

  return <div ref={mountRef} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} />;
};

export default LinkedParticles;
