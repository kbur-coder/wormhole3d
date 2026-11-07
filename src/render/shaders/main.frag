uniform vec2 uRes;

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  gl_FragColor = vec4(uv, 0.5, 1.0);
}
