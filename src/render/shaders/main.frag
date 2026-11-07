uniform vec2 uRes;
uniform float uL;
uniform float uB;
uniform vec3 uN;
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
  float l = uL;
  float dr = dot(d, uN);
  vec3 tv = d - dr * uN;
  float dt = length(tv);
  vec3 t = dt > 1e-5 ? tv / dt
         : (abs(uN.y) < 0.9 ? normalize(cross(uN, vec3(0.0, 1.0, 0.0))) : normalize(cross(uN, vec3(1.0, 0.0, 0.0))));
  float ps = atan(dt, dr);
  float phi = 0.0;
  bool escaped = false;

  for (int i = 0; i < MAX_STEPS; i++) {
    float r = sqrt(l * l + uB * uB);
    float h = min(0.1 * r, 4.0);
    float sp = sin(ps);
    float lm = l + 0.5 * h * cos(ps);
    float sm = ps - 0.5 * h * l * sp / (r * r);
    float rm = sqrt(lm * lm + uB * uB);
    float sn = sin(sm);
    float l1 = l + h * cos(sm);
    float phi1 = phi + h * sn / rm;
    float ps1 = ps - h * lm * sn / (rm * rm);

    l = l1;
    phi = phi1;
    ps = ps1;
    if (abs(l) > FAR_L && cos(ps) * l > 0.0) {
      escaped = true;
      break;
    }
  }

  vec3 col;
  if (escaped) {
    vec3 n1 = cos(phi) * uN + sin(phi) * t;
    vec3 t1 = -sin(phi) * uN + cos(phi) * t;
    vec3 v = normalize(cos(ps) * n1 + sin(ps) * t1);
    col = sky(v, l > 0.0 ? 1.0 : 0.0);
  } else {
    col = vec3(1.0, 0.85, 0.6) * 0.7;
  }
  gl_FragColor = vec4(tonemap(col), 1.0);
}
