import React from "react";
import "./textfx.css";

export const SvgFilters: React.FC = () => (
  <svg width={0} height={0} style={{position: "absolute"}}>
    <defs>
      <filter id="ink-wobble">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.02" numOctaves={2} seed={3} result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale={4} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="disp-noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.007 0.01" numOctaves={2} seed={7} result="n" />
        <feColorMatrix in="n" type="saturate" values="0" result="n2" />
        <feBlend in="SourceGraphic" in2="n2" mode="screen" />
      </filter>
      <filter id="ink-spread">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves={1} seed={11} result="fibers" />
        <feGaussianBlur in="fibers" stdDeviation={1.2} result="fibersB" />
        <feColorMatrix
          in="fibersB"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -10"
        />
      </filter>
    </defs>
  </svg>
);
