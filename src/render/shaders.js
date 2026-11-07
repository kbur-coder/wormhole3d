import vertex from "./shaders/vertex.glsl?raw";
import main from "./shaders/main.frag?raw";

export { vertex };

export function buildFragment(defines = {}) {
  const head = Object.entries(defines)
    .map(([key, value]) => "#define " + key + " " + value)
    .join("\n");
  return [head, main].join("\n");
}
