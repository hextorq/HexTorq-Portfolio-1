/**
 * ─────────────────────────────────────────────────────────────
 *  GLSL SHADERS
 * ─────────────────────────────────────────────────────────────
 *  Custom shaders for the futuristic scene:
 *   - snoise: Ashima 3D simplex noise (shared chunk)
 *   - sky:    inside-out nebula background sphere
 *   - orb:    displaced, fresnel-lit energy core
 * ─────────────────────────────────────────────────────────────
 */

/* Classic Ashima simplex noise — well-known, compiles everywhere. */
export const snoise = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`

/* ── NEBULA BACKGROUND (rendered on the inside of a big sphere) ── */
export const skyVertex = /* glsl */ `
varying vec3 vPos;
void main() {
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

export const skyFragment = /* glsl */ `
precision highp float;
varying vec3 vPos;
uniform float uTime;
uniform float uScroll;
uniform vec3 uBase;   // deep background
uniform vec3 uCyan;
uniform vec3 uPurple;
${snoise}

// Fractal brownian motion for soft, layered clouds (4 octaves, unrolled for performance).
float fbm(vec3 p){
  float v = 0.0;
  v += 0.5000 * snoise(p); p *= 2.0;
  v += 0.2500 * snoise(p); p *= 2.0;
  v += 0.1250 * snoise(p); p *= 2.0;
  v += 0.0625 * snoise(p);
  return v;
}

// Lightweight 2-octave FBM for coordinate warping (unrolled).
float fbmWarp(vec3 p){
  float v = 0.0;
  v += 0.500 * snoise(p); p *= 2.0;
  v += 0.250 * snoise(p);
  return v;
}

void main(){
  vec3 dir = normalize(vPos);
  vec3 q = dir * 1.7;
  q.z += uTime * 0.05;
  q.y += uScroll * 0.7;

  // Domain-warped fbm → flowing aurora clouds.
  float n = fbm(q + fbmWarp(q * 0.7 + uTime * 0.04));
  n = n * 0.5 + 0.5;

  // A second, slower & cheaper layer for depth and motion.
  float n2 = fbmWarp(q * 0.5 - vec3(uTime * 0.03, 0.0, 0.0));
  n2 = n2 * 0.5 + 0.5;

  // Three energy bands — wide ranges so more of the sky glows.
  float blueField   = smoothstep(0.30, 0.92, n);
  float violetField = smoothstep(0.42, 1.00, mix(n, n2, 0.5));
  float hot         = smoothstep(0.72, 1.00, n);        // bright cores

  // ── Scroll-driven palette ──────────────────────────────────────
  // The two accent colours travel through a sequence of moods as you
  // scroll, so each part of the page has its own distinct atmosphere.
  //   0.0  hero      → electric blue / indigo
  //   0.25 services  → indigo / violet
  //   0.5  products  → violet / magenta
  //   0.75 projects  → teal-cyan / blue
  //   1.0  contact   → deep blue / violet
  vec3 accentA, accentB;
  float s = clamp(uScroll, 0.0, 1.0) * 4.0;   // 0..4 across 5 stops
  if (s < 1.0) {
    float f = smoothstep(0.0, 1.0, s);
    accentA = mix(vec3(0.24,0.42,1.0), vec3(0.36,0.30,1.0), f);   // blue→indigo
    accentB = mix(vec3(0.49,0.36,0.93), vec3(0.55,0.28,0.95), f); // indigo→violet
  } else if (s < 2.0) {
    float f = smoothstep(0.0, 1.0, s - 1.0);
    accentA = mix(vec3(0.36,0.30,1.0), vec3(0.62,0.26,0.95), f);  // indigo→violet
    accentB = mix(vec3(0.55,0.28,0.95), vec3(0.95,0.30,0.72), f); // violet→magenta
  } else if (s < 3.0) {
    float f = smoothstep(0.0, 1.0, s - 2.0);
    accentA = mix(vec3(0.62,0.26,0.95), vec3(0.13,0.72,0.86), f); // violet→teal
    accentB = mix(vec3(0.95,0.30,0.72), vec3(0.24,0.50,1.0), f);  // magenta→blue
  } else {
    float f = smoothstep(0.0, 1.0, s - 3.0);
    accentA = mix(vec3(0.13,0.72,0.86), vec3(0.24,0.42,1.0), f);  // teal→blue
    accentB = mix(vec3(0.24,0.50,1.0), vec3(0.49,0.34,0.95), f);  // blue→violet
  }

  vec3 col = uBase;
  col += accentA * blueField   * 0.95;
  col += accentB * violetField * 1.05;
  col += vec3(0.55, 0.68, 1.0) * hot * 0.6;             // hot highlights

  // Big soft central glow so the scene feels lit, not flat.
  float centerGlow = pow(1.0 - abs(dir.y), 3.0);
  col += mix(accentA, accentB, 0.5) * centerGlow * (0.18 + 0.25 * uScroll);

  // Gentle vertical falloff for depth.
  float grad = smoothstep(-1.0, 1.0, dir.y);
  col *= mix(0.7, 1.25, grad);

  // Keep a dark, rich base so foreground text still reads.
  col = mix(uBase, col, 0.96);

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── ENERGY CORE ORB (displaced sphere + fresnel rim) ── */
export const orbVertex = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uScroll;
uniform float uDisplace;
uniform vec3  uPointer;
varying vec3  vNormal;
varying vec3  vView;
varying float vNoise;
${snoise}

void main(){
  vec3 pos = position;

  // Layered noise displacement — a living, morphing surface.
  float t = uTime * 0.35;
  float n  = snoise(pos * 1.1 + vec3(0.0, 0.0, t));
  n       += 0.5  * snoise(pos * 2.3 + vec3(t * 1.3));
  n       += 0.25 * snoise(pos * 4.6 - vec3(t));

  // Pointer creates a soft bulge; scroll increases turbulence.
  float bulge = dot(normalize(pos), normalize(uPointer + 0.0001)) * 0.15;
  float displacement = (n + bulge) * (uDisplace + uScroll * 0.35);

  vec3 newPos = pos + normal * displacement;
  vNoise = n;

  vNormal = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(newPos, 1.0);
  vView = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

export const orbFragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform float uScroll;
uniform vec3  uCyan;
uniform vec3  uPurple;
varying vec3  vNormal;
varying vec3  vView;
varying float vNoise;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);

  // Fresnel rim — the neon glow along the silhouette.
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.4);

  // Base color flows between cyan and purple with the noise + scroll.
  float mixv = smoothstep(-1.0, 1.0, vNoise) * 0.6 + uScroll * 0.4;
  vec3 base = mix(uCyan, uPurple, clamp(mixv, 0.0, 1.0));

  vec3 col = base * 0.25;                 // dark interior
  col += fres * mix(uCyan, uPurple, uScroll) * 2.6;  // glowing rim
  col += pow(fres, 3.0) * 1.5;            // hot white edge

  gl_FragColor = vec4(col, 1.0);
}
`

/* ── SOFT GLOW HALO (additive shell around the core, fakes bloom) ── */
export const haloFragment = /* glsl */ `
precision highp float;
uniform float uScroll;
uniform vec3  uCyan;
uniform vec3  uPurple;
varying vec3  vNormal;
varying vec3  vView;
varying float vNoise;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  // Bright at the silhouette, transparent toward the center → aura.
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);
  vec3 col = mix(uCyan, uPurple, clamp(uScroll + vNoise * 0.2, 0.0, 1.0));
  gl_FragColor = vec4(col, fres * 0.55);
}
`

/* ── THE "X" MOTIF — logo gradient + fresnel glow ─────────────────
   Gradient runs blue→violet across world-space X, so as the mark
   torques the gradient sweeps like light across metal. ───────────*/
export const xVertex = /* glsl */ `
precision highp float;
varying vec3 vNormal;
varying vec3 vView;
varying vec3 vWorld;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld  = wp.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView   = cameraPosition - wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

export const xFragment = /* glsl */ `
precision highp float;
uniform vec3  uBlue;
uniform vec3  uViolet;
varying vec3  vNormal;
varying vec3  vView;
varying vec3  vWorld;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);

  // blue (left) → violet (right) across the mark
  float t = clamp(vWorld.x * 0.32 + 0.5, 0.0, 1.0);
  vec3 base = mix(uBlue, uViolet, t);

  vec3 col = base * 0.30;          // metallic body
  col += fres * base * 2.6;        // glowing edges
  col += pow(fres, 3.0) * 1.3;     // hot white rim
  gl_FragColor = vec4(col, 1.0);
}
`

export const xHaloFragment = /* glsl */ `
precision highp float;
uniform vec3  uBlue;
uniform vec3  uViolet;
varying vec3  vNormal;
varying vec3  vView;
varying vec3  vWorld;
void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vView);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.0);
  float t = clamp(vWorld.x * 0.32 + 0.5, 0.0, 1.0);
  vec3 col = mix(uBlue, uViolet, t);
  gl_FragColor = vec4(col, fres * 0.5);
}
`


