import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";

import artwork from "@/assets/brand/quorlyn-geometry.json";

type Point = number[];
type Contour = { points: Point[]; area: number };

export type LogoScene = {
  setRunning: (running: boolean) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  dispose: () => void;
};

const ramp = [
  [0, new THREE.Color("#00cdfd")],
  [0.26, new THREE.Color("#00a6fc")],
  [0.54, new THREE.Color("#1757fc")],
  [0.82, new THREE.Color("#863afb")],
  [1, new THREE.Color("#b914fc")],
] as const;

function brandColor(x: number, y: number) {
  const t = THREE.MathUtils.clamp(x * 0.52 + y * 0.83 - 0.22, 0, 1);
  for (let i = 1; i < ramp.length; i++) {
    if (t <= ramp[i][0]) {
      const [start, a] = ramp[i - 1];
      const [end, b] = ramp[i];
      return a.clone().lerp(b, (t - start) / (end - start));
    }
  }
  return ramp[ramp.length - 1][1].clone();
}

function bounds(contour: Contour) {
  return contour.points.reduce(
    (box, [x, y]) => ({
      x0: Math.min(box.x0, x), y0: Math.min(box.y0, y),
      x1: Math.max(box.x1, x), y1: Math.max(box.y1, y),
    }),
    { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity },
  );
}

function contains(point: Point, polygon: Point[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x, y] = polygon[i], [px, py] = polygon[j];
    if ((y > point[1]) !== (py > point[1]) && point[0] < ((px - x) * (point[1] - y)) / (py - y) + x) inside = !inside;
  }
  return inside;
}

/** The mesh is extruded from alpha contours of the official source, including its gaps. */
export function createLogoScene(host: HTMLElement, settled = false): LogoScene {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", { alpha: true, antialias: true, powerPreference: "low-power" });
  if (!context) throw new Error("WebGL 2 is unavailable");

  const renderer = new THREE.WebGLRenderer({ canvas, context, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.animation = "static";
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 40);
  camera.position.set(0, 0.1, 10.6);
  camera.lookAt(0, 0, 0);

  // Neutral studio reflections light the material without replacing the
  // transparent canvas or the website's dark background with a white scene.
  const environment = new RoomEnvironment();
  const generator = new THREE.PMREMGenerator(renderer);
  const environmentMap = generator.fromScene(environment, 0.04);
  scene.environment = environmentMap.texture;
  environment.dispose();
  generator.dispose();

  const key = new THREE.DirectionalLight(0xc4f6ff, 3.1);
  key.position.set(-3, 7, 5);
  key.castShadow = true;
  key.shadow.radius = 8;
  key.shadow.bias = -0.0001;
  key.shadow.normalBias = 0.015;
  key.shadow.camera.left = -4.5;
  key.shadow.camera.right = 4.5;
  key.shadow.camera.top = 4.5;
  key.shadow.camera.bottom = -4.5;
  key.shadow.camera.near = 0.1;
  key.shadow.camera.far = 20;
  const rim = new THREE.DirectionalLight(0xa16aff, 2.3);
  rim.position.set(4, -1, 3);
  const fill = new THREE.DirectionalLight(0xeaf1ff, 1.1);
  fill.position.set(0, -4, 6);
  scene.add(key, rim, fill, new THREE.AmbientLight(0xc7d8ed, 0.55));

  const mark = new THREE.Group();
  mark.rotation.set(0.12, -0.22, -0.025);
  scene.add(mark);
  const scale = 5 / artwork.width;
  const project = ([x, y]: Point) => new THREE.Vector2((x - artwork.width / 2) * scale, (artwork.height / 2 - y) * scale);
  const contours = artwork.contours as Contour[];
  const pixels: Array<{ x: number; y: number; width: number; height: number; color: THREE.Color }> = [];
  const outer = contours.filter((c) => c.area > 0);
  const holes = contours.filter((c) => c.area < 0);
  const shapes: THREE.Shape[] = [];

  for (const contour of outer) {
    const box = bounds(contour);
    const width = box.x1 - box.x0, height = box.y1 - box.y0;
    const isPixel = contour.area < 2400 && contour.area / (width * height) > 0.88 && width / height > 0.78 && width / height < 1.28;
    if (isPixel) {
      const center = project([(box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2]);
      pixels.push({ x: center.x, y: center.y, width: width * scale, height: height * scale, color: brandColor((box.x0 + box.x1) / 2 / artwork.width, (box.y0 + box.y1) / 2 / artwork.height) });
      continue;
    }
    const shape = new THREE.Shape(contour.points.map(project));
    for (const hole of holes) {
      if (contains(hole.points[0], contour.points)) shape.holes.push(new THREE.Path(hole.points.map(project)));
    }
    shapes.push(shape);
  }

  // The source contour carries sub-pixel edge detail. Keep the bevel narrower
  // than those segments so sharp joins do not fold over one another.
  const geometry = new THREE.ExtrudeGeometry(shapes, { depth: 0.34, bevelEnabled: true, bevelThickness: 0.028, bevelSize: 0.004, bevelSegments: 3, steps: 1, curveSegments: 12 });
  geometry.translate(0, 0, -0.17);
  toCreasedNormals(geometry, Math.PI / 6);
  const positions = geometry.getAttribute("position");
  const colors = new Float32Array(positions.count * 3);
  for (let i = 0; i < positions.count; i++) {
    const x = (positions.getX(i) / scale + artwork.width / 2) / artwork.width;
    const y = (artwork.height / 2 - positions.getY(i) / scale) / artwork.height;
    brandColor(x, y).toArray(colors, i * 3);
  }
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const face = new THREE.MeshStandardMaterial({ vertexColors: true, metalness: 0.68, roughness: 0.29, envMapIntensity: 1.3 });
  const side = new THREE.MeshStandardMaterial({ color: 0x547ca6, vertexColors: true, metalness: 0.72, roughness: 0.36, envMapIntensity: 1.15 });
  const body = new THREE.Mesh(geometry, [face, side]);
  body.castShadow = true;
  mark.add(body);

  const pixelGeometry = new THREE.BoxGeometry(1, 1, 1);
  const pixelMaterial = new THREE.MeshStandardMaterial({ metalness: 0.58, roughness: 0.3, envMapIntensity: 1.2 });
  const fragments = new THREE.InstancedMesh(pixelGeometry, pixelMaterial, pixels.length);
  fragments.castShadow = true;
  fragments.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  pixels.forEach((pixel, index) => fragments.setColorAt(index, pixel.color));
  mark.add(fragments);
  const dummy = new THREE.Object3D();

  // A pale, fading studio floor blends into the public off-white ground.
  // The separate shadow catcher keeps the moving mark grounded.
  const floorSize = 64;
  const floorAlpha = new Uint8Array(floorSize * floorSize * 4);
  for (let y = 0; y < floorSize; y++) {
    for (let x = 0; x < floorSize; x++) {
      const distance = Math.hypot((x + 0.5) / floorSize * 2 - 1, (y + 0.5) / floorSize * 2 - 1);
      const alpha = Math.round((1 - THREE.MathUtils.smoothstep(distance, 0.25, 1)) * 255);
      floorAlpha.set([alpha, alpha, alpha, 255], (y * floorSize + x) * 4);
    }
  }
  const floorTexture = new THREE.DataTexture(floorAlpha, floorSize, floorSize);
  floorTexture.minFilter = THREE.LinearFilter;
  floorTexture.magFilter = THREE.LinearFilter;
  floorTexture.needsUpdate = true;
  const floorGeometry = new THREE.PlaneGeometry(8, 6);
  floorGeometry.rotateX(-Math.PI / 2);
  const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xeeefeb, alphaMap: floorTexture, transparent: true, opacity: 0.7, depthWrite: false, toneMapped: false });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.position.set(0, -2.4, -1);
  scene.add(floor);
  const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.2, depthWrite: false });
  const shadowCatcher = new THREE.Mesh(floorGeometry, shadowMaterial);
  shadowCatcher.position.copy(floor.position);
  shadowCatcher.position.y += 0.002;
  shadowCatcher.receiveShadow = true;
  scene.add(shadowCatcher);

  let elapsed = settled ? 2 : 0;
  let previous = 0;
  let disposed = false;
  let running = false;
  const pointer = new THREE.Vector2();
  const target = new THREE.Vector2();

  const render = () => {
    const assembly = THREE.MathUtils.smoothstep(elapsed, 0.1, 1.6);
    canvas.dataset.assembly = assembly === 1 ? "settled" : "assembling";
    pixels.forEach((pixel, index) => {
      const distance = 1 - assembly;
      dummy.position.set(pixel.x - distance * (0.5 + (index % 5) * 0.14), pixel.y + distance * Math.sin(index * 2.1) * 0.3, distance * (0.12 + (index % 4) * 0.14));
      dummy.rotation.set(0, distance * 0.6, distance * Math.sin(index) * 0.4);
      dummy.scale.set(pixel.width * 0.97, pixel.height * 0.97, Math.max(0.08, Math.min(0.26, pixel.width * 1.5)));
      dummy.updateMatrix();
      fragments.setMatrixAt(index, dummy.matrix);
    });
    fragments.instanceMatrix.needsUpdate = true;
    pointer.lerp(target, 0.045);
    // Keep moving after assembly on touch screens as well as desktop. Bounded
    // rotation keeps the front of the official mark readable throughout.
    const loopTime = Math.max(0, elapsed - (settled ? 2 : 1.6));
    const drift = THREE.MathUtils.smoothstep(loopTime, 0, 1.2);
    const phase = loopTime * Math.PI * 2 / 12;
    mark.rotation.set(
      0.12 + Math.sin(phase + Math.PI / 3) * 0.07 * drift + pointer.y * 0.045,
      -0.22 + Math.sin(phase) * 0.28 * drift + pointer.x * 0.052,
      -0.025 + Math.cos(phase) * 0.018 * drift,
    );
    mark.position.y = Math.sin(phase + Math.PI / 4) * 0.075 * drift;
    key.intensity = 3.1 + Math.sin(elapsed * 0.3) * 0.16;
    rim.intensity = 2.3 + Math.sin(elapsed * 0.3 + 1.7) * 0.12;
    renderer.render(scene, camera);
  };

  const animate = (time: number) => {
    if (disposed) return;
    // Visibility/pause changes reset the timestamp; active frames use real time
    // so a slower device still finishes the entrance in the intended duration.
    elapsed += previous ? (time - previous) / 1000 : 0;
    previous = time;
    render();
  };

  const resize = () => {
    if (disposed) return;
    const { width, height } = host.getBoundingClientRect();
    if (width < 1 || height < 1) return;
    const narrow = width < 600;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2));
    const shadowSize = window.innerWidth < 1024 ? 1024 : 2048;
    if (key.shadow.mapSize.x !== shadowSize) {
      key.shadow.mapSize.set(shadowSize, shadowSize);
      key.shadow.map?.dispose();
      key.shadow.map = null;
    }
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 0.85 ? 10.6 * (0.85 / camera.aspect) : 10.6;
    camera.updateProjectionMatrix();
    render();
  };
  resize();

  return {
    setRunning(value) {
      if (disposed || running === value) return;
      running = value;
      previous = 0;
      canvas.dataset.animation = value ? "running" : "paused";
      renderer.setAnimationLoop(value ? animate : null);
    },
    setPointer(x, y) { target.set(THREE.MathUtils.clamp(x, -1, 1), THREE.MathUtils.clamp(y, -1, 1)); },
    resize,
    dispose() {
      if (disposed) return;
      disposed = true;
      renderer.setAnimationLoop(null);
      geometry.dispose(); face.dispose(); side.dispose();
      pixelGeometry.dispose(); pixelMaterial.dispose(); fragments.dispose();
      floorGeometry.dispose(); floorMaterial.dispose(); floorTexture.dispose(); shadowMaterial.dispose();
      key.shadow.dispose();
      environmentMap.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
