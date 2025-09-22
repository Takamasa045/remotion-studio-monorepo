import React from 'react';
import './hello.css';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export type HelloProps = {
  text: string;
  color: string;
  speed: number;
  delay: number;
};

type CSSVars = React.CSSProperties & {
  ['--speed']?: number | string;
  ['--delay-ms']?: string;
  ['--color']?: string;
};

export const Hello: React.FC<HelloProps> = ({text, color, speed, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const spd = speed ?? 1;
  const dly = delay ?? 0;

  // アニメ全体の長さ（ms）を speed で短縮/延長
  const animMs = 1000 / Math.max(0.01, spd);

  // 現在フレームまでに経過した時間（ms）
  const elapsedMs = (frame * 1000) / fps;

  // paused + negative delay で「elapsedMs - dly」だけ経過した状態を表現
  const negDelay = `-${Math.max(0, elapsedMs - dly)}ms`;

  const style: CSSVars = {
    ['--speed']: spd,
    ['--delay-ms']: `${dly}ms`,
    ['--color']: color ?? '#111111',
    color,
    // ▼ここがポイント：タイムライン同期
    animationDuration: `${animMs}ms`,
    animationDelay: negDelay,
    animationPlayState: 'paused',
  };

  return (
    <div className="stage">
      <div className="fx-title fx-fade-up" style={style}>
        {text}
      </div>
    </div>
  );
};

