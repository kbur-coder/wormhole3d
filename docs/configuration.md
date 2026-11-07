# Configuration reference

Every setting lives in `src/config.js` and can also be changed without editing code by adding it to the page URL.

    http://localhost:5173/?throat=3&fov=1.6

Values outside the allowed range are clamped. Values that are not numbers are ignored and the default is used.

## Settings

| Key | Default | Range | What it does |
| --- | --- | --- | --- |
| `throat` | 2 | 0.5 - 8 | Throat radius `b`. Larger values give a wider tunnel and weaker bending far from it. |
| `startL` | 16 | -40 - 40 | Starting position along the wormhole axis. Positive is universe A, negative is universe B. The camera starts facing the throat. |
| `fov` | 1.4 | 0.6 - 2.4 | Vertical field of view in radians (1.4 is about 80 degrees). |
| `initialScale` | 0.6 | 0.2 - 1 | Render resolution as a fraction of the window size when the page starts. |
| `minScale` | 0.3 | 0.2 - 1 | Lowest resolution fraction that adaptive scaling may reach. |
| `speed` | 7 | 0.5 - 60 | Flight speed in space units per second. |
| `boost` | 22 | 1 - 200 | Flight speed while Shift is held. |
| `lookSensitivity` | 0.0022 | 0.0005 - 0.01 | Radians of rotation per pixel of mouse or touch movement. |
| `rollSpeed` | 1.2 | 0 - 4 | Roll speed in radians per second for Q and E. |
| `maxSteps` | 220 | 40 - 400 | Maximum integration steps per light ray. Lower is faster, but rays that circle the throat are cut earlier. |
| `farL` | 48 | 20 - 200 | A ray counts as escaped to the sky when `abs(l)` exceeds this value. Keep it larger than `abs(startL)` and `shellMax`. |
| `shellSpacing` | 6 | 2 - 20 | Distance between wireframe spheres along `l`. |
| `shellMax` | 42 | 0 - 150 | Spheres farther than this from the throat are not drawn. Set to 0 to keep only the throat sphere. |

## Recipes

Slow GPU or integrated graphics:

    ?initialScale=0.4&minScale=0.25&maxSteps=120

High quality on a strong GPU:

    ?initialScale=1&minScale=0.6&maxSteps=300

Start on the other side:

    ?startL=-20

Wide throat, calm sky grid:

    ?throat=4&shellSpacing=10

Only the throat sphere:

    ?shellMax=0

Fast exploration:

    ?speed=15&boost=60

## Resolution scaling

The frame time is measured continuously. When the average exceeds 30 ms the render resolution drops by 15 percent, down to `minScale`. When the average stays under 18.5 ms for 8 seconds after the last drop it rises by 8 percent, up to 1. The current value is shown in the HUD. The canvas is stretched to the window, so lower resolution looks softer, not smaller.

## Changing the look

All visual parameters are in GLSL files under `src/render/shaders/`.

- Sky colors, nebulae, stars, suns and planets: `sky.glsl`. The two universes are the two branches of `sky()`, selected by `side`.
- Wireframe sphere color, line width and density: `grid.glsl` and the shell block in `main.frag`.
- Brightness and tone curve: `tonemap()` in `main.frag`.
- Step size of the light integrator: the line `float h = min(0.1 * r, 4.0);` in `main.frag`. Smaller is more accurate and slower.

After editing a shader the dev server reloads the page automatically.

## Changing the interface

- Controls hint text: `index.html`, element `#hint`.
- HUD text: `src/ui/hud.js`.
- Key bindings: `axes()` in `src/input/controls.js`.
