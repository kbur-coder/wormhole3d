float stars(vec3 d, float sc) {
  vec3 p = d * sc;
  vec3 c = floor(p);
  float h = h13(c);
  vec3 o = vec3(h13(c + 1.7), h13(c + 5.3), h13(c + 9.1));
  float dist = length(fract(p) - o);
  return step(0.82, h) * smoothstep(0.14, 0.0, dist) * (0.5 + 0.5 * h13(c + 3.3));
}

vec3 sky(vec3 d, float side) {
  bool A = side > 0.5;
  vec3 c1 = A ? vec3(0.04, 0.22, 0.6) : vec3(0.6, 0.1, 0.25);
  vec3 c2 = A ? vec3(0.1, 0.75, 0.85) : vec3(1.0, 0.55, 0.15);
  float n = fbm(d * 2.2 + (A ? 0.0 : 31.0));
  float n2 = fbm(d * 5.0 + 7.0);
  vec3 col = mix(c1, c2, smoothstep(0.4, 0.8, n)) * pow(n, 3.0) * 1.8 * (0.4 + n2);
  col += vec3(0.8, 0.9, 1.0) * stars(d, 50.0) * 1.3;
  col += vec3(1.0, 0.9, 0.8) * stars(d, 110.0);
  vec3 sd = A ? normalize(vec3(0.5, 0.3, -0.8)) : normalize(vec3(-0.6, -0.25, 0.7));
  float cs = dot(d, sd);
  vec3 sc = A ? vec3(1.0, 0.85, 0.5) : vec3(1.0, 0.3, 0.15);
  col += sc * (smoothstep(0.996, 0.9975, cs) * 2.5 + pow(max(cs, 0.0), 60.0) * 0.5);
  vec3 pd = A ? normalize(vec3(-0.7, 0.1, -0.7)) : normalize(vec3(0.4, 0.5, 0.75));
  float cp = dot(d, pd);
  float disc = smoothstep(0.985, 0.9856, cp);
  float shade = 0.25 + 0.75 * clamp(dot(normalize(d - pd), normalize(sd - pd)) * 0.5 + 0.5, 0.0, 1.0);
  vec3 pc = A ? vec3(0.3, 0.55, 1.0) : vec3(0.9, 0.7, 0.55);
  col = mix(col, pc * shade, disc);
  return col;
}
