import React, {CSSProperties, useEffect, useRef} from "react";

export type GL = WebGLRenderingContext | WebGL2RenderingContext;

const vert = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main(){
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

export type ShaderCanvasProps = {
  width: number;
  height: number;
  frame: number;
  fps: number;
  frag: string;
  uniforms?: Record<string, (gl: GL) => void>;
  dpr?: number;
  style?: CSSProperties;
  className?: string;
};

const createShader = (gl: GL, type: number, src: string) => {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(s));
  }
  return s;
};

const createProgram = (gl: GL, vs: string, fs: string) => {
  const v = createShader(gl, gl.VERTEX_SHADER, vs);
  const f = createShader(gl, gl.FRAGMENT_SHADER, fs);
  const p = gl.createProgram()!;
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(p));
  }
  return p;
};

export const ShaderCanvas: React.FC<ShaderCanvasProps> = ({
  width,
  height,
  frame,
  fps,
  frag,
  uniforms,
  dpr = 1,
  style,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const glRef = useRef<GL | null>(null);
  const uTimeRef = useRef<WebGLUniformLocation | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as GL | null;
    if (!gl) return;
    glRef.current = gl;
    const prog = createProgram(gl, vert, frag);
    programRef.current = prog;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    bufferRef.current = buf;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    uTimeRef.current = gl.getUniformLocation(prog, "u_time");

    return () => {
      if (!gl) return;
      if (buf) gl.deleteBuffer(buf);
      if (prog) gl.deleteProgram(prog);
      programRef.current = null;
      glRef.current = null;
      uTimeRef.current = null;
      bufferRef.current = null;
    };
  }, [frag]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;
    const W = Math.round(width * dpr);
    const H = Math.round(height * dpr);
    canvas.width = W;
    canvas.height = H;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    gl.viewport(0, 0, W, H);
  }, [width, height, dpr]);

  useEffect(() => {
    const gl = glRef.current;
    const prog = programRef.current;
    if (!gl || !prog) return;
    gl.useProgram(prog);
    const t = frame / Math.max(1, fps);
    if (uTimeRef.current) gl.uniform1f(uTimeRef.current, t);
    if (uniforms) {
      Object.values(uniforms).forEach((fn) => fn(gl));
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }, [frame, fps, uniforms]);

  return <canvas ref={canvasRef} className={className} style={style} />;
};

export type { ShaderCanvasProps };
