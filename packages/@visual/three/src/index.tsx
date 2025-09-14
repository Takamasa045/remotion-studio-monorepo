import React, {CSSProperties, PropsWithChildren, createContext, useContext, useEffect, useMemo, useRef} from "react";

// Lazy require to avoid TS resolution errors if peer deps are not installed yet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _r3f: any | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _three: any | null = null;
const getR3F = () => {
  if (_r3f) return _r3f;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _r3f = require("@react-three/fiber");
  } catch {}
  return _r3f;
};
const getTHREE = () => {
  if (_three) return _three;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    _three = require("three");
  } catch {}
  return _three;
};

type FrameCtx = { frame: number; fps: number };
const RemotionFrameContext = createContext<FrameCtx | null>(null);

export const useRemotionFrame = (
  cb: (state: any, delta: number, info: { frame: number; fps: number }) => void,
  deps: React.DependencyList = []
) => {
  const ctx = useContext(RemotionFrameContext);
  const state = useThree();
  const lastFrameRef = useRef<number | null>(null);
  useEffect(() => {
    if (!ctx) return;
    const last = lastFrameRef.current ?? ctx.frame - 1;
    const delta = (ctx.frame - last) / Math.max(1, ctx.fps);
    lastFrameRef.current = ctx.frame;
    cb(state, delta, { frame: ctx.frame, fps: ctx.fps });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.frame, ctx?.fps, state, ...deps]);
};

export type ThreeCanvasProps = PropsWithChildren<{
  frame: number;
  fps: number;
  width?: number;
  height?: number;
  dpr?: number;
  style?: CSSProperties;
  className?: string;
  gl?: THREE.WebGLRendererParameters;
}>;

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  frame,
  fps,
  width,
  height,
  dpr = 1,
  style,
  className,
  gl,
  children,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const s: CSSProperties = useMemo(() => ({ width, height, ...style }), [width, height, style]);
  const ctx = useMemo(() => ({ frame, fps }), [frame, fps]);

  // Force render on frame change when frameloop is demand
  const DemandInvalidator: React.FC = () => {
    const { invalidate } = useThree();
    useEffect(() => { invalidate(); });
    return null;
  };

  return (
    <div ref={wrapperRef} className={className} style={s}>
      <RemotionFrameContext.Provider value={ctx}>
        {(() => {
          const R3F = getR3F();
          const CanvasComp = R3F?.Canvas;
          if (!CanvasComp) return null;
          return (
            <CanvasComp frameloop="demand" dpr={dpr} gl={gl}>
              <DemandInvalidator />
              {children}
            </CanvasComp>
          );
        })()}
      </RemotionFrameContext.Provider>
    </div>
  );
};

export type CameraPresetProps = {
  fov?: number;
  near?: number;
  far?: number;
  position?: [number, number, number];
  lookAt?: [number, number, number];
};

export const CameraPreset: React.FC<CameraPresetProps> = ({
  fov = 50,
  near = 0.1,
  far = 1000,
  position = [0, 0, 5],
  lookAt = [0, 0, 0],
}) => {
  const { camera } = getR3F() ?? { camera: undefined };
  useEffect(() => {
    const THREE = getTHREE();
    const cam = camera as any;
    if ((cam as any).isPerspectiveCamera) {
      cam.fov = fov;
      cam.near = near;
      cam.far = far;
      cam.position.set(...position);
      cam.updateProjectionMatrix();
      cam.lookAt(new (THREE?.Vector3 ?? function V(x: number, y: number, z: number){ return {x,y,z}; })(...lookAt));
    }
  }, [camera, fov, near, far, position, lookAt]);
  return null;
};

export const DefaultLights: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => {
  return (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <ambientLight intensity={0.4 * intensity} />
      {/* eslint-disable-next-line react/no-unknown-property */}
      <directionalLight position={[3, 5, 2]} intensity={0.6 * intensity} />
    </>
  );
};

export const useThree = () => {
  const R3F = getR3F();
  return R3F?.useThree ? R3F.useThree() : ({} as any);
};
