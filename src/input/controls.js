export class Controls {
  constructor(element, state, config) {
    this.element = element;
    this.state = state;
    this.config = config;
    this.keys = {};
    this.drag = false;
    this.touching = false;
    this.lastX = 0;
    this.lastY = 0;
    addEventListener("keydown", e => {
      this.keys[e.code] = true;
      if (e.code === "Space" || e.code.startsWith("Arrow")) e.preventDefault();
    });
    addEventListener("keyup", e => {
      this.keys[e.code] = false;
    });
    addEventListener("pointerdown", e => this.onDown(e));
    addEventListener("pointermove", e => this.onMove(e));
    addEventListener("pointerup", () => this.release());
    addEventListener("pointercancel", () => this.release());
  }

  onDown(e) {
    this.drag = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    if (e.pointerType === "mouse") {
      try {
        this.element.requestPointerLock();
      } catch (_) {}
    } else {
      this.touching = true;
    }
  }

  release() {
    this.drag = false;
    this.touching = false;
  }

  onMove(e) {
    let dx, dy;
    if (document.pointerLockElement) {
      dx = e.movementX;
      dy = e.movementY;
    } else if (this.drag) {
      dx = e.clientX - this.lastX;
      dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    } else {
      return;
    }
    const s = this.config.lookSensitivity;
    this.state.yaw(-dx * s);
    this.state.pitch(-dy * s);
  }

  update(dt) {
    const roll = ((this.keys.KeyE ? 1 : 0) - (this.keys.KeyQ ? 1 : 0)) * this.config.rollSpeed * dt;
    if (roll) this.state.roll(roll);
  }

  axes() {
    const k = this.keys;
    return {
      fw: (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0) + (this.touching ? 1 : 0),
      rt: (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0),
      up: (k.Space ? 1 : 0) - (k.KeyC || k.ControlLeft ? 1 : 0),
      boost: !!(k.ShiftLeft || k.ShiftRight)
    };
  }
}
