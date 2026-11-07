export class AdaptiveScale {
  constructor(config) {
    this.config = config;
    this.ema = 0.016;
    this.frames = 0;
    this.time = 0;
    this.lastDown = 0;
  }

  update(raw, renderer) {
    const clamped = Math.min(raw, 0.2);
    this.time += clamped;
    this.ema += (clamped - this.ema) * 0.1;
    this.frames++;
    if (this.frames % 40 !== 0) return;
    if (this.ema > 0.03 && renderer.scale > this.config.minScale) {
      renderer.setScale(renderer.scale * 0.85);
      this.lastDown = this.time;
    } else if (this.ema < 0.0185 && renderer.scale < 1 && this.time - this.lastDown > 8) {
      renderer.setScale(Math.min(1, renderer.scale * 1.08));
    }
  }
}
