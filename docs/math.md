# Math notes

This page explains what the shader computes. No general relativity background is needed beyond the idea that light follows shortest paths.

## The space

The Ellis wormhole is a static space whose spatial part has the metric

    ds^2 = dl^2 + (l^2 + b^2) dOmega^2

`l` runs from minus infinity to plus infinity. `dOmega^2` is the metric of the unit sphere. The sphere at a given `l` has radius

    r(l) = sqrt(l^2 + b^2)

so spheres shrink to the smallest radius `b` at `l = 0` (the throat) and grow again on the other side. Positive `l` is universe A, negative `l` is universe B. Far from the throat the space is flat.

The corresponding spacetime is ultrastatic: the time part of the metric is constant. Because of that, light rays follow geodesics of the spatial metric exactly, and there is no gravitational redshift to model.

## Geodesics

A light ray stays in one plane through the center of the wormhole. Use the angle `psi` between the ray and the radial direction `dl`. Spherical symmetry gives a conserved quantity, the angular momentum

    L = r sin(psi)

Differentiating `r sin(psi) = const` with `dr/dl = l / r` gives the equations used for rays and for the camera, per unit path length `s`:

    dl/ds   = cos(psi)
    dphi/ds = sin(psi) / r
    dpsi/ds = -l sin(psi) / r^2

Here `phi` is the angle swept inside the plane of motion. For `b = 0` these are the equations of a straight line in polar coordinates.

Rays with `L < b` pass through the throat. Rays with `L > b` are turned back before reaching it. A ray with `L = b` approaches the throat and circles it indefinitely. That is the unstable photon orbit, drawn as the bright ring.

## Tracing a pixel

For each pixel the shader builds a direction `d` in the camera frame (forward, right, up). With `N` the unit vector from the wormhole center to the camera:

1. `d_r = d . N` is the radial component, `t` is the unit tangential part of `d`, and `psi = atan2(|d_t|, d_r)`.
2. The ray is integrated with the midpoint method. The step is `0.1 r`, so it is small near the throat and large far away.
3. When `abs(l)` exceeds `farL` while moving outward, the ray has escaped. Its final position direction is `n = cos(phi) N + sin(phi) t` and its tangent is `t' = -sin(phi) N + cos(phi) t`.
4. The final travel direction `v = cos(psi) n + sin(psi) t'` indexes a procedural sky. `l > 0` selects the sky of universe A, `l < 0` the sky of universe B.
5. A ray that uses all `maxSteps` without escaping is circling the throat and is painted with the photon ring color.

## Wireframe spheres

At every multiple of `shellSpacing` the shader checks whether a step crossed that value of `l`. If it did, the crossing point is found by linear interpolation of `phi`, and a latitude and longitude grid is evaluated at that point. The sum of all crossings is added to the sky color. The sphere at `l = 0` is the throat itself.

## Moving the camera

The camera follows the same geodesic equations in a small loop on the CPU (`src/physics/geodesic.js`). After each step:

- the position direction `N` is rotated about the axis `N x t` by `dphi`;
- the orientation frame (forward, up, right) is rotated about the same axis by `dphi + dpsi`.

The extra `dpsi` is parallel transport: the camera keeps its angle to the path while the path bends relative to the local radial direction. Without it the view would twist when flying around the throat. The frame is re-orthonormalized every frame.

## Accuracy

- Rays use a second-order midpoint scheme. Camera motion uses a first-order scheme with at most 0.1 units per sub-step. The conserved momentum drifts by about 3 percent over a 400-unit flight, which is invisible on screen. `tests/geodesic.test.js` checks this bound.
- The sky is at infinity and is not lensed in depth. Objects at finite distance are not modeled.
- The camera speed is far below the speed of light, so aberration and Doppler shift are ignored.

## References

- T. Müller, "Exact geometric optics in a Morris-Thorne wormhole spacetime", Phys. Rev. D 77, 044043 (2008).
- O. James, E. von Tunzelmann, P. Franklin, K. S. Thorne, "Gravitational lensing by spinning black holes in astrophysics, and in the movie Interstellar", Class. Quantum Grav. 32, 065001 (2015).
- H. G. Ellis, "Ether flow through a drainhole", J. Math. Phys. 14, 104 (1973).
