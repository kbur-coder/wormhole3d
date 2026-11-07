import "./style.css";
import { config } from "./config.js";
import { installErrorOverlay } from "./ui/errors.js";
import { vertex, buildFragment } from "./render/shaders.js";
import { Renderer } from "./render/renderer.js";

const showError = installErrorOverlay(document.getElementById("error"));

const fragment = buildFragment();

const renderer = new Renderer({
  vertex,
  fragment,
  uniforms: {},
  scale: config.initialScale,
  onError: showError
});

renderer.start(() => renderer.render());
