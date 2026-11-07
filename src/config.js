const defaults = {
  initialScale: 0.6,
  minScale: 0.3,
  fov: 1.4,
  startL: 16,
  throat: 2,
  lookSensitivity: 0.0022,
  rollSpeed: 1.2,
  speed: 7,
  boost: 22,
  maxSteps: 220,
  farL: 48,
  shellSpacing: 6,
  shellMax: 42
};

const limits = {
  initialScale: [0.2, 1],
  minScale: [0.2, 1],
  fov: [0.6, 2.4],
  startL: [-40, 40],
  throat: [0.5, 8],
  lookSensitivity: [0.0005, 0.01],
  rollSpeed: [0, 4],
  speed: [0.5, 60],
  boost: [1, 200],
  maxSteps: [40, 400],
  farL: [20, 200],
  shellSpacing: [2, 20],
  shellMax: [0, 150]
};

const params = typeof location === "undefined" ? new URLSearchParams() : new URLSearchParams(location.search);

function read(key, fallback) {
  const raw = params.get(key);
  if (raw === null || raw.trim() === "") return fallback;
  const value = Number(raw);
  if (!Number.isFinite(value)) return fallback;
  const [min, max] = limits[key];
  return Math.min(max, Math.max(min, value));
}

export const config = Object.fromEntries(
  Object.entries(defaults).map(([key, value]) => [key, read(key, value)])
);

config.maxSteps = Math.round(config.maxSteps);
