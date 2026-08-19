# Milliards

An interactive 2D particle physics sandbox. Click to place charged particles on a canvas
and watch them interact through electromagnetic and strong nuclear forces, rendered with a
live force-field visualization and a bloom pass.

Built with Svelte 5, TypeScript, and Vite.

## Getting started

```sh
npm install
npm run dev
```

Then open the URL Vite prints (default <http://localhost:5173>).

## Controls

| Input | Action |
| --- | --- |
| Click | Place a particle of the currently selected type |
| Shift + drag | Pan the camera |

The toolbar in the top-left selects what gets placed and toggles display options:

| Button | Meaning |
| --- | --- |
| `P` | Place protons (red) |
| `N` | Place neutrons (white) |
| `E` | Place electrons (blue) |
| `C` | Toggle interaction range circles |
| `M` | Toggle minimal particle rendering |
| ⚙ | Open settings |

The settings panel exposes sliders for **electromagnetic range** and **electromagnetic
strength**, which update the simulation live.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run check` | Type-check with `svelte-check` and `tsc` |

## Project structure

```
src/
├── App.svelte          # Canvas setup, input handling, render loop
├── main.ts             # App entry point
├── classes/
│   ├── Particle.ts     # Base particle: physics and rendering
│   ├── Red.ts          # Proton
│   ├── White.ts        # Neutron
│   ├── Blue.ts         # Electron
│   ├── Field.ts        # Force-field sampling and visualization
│   ├── Camera.ts       # Pan/zoom state
│   └── Vector2.ts      # 2D vector math
└── util/
    ├── Draw.ts         # Batched canvas drawing helpers
    └── Math.ts         # lerp, smoothstep
```
