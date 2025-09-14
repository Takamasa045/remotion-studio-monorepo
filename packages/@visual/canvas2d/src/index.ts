import {MutableRefObject, useEffect, useRef, useState} from "react";

// Lightweight types to avoid external type packages
type PixiApp = any;
type KonvaStage = any;

// Lazy require to avoid TS resolution errors when libs are not installed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _PIXI: any | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _Konva: any | null = null;
const getPIXI = () => {
  if (_PIXI) return _PIXI;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const lib = require("pixi.js");
    _PIXI = lib?.default ?? lib;
  } catch {}
  return _PIXI;
};
const getKonva = () => {
  if (_Konva) return _Konva;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const lib = require("konva");
    _Konva = lib?.default ?? lib;
  } catch {}
  return _Konva;
};

export type UsePixiSceneOptions = {
  frame: number;
  width: number;
  height: number;
  dpr?: number;
  options?: Record<string, unknown>;
  onSetup?: (app: PixiApp, canvas: HTMLCanvasElement) => void;
  onFrame?: (app: PixiApp, frame: number) => void;
  onDispose?: (app: PixiApp) => void;
};

export type UsePixiSceneResult = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  app: PixiApp | null;
};

export const usePixiScene = (opts: UsePixiSceneOptions): UsePixiSceneResult => {
  const {frame, width, height, dpr = 1, options, onSetup, onFrame, onDispose} = opts;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [app, setApp] = useState<PixiApp | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const PIXI = getPIXI();
    if (!canvas || !PIXI) return;
    let destroyed = false;
    let application: any;
    try {
      application = new PIXI.Application({
        view: canvas,
        width,
        height,
        antialias: true,
        resolution: dpr,
        backgroundAlpha: 0,
        ...(options ?? {}),
      });
    } catch (e) {
      // Pixi v7+ might use async init
      application = new PIXI.Application();
      // Some versions require init
      if (typeof application.init === "function") {
        // best effort init
        // @ts-ignore
        application.init({ view: canvas, width, height, antialias: true, resolution: dpr, backgroundAlpha: 0, ...(options ?? {}) });
      }
    }
    setApp(application);
    onSetup?.(application, canvas);
    return () => {
      if (destroyed) return;
      destroyed = true;
      try { onDispose?.(application); } catch {}
      try { application?.destroy?.(true); } catch {}
      setApp(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, dpr]);

  useEffect(() => {
    if (!app) return;
    onFrame?.(app, frame);
  }, [app, frame, onFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, [width, height, dpr]);

  return { canvasRef, app };
};

export type UseKonvaStageOptions = {
  frame: number;
  width: number;
  height: number;
  dpr?: number;
  onSetup?: (stage: KonvaStage, container: HTMLDivElement) => void;
  onFrame?: (stage: KonvaStage, frame: number) => void;
  onDispose?: (stage: KonvaStage) => void;
};

export type UseKonvaStageResult = {
  containerRef: MutableRefObject<HTMLDivElement | null>;
  stage: KonvaStage | null;
};

export const useKonvaStage = (opts: UseKonvaStageOptions): UseKonvaStageResult => {
  const {frame, width, height, dpr = 1, onSetup, onFrame, onDispose} = opts;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [stage, setStage] = useState<KonvaStage | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const Konva = getKonva();
    if (!container || !Konva) return;
    const s = new Konva.Stage({
      container,
      width: Math.round(width * dpr),
      height: Math.round(height * dpr),
    });
    setStage(s);
    onSetup?.(s, container);
    return () => {
      try { onDispose?.(s); } catch {}
      try { s?.destroy?.(); } catch {}
      setStage(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, dpr]);

  useEffect(() => {
    if (!stage) return;
    onFrame?.(stage, frame);
  }, [stage, frame, onFrame]);

  useEffect(() => {
    const container = containerRef.current;
    if (!stage || !container) return;
    stage.size({ width: Math.round(width * dpr), height: Math.round(height * dpr) });
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
  }, [stage, width, height, dpr]);

  return { containerRef, stage };
};

export type Canvas2DRefs = {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};
