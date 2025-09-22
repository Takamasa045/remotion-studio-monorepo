import React, {useEffect, useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {HelloProps} from './Hello';

export const HelloJs: React.FC<HelloProps> = ({text, color, speed, delay}) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const spd = speed ?? 1;
  const dly = delay ?? 0;

  // duration: 1000ms を speed でスケーリング
  const animMs = 1000 / Math.max(0.01, spd);

  // 経過時間（ms）: フレームベース
  const elapsedMs = (frame * 1000) / fps - dly;

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const anim = el.animate(
      [
        {opacity: 0, transform: 'translateY(16px)'},
        {opacity: 1, transform: 'translateY(0)'},
      ],
      {
        duration: animMs,
        fill: 'both',
      }
    );
    anim.pause(); // 自動再生を止める
    return () => anim.cancel();
  }, [animMs]);

  // 毎フレーム進行度をセット
  useEffect(() => {
    if (!ref.current) return;
    const anim = ref.current.getAnimations()[0];
    if (anim) {
      anim.currentTime = Math.max(0, elapsedMs);
    }
  }, [elapsedMs]);

  return (
    <div
      ref={ref}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 80,
        fontWeight: 800,
        color,
      }}
    >
      {text} (JS)
    </div>
  );
};

