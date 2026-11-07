# Wormhole 3D

Real-time GPU ray tracer of an Ellis wormhole. Fly through the throat and look at a second universe, with every pixel tracing a light ray along geodesics of the wormhole metric.

![status](https://github.com/kbur-coder/wormhole3d/actions/workflows/ci.yml/badge.svg)

## Features

- Light is traced per pixel in a fragment shader by integrating the geodesic equations of the Ellis wormhole.
- Two procedural universes with different skies, visible through the throat with gravitational lensing and a photon ring.
- Free six-degree flight. The camera moves along geodesics and its orientation is parallel transported, so flying through the throat is seamless.
- Wireframe spheres at fixed distances make the bending of space visible.
- Adaptive resolution keeps the frame rate usable on weak GPUs.
- All settings can be changed from the page URL.
- Unit tests for the geodesic physics, GitHub Actions CI and a ready Netlify config.

## Quick start

Requirements: [Node.js](https://nodejs.org) 18 or newer (20 recommended) and a browser with WebGL2.

    git clone https://github.com/kbur-coder/wormhole3d.git
    cd wormhole3d
    npm install
    npm run dev

Vite prints the address, normally http://localhost:5173, and opens the browser. The printed `Network` address opens the same page on a phone in the same Wi-Fi network.

## Run without a server

    npm run build

creates `dist/index.html`, one self-contained file with the code, shaders and three.js inside. Open it with a double click, or upload it to any static host. `npm run preview` serves the built page locally.

## Controls

| Input | Action |
| --- | --- |
| Click | capture the mouse |
| Mouse | look around |
| W A S D | fly forward, left, back, right |
| Space / C | up / down |
| Q / E | roll |
| Shift | boost |
| Esc | release the mouse |
| Touch | drag to look, keep the finger down to fly forward |

## Settings

Add parameters to the URL:

    http://localhost:5173/?throat=3&fov=1.6&initialScale=0.5

| Key | Default | Meaning |
| --- | --- | --- |
| `throat` | 2 | throat radius |
| `startL` | 16 | start position, negative values start in universe B |
| `fov` | 1.4 | vertical field of view in radians |
| `initialScale` | 0.6 | starting render resolution as a fraction of the window |
| `speed` / `boost` | 7 / 22 | flight speed and boost speed |
| `maxSteps` | 220 | integration steps per ray, lower is faster |
| `shellSpacing` / `shellMax` | 6 / 42 | wireframe sphere spacing and range |

The full list with ranges, performance recipes and instructions for changing colors and text is in [docs/configuration.md](docs/configuration.md).

## Deploy to Netlify

The repository contains `netlify.toml`, so no settings have to be typed in.

From GitHub:

1. Push the repository to GitHub.
2. In Netlify choose **Add new site**, **Import an existing project**, **GitHub** and select the repository.
3. Leave the defaults. Build command `npm run build` and publish directory `dist` are read from `netlify.toml`.
4. Press **Deploy**. Every later push to `main` redeploys the site.

Without GitHub:

1. Run `npm run build`.
2. Open https://app.netlify.com/drop and drag the `dist` folder into the page.

## Project structure

    index.html
    vite.config.js
    netlify.toml
    src/
      main.js                 entry point and frame loop
      config.js               settings and URL overrides
      style.css
      camera/
        state.js              position and orientation frame
        motion.js             speed smoothing and movement direction
      physics/
        geodesic.js           geodesic stepping with parallel transport
      input/
        controls.js           mouse, touch and keyboard
      render/
        renderer.js           three.js fullscreen quad, error reporting
        shaders.js            joins GLSL files and injects constants
        adaptive.js           resolution scaling by frame time
        shaders/
          vertex.glsl
          noise.glsl          hash, value noise, fbm
          sky.glsl            procedural skies
          grid.glsl           latitude and longitude lines
          main.frag           ray integration and shading
      ui/
        hud.js
        errors.js             on-screen error messages
    tests/                    node:test unit tests
    docs/
      configuration.md
      math.md

## How it works

The space has the metric `ds^2 = dl^2 + (l^2 + b^2) dOmega^2`. Light follows geodesics, which obey

    dl/ds   = cos(psi)
    dphi/ds = sin(psi) / r
    dpsi/ds = -l sin(psi) / r^2

with `r = sqrt(l^2 + b^2)`. Each pixel integrates these equations until the ray escapes through one side and then reads a procedural sky in the final direction. The derivation, the camera motion and the accuracy notes are in [docs/math.md](docs/math.md).

## Troubleshooting

- **Black page and a red message at the top.** The message names the problem: unsupported WebGL2, a shader compile error, or a failed module load. The same text is in the browser console (F12).
- **The page opens but nothing moves.** Click the page first so it can capture the mouse.
- **Low frame rate.** Open the page with `?initialScale=0.4&maxSteps=120`, enable hardware acceleration in the browser and use the discrete GPU if the machine has one.
- **`dist/index.html` is blank when opened from disk.** Rebuild with `npm run build`; the single-file build is meant to work from `file://`.
- **`npm run dev` does not open the browser.** Open the printed address by hand.

## Scripts

| Command | Action |
| --- | --- |
| `npm run dev` | development server with live reload |
| `npm run build` | production build into `dist/` |
| `npm run preview` | serve the production build |
| `npm test` | run unit tests |

## License

MIT. three.js is MIT licensed by its authors.
