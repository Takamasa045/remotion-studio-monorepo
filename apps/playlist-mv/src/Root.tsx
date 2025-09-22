// apps/playlist-mv/src/Root.tsx
import React from "react";
import {Composition} from "remotion";
import {PlaylistMV} from "./PlaylistMV";
import {compositionId, defaultProps, videoConfig} from "./project.config";

// ★ 追加: CSS（= advanced.css を統合したもの）を一度だけ読む
import "@visual/textfx/textfx.css"; // パスはあなたの配置に合わせて

// ★ 追加: 右ペインに出す項目の schema
import {z} from "zod";

export const textEffectOptions = [
  "sliceReveal",
  "kineticWords",
  "wafuVertical",
] as const;
export type TextEffect = (typeof textEffectOptions)[number];
export const PropsSchema = z.object({
  bpm: z.number().min(60).max(180).default(100),         // ← アニメ速度用（CSS変数 --bpm に渡す）
  sliceText: z.string().default("PLAYLIST MV"),
  words: z.array(z.string()).default([]),
  wafuTitle: z.string().default(""),
  wafuSubtitle: z.string().default(""),
  sliceInSec: z.number().min(0).default(0),              // 発火秒
  sliceDurSec: z.number().min(0.1).default(3),           // 継続秒
  textEffect: z.enum(["sliceReveal", "kineticWords", "wafuVertical"]).default("sliceReveal"),
});
export type MVProps = z.infer<typeof PropsSchema>;

export const Root: React.FC = () => {
  return (
    <Composition
      id={compositionId}
      component={PlaylistMV}
      width={videoConfig.width}
      height={videoConfig.height}
      fps={videoConfig.fps}
      durationInFrames={videoConfig.durationInFrames}

      // ★ 追加: 右ペイン（Props）を出す
      schema={PropsSchema}

      // 既存の defaultProps に、上の schema で定義した初期値が無い場合は足してね
      defaultProps={{
        ...defaultProps,
        bpm: 100,
        sliceText: "PLAYLIST MV",
        words: [],
        wafuTitle: "",
        wafuSubtitle: "",
        sliceInSec: 0,
        sliceDurSec: 3,
        textEffect: "sliceReveal",
      }}
    />
  );
};
export {PlaylistMV};
