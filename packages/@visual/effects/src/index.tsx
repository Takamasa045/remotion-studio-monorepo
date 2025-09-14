import React, {CSSProperties, MutableRefObject, useMemo, useRef} from "react";
import {ShaderCanvas, type ShaderCanvasProps, type GL} from "@studio/visual-shaders";

// A simple 9-tap blur shader
const blurFrag = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
varying vec2 v_uv;
uniform float u_strength; // pixels at 1x scale

vec4 sample(vec2 uv){
  return vec4(uv, 0.0, 1.0);
}

void main(){
  vec2 px = 1.0 / u_res;
  float s = u_strength;
  vec4 c = vec4(0.0);
  c += sample(v_uv + px * vec2(-s, -s));
  c += sample(v_uv + px * vec2( 0., -s));
  c += sample(v_uv + px * vec2( s, -s));
  c += sample(v_uv + px * vec2(-s,  0.));
  c += sample(v_uv);
  c += sample(v_uv + px * vec2( s,  0.));
  c += sample(v_uv + px * vec2(-s,  s));
  c += sample(v_uv + px * vec2( 0.,  s));
  c += sample(v_uv + px * vec2( s,  s));
  c /= 9.0;
  gl_FragColor = c;
}
`;

// Channel-shift glitch shader (toy example)
const glitchFrag = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
varying vec2 v_uv;
uniform float u_intensity;

float rand(vec2 co){
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main(){
  float n = rand(vec2(floor(v_uv.y * u_res.y), floor(u_time*60.0)));
  float shift = (n - 0.5) * 0.01 * u_intensity;
  vec2 uvR = v_uv + vec2( shift, 0.0);
  vec2 uvB = v_uv + vec2(-shift, 0.0);
  // placeholder color; replace with texture sampling
  vec3 base = vec3(v_uv, 1.0);
  vec3 color = vec3(base.r, base.g, base.b);
  color.r = clamp(base.r + shift, 0.0, 1.0);
  color.b = clamp(base.b - shift, 0.0, 1.0);
  gl_FragColor = vec4(color, 1.0);
}
`;

// Glow is simulated here via blurred base + additive blend placeholder
const glowFrag = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
varying vec2 v_uv;
uniform float u_strength;

void main(){
  float glow = smoothstep(0.0, 1.0, 1.0 - distance(v_uv, vec2(0.5)));
  glow = pow(glow, 2.0) * u_strength;
  vec3 base = vec3(v_uv, 1.0);
  vec3 color = base + glow;
  gl_FragColor = vec4(color, 1.0);
}
`;

type EffectProps = {
  width: number;
  height: number;
  frame: number;
  fps: number;
  strength?: number;
  dpr?: number;
  style?: CSSProperties;
  className?: string;
};

const withCommonUniforms = (
  glRef: MutableRefObject<GL | null>,
  width: number,
  height: number,
  extra?: (gl: GL, prog: WebGLProgram) => void
) => {
  return (gl: GL) => {
    const prog = (gl as any).getParameter((gl as any).CURRENT_PROGRAM) as WebGLProgram | null;
    if (!prog) return;
    const uRes = gl.getUniformLocation(prog, "u_res");
    if (uRes) gl.uniform2f(uRes, width, height);
    if (extra) extra(gl, prog);
  };
};

export const BlurEffect: React.FC<EffectProps> = ({ width, height, frame, fps, strength = 2, dpr = 1, style, className }) => {
  const glRef = useRef<GL | null>(null);
  const uniforms = useMemo(() => ({
    _common: (gl: GL) => withCommonUniforms(glRef, width, height)(gl),
    u_strength: (gl: GL) => {
      const prog = (gl as any).getParameter((gl as any).CURRENT_PROGRAM) as WebGLProgram | null;
      if (!prog) return;
      const loc = gl.getUniformLocation(prog, "u_strength");
      if (loc) gl.uniform1f(loc, strength);
    },
  }), [width, height, strength]);
  return (
    <ShaderCanvas width={width} height={height} frame={frame} fps={fps} frag={blurFrag} uniforms={uniforms} dpr={dpr} style={style} className={className} />
  );
};

export const GlitchEffect: React.FC<EffectProps> = ({ width, height, frame, fps, strength = 1, dpr = 1, style, className }) => {
  const glRef = useRef<GL | null>(null);
  const uniforms = useMemo(() => ({
    _common: (gl: GL) => withCommonUniforms(glRef, width, height)(gl),
    u_intensity: (gl: GL) => {
      const prog = (gl as any).getParameter((gl as any).CURRENT_PROGRAM) as WebGLProgram | null;
      if (!prog) return;
      const loc = gl.getUniformLocation(prog, "u_intensity");
      if (loc) gl.uniform1f(loc, strength);
    },
  }), [width, height, strength]);
  return (
    <ShaderCanvas width={width} height={height} frame={frame} fps={fps} frag={glitchFrag} uniforms={uniforms} dpr={dpr} style={style} className={className} />
  );
};

export const GlowEffect: React.FC<EffectProps> = ({ width, height, frame, fps, strength = 1, dpr = 1, style, className }) => {
  const glRef = useRef<GL | null>(null);
  const uniforms = useMemo(() => ({
    _common: (gl: GL) => withCommonUniforms(glRef, width, height)(gl),
    u_strength: (gl: GL) => {
      const prog = (gl as any).getParameter((gl as any).CURRENT_PROGRAM) as WebGLProgram | null;
      if (!prog) return;
      const loc = gl.getUniformLocation(prog, "u_strength");
      if (loc) gl.uniform1f(loc, strength);
    },
  }), [width, height, strength]);
  return (
    <ShaderCanvas width={width} height={height} frame={frame} fps={fps} frag={glowFrag} uniforms={uniforms} dpr={dpr} style={style} className={className} />
  );
};

export type { ShaderCanvasProps };
