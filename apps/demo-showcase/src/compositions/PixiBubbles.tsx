import React, {useMemo} from "react";
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from "remotion";
import {usePixiScene} from "@studio/visual-canvas2d";

export const PixiBubbles: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const bubbleCount = 60;
  const {canvasRef} = usePixiScene({
    frame,
    width,
    height,
    dpr: 1,
    onSetup: (app: any) => {
      // Create some bubbles
      const PIXI = (() => {
        try { const lib = require("pixi.js"); return lib?.default ?? lib; } catch { return null; }
      })();
      if (!PIXI) return;
      const bubbles: any[] = [];
      for (let i = 0; i < bubbleCount; i++) {
        const r = 6 + Math.random() * 18;
        const g = new PIXI.Graphics();
        g.beginFill(0x44aaff, 0.6);
        g.drawCircle(0, 0, r);
        g.endFill();
        g.x = Math.random() * width;
        g.y = height + Math.random() * height;
        (g as any).__vy = 0.5 + Math.random() * 2;
        app.stage.addChild(g);
        bubbles.push(g);
      }
      (app as any).__bubbles = bubbles;
    },
    onFrame: (app: any) => {
      const bubbles: any[] = (app as any).__bubbles ?? [];
      bubbles.forEach((b) => {
        b.y -= b.__vy;
        b.x += Math.sin((b.y + b.__vy) * 0.01);
        if (b.y < -20) {
          b.y = height + Math.random() * 50;
          b.x = Math.random() * width;
        }
      });
    },
    onDispose: (app: any) => {
      const bubbles: any[] = (app as any).__bubbles ?? [];
      bubbles.forEach((b) => b.destroy?.());
    },
  });

  return (
    <AbsoluteFill style={{background: "linear-gradient(180deg,#071a2b,#0d2740)"}}>
      <canvas ref={canvasRef} style={{width: "100%", height: "100%"}} />
    </AbsoluteFill>
  );
};

