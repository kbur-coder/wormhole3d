import * as THREE from "three";

export class CameraState {
  constructor(startL) {
    const dir = startL >= 0 ? -1 : 1;
    this.l = startL;
    this.N = new THREE.Vector3(0, 0, 1);
    this.F = new THREE.Vector3(0, 0, dir);
    this.U = new THREE.Vector3(0, 1, 0);
    this.R = new THREE.Vector3(-dir, 0, 0);
  }

  yaw(angle) {
    this.F.applyAxisAngle(this.U, angle);
    this.R.applyAxisAngle(this.U, angle);
  }

  pitch(angle) {
    this.F.applyAxisAngle(this.R, angle);
    this.U.applyAxisAngle(this.R, angle);
  }

  roll(angle) {
    this.U.applyAxisAngle(this.F, angle);
    this.R.applyAxisAngle(this.F, angle);
  }

  rotateAbout(axis, angle) {
    this.F.applyAxisAngle(axis, angle);
    this.U.applyAxisAngle(axis, angle);
    this.R.applyAxisAngle(axis, angle);
  }

  orthonormalize() {
    this.N.normalize();
    this.F.normalize();
    this.U.addScaledVector(this.F, -this.F.dot(this.U)).normalize();
    this.R.crossVectors(this.F, this.U);
  }
}
