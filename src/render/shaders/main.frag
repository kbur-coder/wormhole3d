uniform vec2 uRes;
uniform vec3 uF;
uniform vec3 uU;
uniform vec3 uR;
uniform float uFov;

vec3 tonemap(vec3 c) {
  c = 1.0 - exp(-c * 1.3);
  return pow(c, vec3(0.85));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;
  vec3 d = normalize(uF + uR * (uv.x * uFov) + uU * (uv.y * uFov));
  gl_FragColor = vec4(tonemap(sky(d, 1.0)), 1.0);
}
