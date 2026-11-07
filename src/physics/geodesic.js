import * as THREE from "three";

const tangent = new THREE.Vector3();
const axis = new THREE.Vector3();

export function radius(l, b) {
  return Math.sqrt(l * l + b * b);
}

export function advance(state, dir, ds, b) {
  const dr = dir.dot(state.N);
  tangent.copy(dir).addScaledVector(state.N, -dr);
  const dt = tangent.length();
  if (dt < 1e-6) {
    state.l += (dr >= 0 ? 1 : -1) * ds;
    return;
  }
  tangent.multiplyScalar(1 / dt);
  const psi0 = Math.atan2(dt, dr);
  let psi = psi0;
  let dphi = 0;
  const count = Math.max(1, Math.ceil(ds / 0.1));
  const h = ds / count;
  for (let i = 0; i < count; i++) {
    const r = radius(state.l, b);
    const s = Math.sin(psi);
    dphi += (s * h) / r;
    psi -= ((state.l * s) / (r * r)) * h;
    state.l += Math.cos(psi) * h;
  }
  axis.crossVectors(state.N, tangent).normalize();
  state.N.applyAxisAngle(axis, dphi).normalize();
  state.rotateAbout(axis, dphi + (psi - psi0));
}
