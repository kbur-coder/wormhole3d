import test from "node:test";
import assert from "node:assert/strict";
import { CameraState } from "../src/camera/state.js";
import { advance, radius } from "../src/physics/geodesic.js";

const B = 2;

function step(state, ds) {
  advance(state, state.F.clone(), ds, B);
  state.orthonormalize();
}

function momentum(state) {
  const c = state.F.dot(state.N);
  return radius(state.l, B) * Math.sqrt(Math.max(0, 1 - c * c));
}

test("radius is smallest at the throat and grows on both sides", () => {
  assert.equal(radius(0, B), B);
  assert.ok(radius(5, B) > B);
  assert.equal(radius(5, B), radius(-5, B));
});

test("radial motion changes l by the travelled distance", () => {
  const s = new CameraState(16);
  advance(s, s.F.clone(), 3, B);
  assert.ok(Math.abs(s.l - 13) < 1e-9);
});

test("momentum r*sin(psi) stays constant along a geodesic", () => {
  const s = new CameraState(16);
  s.yaw(0.12);
  const m0 = momentum(s);
  for (let i = 0; i < 2000; i++) {
    step(s, 0.1);
    assert.ok(Math.abs(momentum(s) - m0) < 0.1);
  }
});

test("a path with small momentum passes through the throat", () => {
  const s = new CameraState(16);
  s.yaw(0.02);
  let crossed = false;
  for (let i = 0; i < 1000; i++) {
    step(s, 0.1);
    if (s.l < 0) crossed = true;
  }
  assert.ok(crossed);
});

test("a path with large momentum is turned back by the throat", () => {
  const s = new CameraState(16);
  s.yaw(0.5);
  let minL = Infinity;
  for (let i = 0; i < 3000; i++) {
    step(s, 0.1);
    minL = Math.min(minL, s.l);
  }
  assert.ok(minL > 5);
});

test("position and frame stay normalized and orthogonal after many moves", () => {
  const s = new CameraState(16);
  for (let i = 0; i < 3000; i++) {
    s.yaw(0.01);
    s.pitch(0.007);
    const d = s.F.clone().multiplyScalar(0.6).addScaledVector(s.R, 0.5).addScaledVector(s.U, 0.62).normalize();
    advance(s, d, 0.15, B);
    s.orthonormalize();
  }
  assert.ok(Math.abs(s.N.length() - 1) < 1e-9);
  assert.ok(Math.abs(s.F.dot(s.U)) < 1e-9);
  assert.ok(Math.abs(s.F.dot(s.R)) < 1e-9);
  assert.ok(Math.abs(s.U.dot(s.R)) < 1e-9);
});
