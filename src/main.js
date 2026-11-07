import "./style.css";
import { config } from "./config.js";
import { installErrorOverlay } from "./ui/errors.js";
import { vertex, buildFragment } from "./render/shaders.js";
import { Renderer } from "./render/renderer.js";
import { CameraState } from "./camera/state.js";

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

renderer.start(() => {
  state.orthonormalize();
  uniforms.uL.value = state.l;
  renderer.render();
});
