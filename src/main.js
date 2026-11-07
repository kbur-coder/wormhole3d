import "./style.css";
import { config } from "./config.js";
import { installErrorOverlay } from "./ui/errors.js";
import { vertex, buildFragment } from "./render/shaders.js";
import { Renderer } from "./render/renderer.js";
import { AdaptiveScale } from "./render/adaptive.js";
import { CameraState } from "./camera/state.js";
import { Motion } from "./camera/motion.js";
import { Controls } from "./input/controls.js";
import { Hud } from "./ui/hud.js";

const showError = installErrorOverlay(document.getElementById("error"));

const fragment = buildFragment({
  MAX_STEPS: String(config.maxSteps),
  FAR_L: config.farL.toFixed(1),
  SHELL_SPACING: config.shellSpacing.toFixed(1),
  SHELL_MAX: config.shellMax.toFixed(1)
});

const state = new CameraState(config.startL);

const uniforms = {
  uL: { value: state.l },
  uB: { value: config.throat },
  uN: { value: state.N },
  uF: { value: state.F },
  uU: { value: state.U },
  uR: { value: state.R },
  uFov: { value: Math.tan(0.5 * config.fov) }
};

const renderer = new Renderer({
  vertex,
  fragment,
  uniforms,
  scale: config.initialScale,
  onError: showError
});
const controls = new Controls(renderer.canvas, state, config);
const motion = new Motion(config);
const adaptive = new AdaptiveScale(config);
const hud = new Hud(document.getElementById("hud"));

let last = performance.now();

renderer.start(() => {
  const now = performance.now();
  const raw = (now - last) / 1000;
  last = now;
  const dt = Math.min(raw, 0.05);
  adaptive.update(raw, renderer);
  controls.update(dt);
  motion.update(dt, controls.axes(), state);
  state.orthonormalize();
  uniforms.uL.value = state.l;
  hud.update(state, motion.speed, renderer.scale);
  renderer.render();
});
