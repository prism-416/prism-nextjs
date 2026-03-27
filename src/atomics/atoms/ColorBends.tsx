"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type ColorBendsProps = {
  className?: string;
  rotation?: number;
  speed?: number;
  colors?: string[];
  transparent?: boolean;
  autoRotate?: number;
  scale?: number;
  frequency?: number;
  warpStrength?: number;
  mouseInfluence?: number;
  parallax?: number;
  noise?: number;
};

const MAX_COLORS = 8 as const;

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
#define MAX_COLORS ${MAX_COLORS}

uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;

varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;

  vec2 rp = vec2(
    p.x * uRot.x - p.y * uRot.y,
    p.x * uRot.y + p.y * uRot.x
  );

  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  q += (uPointer - rp) * uMouseInfluence * 0.2;

  vec3 col = vec3(0.0);
  float alpha = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;

    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;

      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float clampedStrength = clamp(uWarpStrength, 0.0, 1.0);
      float blend = pow(clampedStrength, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 displaced = (r - s) * clampedStrength;
      vec2 warped = s + displaced * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, blend);
      float weight = 1.0 - exp(-6.0 / exp(6.0 * m));

      sumCol += uColors[i] * weight;
      cover = max(cover, weight);
    }

    col = clamp(sumCol, 0.0, 1.0);
    alpha = uTransparent > 0 ? cover : 1.0;
  }

  if (uNoise > 0.0001) {
    float grain = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (grain - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = uTransparent > 0 ? col * alpha : col;
  gl_FragColor = vec4(rgb, alpha);
}
`;

function toVector3(hex: string) {
  const normalized = hex.replace("#", "").trim();
  const values =
    normalized.length === 3
      ? [
          parseInt(normalized[0] + normalized[0], 16),
          parseInt(normalized[1] + normalized[1], 16),
          parseInt(normalized[2] + normalized[2], 16),
        ]
      : [
          parseInt(normalized.slice(0, 2), 16),
          parseInt(normalized.slice(2, 4), 16),
          parseInt(normalized.slice(4, 6), 16),
        ];

  return new THREE.Vector3(values[0] / 255, values[1] / 255, values[2] / 255);
}

export default function ColorBends({
  className,
  rotation = 25,
  speed = 0.18,
  colors = ["#f4ecd6", "#d9e8e7", "#6ea9a7", "#0c4767"],
  transparent = true,
  autoRotate = 3,
  scale = 0.95,
  frequency = 1.15,
  warpStrength = 1.1,
  mouseInfluence = 0.08,
  parallax = 0.22,
  noise = 0.03,
}: ColorBendsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const currentPointerRef = useRef(new THREE.Vector2(0, 0));
  const targetPointerRef = useRef(new THREE.Vector2(0, 0));
  const rotationRef = useRef(rotation);
  const autoRotateRef = useRef(autoRotate);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const colorUniforms = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uCanvas: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uSpeed: { value: prefersReducedMotion ? 0 : speed },
        uRot: { value: new THREE.Vector2(1, 0) },
        uColorCount: { value: 0 },
        uColors: { value: colorUniforms },
        uTransparent: { value: transparent ? 1 : 0 },
        uScale: { value: scale },
        uFrequency: { value: frequency },
        uWarpStrength: { value: warpStrength },
        uPointer: { value: new THREE.Vector2(0, 0) },
        uMouseInfluence: { value: prefersReducedMotion ? 0 : mouseInfluence },
        uParallax: { value: prefersReducedMotion ? 0 : parallax },
        uNoise: { value: noise },
      },
      premultipliedAlpha: true,
      transparent: true,
    });

    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });

    rendererRef.current = renderer;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0x000000, transparent ? 0 : 1);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);

    const handleResize = () => {
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      renderer.setSize(width, height, false);
      (material.uniforms.uCanvas.value as THREE.Vector2).set(width, height);
    };

    handleResize();

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    resizeObserverRef.current = observer;

    const clock = new THREE.Clock();

    const renderLoop = () => {
      const delta = clock.getDelta();
      const elapsed = clock.elapsedTime;

      material.uniforms.uTime.value = elapsed;

      const degrees = (rotationRef.current % 360) + autoRotateRef.current * elapsed;
      const radians = (degrees * Math.PI) / 180;
      (material.uniforms.uRot.value as THREE.Vector2).set(Math.cos(radians), Math.sin(radians));

      const current = currentPointerRef.current;
      const target = targetPointerRef.current;
      current.lerp(target, Math.min(1, delta * 8));
      (material.uniforms.uPointer.value as THREE.Vector2).copy(current);

      renderer.render(scene, camera);
      animationFrameRef.current = window.requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = window.requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      resizeObserverRef.current?.disconnect();

      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [frequency, mouseInfluence, noise, parallax, scale, speed, transparent, warpStrength]);

  useEffect(() => {
    const material = materialRef.current;
    const renderer = rendererRef.current;

    if (!material) {
      return;
    }

    rotationRef.current = rotation;
    autoRotateRef.current = autoRotate;
    material.uniforms.uSpeed.value = speed;
    material.uniforms.uScale.value = scale;
    material.uniforms.uFrequency.value = frequency;
    material.uniforms.uWarpStrength.value = warpStrength;
    material.uniforms.uMouseInfluence.value = mouseInfluence;
    material.uniforms.uParallax.value = parallax;
    material.uniforms.uNoise.value = noise;
    material.uniforms.uTransparent.value = transparent ? 1 : 0;

    const palette = colors.filter(Boolean).slice(0, MAX_COLORS).map(toVector3);

    for (let index = 0; index < MAX_COLORS; index += 1) {
      const vector = (material.uniforms.uColors.value as THREE.Vector3[])[index];

      if (index < palette.length) {
        vector.copy(palette[index]);
      } else {
        vector.set(0, 0, 0);
      }
    }

    material.uniforms.uColorCount.value = palette.length;

    if (renderer) {
      renderer.setClearColor(0x000000, transparent ? 0 : 1);
    }
  }, [autoRotate, colors, frequency, mouseInfluence, noise, parallax, rotation, scale, speed, transparent, warpStrength]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      const y = -(((event.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      targetPointerRef.current.set(x, y);
    };

    const handlePointerLeave = () => {
      targetPointerRef.current.set(0, 0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return <div ref={containerRef} className={className} aria-hidden />;
}
