import "./style.css";
import { config } from "./config.js";
import { installErrorOverlay } from "./ui/errors.js";
import { vertex, buildFragment } from "./render/shaders.js";
import { Renderer } from "./render/renderer.js";
import { CameraState } from "./camera/state.js";
import { Motion } from "./camera/motion.js";
import { Controls } from "./input/controls.js";

const showError = installErrorOverlay(document.getElementById("error"));

const fragment = buildFragment();

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

let last = performance.now();

renderer.start(() => {
  const now = performance.now();
  const raw = (now - last) / 1000;
  last = now;
  const dt = Math.min(raw, 0.05);
  controls.update(dt);
  motion.update(dt, controls.axes(), state);
  state.orthonormalize();
  uniforms.uL.value = state.l;
  renderer.render();
});
