float gridLine(vec3 n) {
  float la = acos(clamp(n.y, -1.0, 1.0)) / 3.14159265 * 12.0;
  float lo = atan(n.z, n.x) / 6.2831853 * 24.0;
  float w = 0.06;
  float a = smoothstep(0.5 - w, 0.5, abs(fract(la) - 0.5));
  float b = smoothstep(0.5 - w, 0.5, abs(fract(lo) - 0.5)) * sqrt(max(1.0 - n.y * n.y, 0.0));
  return max(a, b);
}
