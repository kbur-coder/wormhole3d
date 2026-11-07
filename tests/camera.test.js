import test from "node:test";
import assert from "node:assert/strict";
import { CameraState } from "../src/camera/state.js";

test("camera faces the throat for both signs of the start position", () => {
  for (const startL of [16, -16]) {
    const s = new CameraState(startL);
    assert.equal(Math.sign(s.F.dot(s.N)), -Math.sign(s.l));
  }
});

test("yaw, pitch and roll keep the frame orthonormal", () => {
  const s = new CameraState(16);
  for (let i = 0; i < 500; i++) {
    s.yaw(0.03);
    s.pitch(-0.02);
    s.roll(0.05);
  }
  s.orthonormalize();
  assert.ok(Math.abs(s.F.length() - 1) < 1e-9);
  assert.ok(Math.abs(s.U.length() - 1) < 1e-9);
  assert.ok(Math.abs(s.R.length() - 1) < 1e-9);
  assert.ok(Math.abs(s.F.dot(s.U)) < 1e-9);
  assert.ok(Math.abs(s.F.dot(s.R)) < 1e-9);
});
