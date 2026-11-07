export class Hud {
  constructor(element) {
    this.element = element;
  }

  update(state, speed, scale) {
    this.element.textContent =
      "universe " + (state.l > 0 ? "A" : "B") +
      "\ndistance to throat " + Math.abs(state.l).toFixed(1) +
      "\nspeed " + speed.toFixed(1) +
      "\nresolution " + Math.round(scale * 100) + "%";
  }
}
