import React, {useEffect, useMemo, useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import * as THREE from 'three';
// ★ 追加の import（必要最小限）
import {WebGLRenderer} from 'three';

// Plan A: Pure WebGL + frame-driven rendering (no rAF, no WebGPU/TSL)
// - Stable in headless/CLI when WebGL is available (use SwiftShader if needed)
// - Driven by Remotion frame/fps

// Procedural galaxy-like background using 2D canvas
const createGalaxyTexture = (w: number, h: number): THREE.Texture => {
  const cw = Math.max(1024, Math.floor(w));
  const ch = Math.max(1024, Math.floor(h));
  const c = document.createElement('canvas');
  c.width = cw;
  c.height = ch;
  const ctx = c.getContext('2d');
  if (!ctx) {
    const tex = new THREE.CanvasTexture(document.createElement('canvas'));
    tex.needsUpdate = true;
    return tex;
  }

  // Base space color
  ctx.fillStyle = '#05070a';
  ctx.fillRect(0, 0, cw, ch);

  // Core radial gradient
  const cx = cw * 0.5;
  const cy = ch * 0.5;
  const r = Math.max(cw, ch) * 0.7;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0.0, '#0d1630');
  g.addColorStop(0.35, '#1a0f2b');
  g.addColorStop(0.7, '#081426');
  g.addColorStop(1.0, '#05070a');
  ctx.globalAlpha = 1;
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cw, ch);

  // Nebula blobs
  const blob = (x: number, y: number, radius: number, color: string, alpha: number) => {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, color);
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = alpha;
    ctx.fillStyle = grad;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  };
  const palette = ['#5e2d79', '#1c6ea4', '#2b7a78', '#7f1d8d'];
  for (let i = 0; i < 9; i++) {
    const rx = cx + (Math.random() - 0.5) * cw * 0.35;
    const ry = cy + (Math.random() - 0.5) * ch * 0.35;
    const rr = Math.random() * Math.max(cw, ch) * 0.18 + Math.max(cw, ch) * 0.08;
    const col = palette[(Math.random() * palette.length) | 0];
    const a = 0.12 + Math.random() * 0.12;
    blob(rx, ry, rr, col, a);
  }

  // Stars
  const stars = Math.floor((cw * ch) / 4000);
  ctx.globalAlpha = 1;
  for (let i = 0; i < stars; i++) {
    const x = Math.random() * cw;
    const y = Math.random() * ch;
    const a = 0.35 + Math.random() * 0.65;
    const s = Math.random() * 1.0 + 0.2;
    ctx.fillStyle = `rgba(255,255,255,${a.toFixed(3)})`;
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
  // Twinkles
  ctx.shadowColor = 'rgba(255,255,255,0.8)';
  ctx.shadowBlur = 8;
  for (let i = 0; i < Math.floor(stars * 0.05); i++) {
    const x = Math.random() * cw;
    const y = Math.random() * ch;
    const s = Math.random() * 1.2 + 0.6;
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.beginPath();
    ctx.arc(x, y, s, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  const tex = new THREE.CanvasTexture(c);
  (tex as any).colorSpace = (THREE as any).SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
};

export const LinkedParticles: React.FC<{showGUI?: boolean}> = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const posAttrRef = useRef<THREE.BufferAttribute | null>(null);
  const colAttrRef = useRef<THREE.BufferAttribute | null>(null);
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const {scene, camera, renderer} = useMemo(() => {
    const scene = new THREE.Scene();
    // Procedural galaxy background
    scene.background = createGalaxyTexture(width, height);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200);
    camera.position.set(0, 0, 14);

    // ★ 置き換え：WebGL2 コンテキストを自前作成し WebGLRenderer に渡す
    const canvas = document.createElement('canvas');

    const gl2 = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      failIfMajorPerformanceCaveat: false,
      powerPreference: 'high-performance',
    }) as WebGL2RenderingContext | null;

    if (!gl2) {
      throw new Error('WebGL2 context creation failed');
    }

    const renderer = new WebGLRenderer({
      canvas,
      context: gl2 as unknown as WebGLRenderingContext,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    } as any);

    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);

    // Ambient light for any future meshes (points don't need lighting)
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));

    // Create starfield as Points (stable in headless)
    const starCount = 6000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const seedsA = new Float32Array(starCount);
    const seedsB = new Float32Array(starCount);
    for (let i = 0; i < starCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 5;
      const y = (Math.random() - 0.5) * 2.0;
      positions[i * 3 + 0] = Math.cos(a) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(a) * r;
      seedsA[i] = Math.random(); // angle seed
      seedsB[i] = Math.random(); // radius/vertical seed
      // base color: bluish
      colors[i * 3 + 0] = 0.62;
      colors[i * 3 + 1] = 0.80;
      colors[i * 3 + 2] = 1.00;
    }
    const geo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    geo.setAttribute('position', posAttr);
    posAttrRef.current = posAttr;
    const colAttr = new THREE.BufferAttribute(colors, 3);
    geo.setAttribute('color', colAttr);
    colAttrRef.current = colAttr;

    // material – additive small dots
    const mat = new THREE.PointsMaterial({
      color: 0xffffff,
      vertexColors: true,
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    pointsRef.current = points;
    // attach seeds to geometry for per-frame update
    (points.geometry as any)._seedsA = seedsA;
    (points.geometry as any)._seedsB = seedsB;
    scene.add(points);

    return {scene, camera, renderer};
  }, [width, height]);

  // mount/unmount
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    try {
      el.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch {
      // If WebGL context cannot be created, show a static CSS background (avoid crashing Studio)
      const bg = document.createElement('div');
      bg.style.position = 'absolute';
      bg.style.inset = '0';
      bg.style.background = 'radial-gradient(150% 100% at 50% 50%, #0d1630 0%, #1a0f2b 40%, #05070a 100%)';
      el.appendChild(bg);
      return () => {
        if (bg.parentElement) bg.parentElement.removeChild(bg);
      };
    }
    return () => {
      try {
        el.removeChild(renderer.domElement);
      } catch {}
      renderer.dispose();
    };
  }, [renderer]);

  // resize (frame-agnostic)
  useEffect(() => {
    const r = rendererRef.current;
    if (!r) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    r.setPixelRatio(1);
    r.setSize(width, height, false);
  }, [width, height, camera]);

  // frame-driven update
  useEffect(() => {
    const r = rendererRef.current;
    const p = pointsRef.current;
    const attr = posAttrRef.current;
    const colAttr = colAttrRef.current;
    if (!r || !p || !attr || !colAttr) return;

    const positions = attr.array as Float32Array;
    const colors = colAttr.array as Float32Array;
    const seedsA = (p.geometry as any)._seedsA as Float32Array;
    const seedsB = (p.geometry as any)._seedsB as Float32Array;

    const t = frame / fps; // seconds
    const N = positions.length / 3;
    const baseRadius = 10.5;
    const spin = 0.38; // spiral rotation speed
    // Move spiral center across the screen
    const cx = Math.sin(t * 0.25) * 4.5; // horizontal sweep
    const cy = Math.cos(t * 0.18) * 2.4; // vertical sweep
    for (let i = 0; i < N; i++) {
      const sa = seedsA[i];
      const sb = seedsB[i];
      const angle = sa * Math.PI * 2 + t * spin;
      const radius = baseRadius + Math.sin(t * 0.7 + sb * 12.0) * 2.5 + sb * 2.2;
      const y = Math.sin(t * 0.9 + sb * 6.283) * 1.6;
      positions[i * 3 + 0] = Math.cos(angle) * radius + cx;
      positions[i * 3 + 1] = y + cy;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      // sparkle: occasionally brighten some stars
      const flicker = Math.sin(t * 5.2 + sa * 14.0) * Math.cos(t * 3.7 + sb * 11.0);
      const twinkle = Math.max(0, flicker);
      const boost = twinkle > 0.85 ? 1.0 : twinkle * 0.6;
      const baseR = 0.62, baseG = 0.80, baseB = 1.0;
      const k = 1.0 + boost * 1.6;
      colors[i * 3 + 0] = Math.min(1, baseR * k);
      colors[i * 3 + 1] = Math.min(1, baseG * k);
      colors[i * 3 + 2] = Math.min(1, baseB * k);
    }
    attr.needsUpdate = true;
    colAttr.needsUpdate = true;

    r.render(scene, camera);
  }, [frame, fps, scene, camera]);

  return <div ref={mountRef} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}} />;
};

export default LinkedParticles;
