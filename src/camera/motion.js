import * as THREE from "three";
import { advance } from "../physics/geodesic.js";

export class Motion {
  constructor(config) {
    this.config = config;
    this.speed = 0;
    this.cf = 0;
    this.cr = 0;
    this.cu = 0;
    this.dir = new THREE.Vector3();
  }

  update(dt, axes, state) {
    const m = Math.hypot(axes.fw, axes.rt, axes.up);
    if (m > 0) {
      this.cf = axes.fw / m;
      this.cr = axes.rt / m;
      this.cu = axes.up / m;
    }
    const top = axes.boost ? this.config.boost : this.config.speed;
    this.speed += ((m > 0 ? top : 0) - this.speed) * (1 - Math.exp(-5 * dt));
    if (this.speed > 0.01) {
      this.dir
        .set(0, 0, 0)
        .addScaledVector(state.F, this.cf)
        .addScaledVector(state.R, this.cr)
        .addScaledVector(state.U, this.cu);
      advance(state, this.dir, this.speed * dt, this.config.throat);
    }
  }
}
