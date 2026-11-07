float h13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

float vn(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = h13(i);
  float b = h13(i + vec3(1.0, 0.0, 0.0));
  float c = h13(i + vec3(0.0, 1.0, 0.0));
  float d = h13(i + vec3(1.0, 1.0, 0.0));
  float e = h13(i + vec3(0.0, 0.0, 1.0));
  float g = h13(i + vec3(1.0, 0.0, 1.0));
  float h = h13(i + vec3(0.0, 1.0, 1.0));
  float k = h13(i + vec3(1.0, 1.0, 1.0));
  return mix(mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
             mix(mix(e, g, f.x), mix(h, k, f.x), f.y), f.z);
}

float fbm(vec3 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    s += a * vn(p);
    p = p * 2.03 + 17.0;
    a *= 0.5;
  }
  return s;
}
