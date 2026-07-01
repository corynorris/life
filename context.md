# Codebase Context: Conway's Game of Life

## 1. What the App Does

An interactive implementation of **Conway's Game of Life** — a zero-player cellular automaton simulation. Users can click cells on a 20×30 grid to set initial states, then run or step through generations. The simulation follows the classic rules:

- Any live cell with 2 or 3 live neighbours survives.
- Any dead cell with exactly 3 live neighbours becomes alive.
- All other cells die or stay dead.

Three cell states are tracked: `dead` (0), `alive` (1), and `born` (2 — visually distinct for one tick, then transitions to `alive`).

Features: Play/pause 200ms auto-advance, manual "next" step, randomize board, reset board, click-to-toggle cells. Demo at https://corynorris.github.io/life/.

## 2. Tech Stack and Key Dependencies

| Package                    | Version | Purpose                                       |
| -------------------------- | ------- | --------------------------------------------- |
| `react`                    | ^18.2.0 | UI framework                                  |
| `react-dom`                | ^18.2.0 | DOM rendering                                 |
| `redux`                    | ^4.2.1  | State management (legacy API)                 |
| `react-redux`              | ^8.1.2  | React-Redux bindings                          |
| `vite`                     | ^4.4.9  | Build tool / dev server                       |
| `@vitejs/plugin-react-swc` | ^3.3.2  | Vite React plugin (SWC-based)                 |
| `vite-plugin-svgr`         | ^3.2.0  | **Unused** — not referenced in vite.config.js |
| `vite-tsconfig-paths`      | ^4.2.1  | **Unused** — no tsconfig.json exists          |
| `gh-pages`                 | ^6.0.0  | GitHub Pages deployment (devDep)              |

Originally bootstrapped with **Create React App**, then migrated to **Vite** (commit `b9830c9`). Remnants of the CRA + Heroku era remain (see Issues).

## 3. File Structure Overview

```
life/
├── .buildpacks              # Dead Heroku artifact (points to CRA buildpack)
├── .github/workflows/
│   └── gh-pages.yml         # GitHub Actions: npm install → vite build → deploy dist/ to Pages
├── .gitignore
├── Procfile                 # Dead Heroku artifact (references missing bin/boot)
├── README.md                # One-paragraph description + rules + demo link
├── index.html               # SPA shell, loads /src/index.jsx as module
├── package.json             # Scripts: start/build/serve
├── package-lock.json
├── vite.config.js           # base: '/life/', plugin: react-swc
└── src/
    ├── index.jsx            # Entry: creates Redux store, renders <Provider><App/></Provider>
    ├── index.css            # Body font + color
    ├── App.jsx              # Root component (class), renders Grid + Controls + Generation
    ├── App.css              # Center text, button styling
    ├── constants.js         # GRID_HEIGHT: 20, GRID_WIDTH: 30
    ├── actions/
    │   └── index.js         # 6 action creators: makeGrid, makeRandomGrid, spawnCell, stepForward, play, pause
    ├── core/
    │   ├── core.js          # Pure game logic: makeGrid, makeRandomGrid, countNeighbours, updateGrid, isAlive, states
    │   └── core.test.js     # Jest tests for core.js (grid creation, neighbor counting, rule transitions)
    ├── reducers/
    │   ├── index.js         # combineReducers({ cells, interval, generations })
    │   ├── cells.js         # Grid state reducer (MAKE_GRID, MAKE_RANDOM_GRID, SPAWN_CELL, STEP_FORWARD)
    │   ├── generations.js   # Generation counter (resets on new grid, increments on STEP_FORWARD)
    │   └── interval.js      # setInterval ID storage (0 when paused)
    └── components/
        ├── Button.jsx       # Functional component: <button onClick={handleClick}>{message}</button>
        ├── Cell.jsx         # Functional component: <td> with CSS class based on cell state
        ├── Cell.css         # Cell dimensions (15×15px), colors for .born/.alive, table borders
        ├── Controls.jsx     # Class component: play/pause, next, randomize, reset buttons
        ├── Controls.css     # **Empty file (0 bytes)**
        ├── Generation.jsx   # Functional component: displays generation counter
        ├── Grid.jsx         # Class component: renders table of Cell components
        └── Grid.css         # Centers table, collapse borders
```

### Key Data Flow

```
User Click → Grid.onCellClick(x,y) → dispatch(spawnCell(x,y))
  → cells reducer: cell at [y][x] = states.born

Play button → setInterval(stepForward, 200ms) → dispatch(stepForward())
  → cells reducer: updateGrid(state) → new grid
  → generations reducer: state + 1

Controls auto-plays on component mount (componentDidMount calls onPlay).
```

### State Shape (Redux Store)

```js
{
  cells: number[][]       // 20×30 grid of 0 (dead), 1 (alive), 2 (born)
  interval: number,       // setInterval ID, or 0 when paused
  generations: number     // integer counter
}
```

## 4. How It's Built/Deployed

**Development:**

```bash
npm start        # vite dev server (defaults to port 5173)
```

**Build:**

```bash
npm run build    # vite build → outputs to dist/
```

**Preview production build:**

```bash
npm run serve    # vite preview
```

**Deployment:**

- GitHub Actions workflow (`.github/workflows/gh-pages.yml`) triggers on push to `main`.
- Steps: checkout → node 18 setup → `npm install` → `npm run build` → upload `dist/` artifact → deploy to GitHub Pages.
- Vite `base` set to `/life/` to match the repo name for GitHub Pages URL routing.

**Dead deployment artifacts:**

- `Procfile` + `.buildpacks`: Heroku deployment remnants. The `bin/boot` script referenced in Procfile does not exist.
- The `homepage` field in package.json (`https://corynorris.github.com/life`) is a CRA legacy field; Vite ignores it.

## 5. Issues and Outdated Patterns

### Severity: High

1. **Legacy Redux (no Redux Toolkit)** — Uses `createStore`, manual action type strings (`'MAKE_GRID'`), manual `mapStateToProps`/`mapDispatchToProps`. Modern convention is Redux Toolkit (`configureStore`, `createSlice`, `useSelector`/`useDispatch` hooks). `createStore` is officially deprecated and will be removed in Redux 5.

2. **Class components everywhere** — `App.jsx`, `Controls.jsx`, and `Grid.jsx` are `React.Component` subclasses. React 18+ supports class components but the ecosystem has fully moved to functional components with hooks. This blocks adopting Redux hooks (`useSelector`, `useDispatch`).

### Severity: Medium

3. **Redux DevTools enabled unconditionally** — `src/index.jsx` line 12: `window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()` runs in production with no gating. Should be dev-only.

4. **Shallow copy mutation risk** — `cells.js` reducer: `let nextState = state.slice(0)` only does a shallow copy. For `SPAWN_CELL`, it mutates the inner array: `nextState[action.y][action.x] = states.born;`. Since each row is an array and `slice(0)` only clones the outer array, nested arrays are shared references. While this happens to work because the mutation replaces a primitive value (number), it violates Redux immutability principles and would break if cell state were an object.

5. **Unused dependencies** — `vite-plugin-svgr` and `vite-tsconfig-paths` are in `package.json` dependencies but:
   - Neither is imported in `vite.config.js`
   - `vite-tsconfig-paths` has no `tsconfig.json` to work with

6. **`private: false`** in `package.json` — should be `true` to prevent accidental `npm publish`.

### Severity: Low

7. **Dead Heroku artifacts** — `.buildpacks`, `Procfile`, missing `bin/boot`.

8. **Empty Controls.css** — 0 bytes. Should be deleted.

9. **Legacy `homepage` field** — CRA field, ignored by Vite. Can be removed or moved to workflow config.

10. **CSS in JS mismatch with external stylesheets** — Mix of global CSS (`index.css`, `App.css`), component CSS imports (`Cell.css`, `Grid.css`), and an empty `Controls.css`.

11. **Controls auto-plays on mount** — `Controls.jsx:componentDidMount()` calls `this.onPlay()`. There's a logic gap: the play button text toggles between "play" and "pause", but clicking "pause" while already paused (interval=0) calls `clearInterval(0)` which is a no-op, then `this.props.onPlayClick(0)`. The behavior works but the code is unnecessarily defensive.

12. **Google Fonts loaded via CDN** with no `preconnect` hints — `index.html` loads Rubik and Open Sans from the legacy `fonts.googleapis.com/css` URL without `rel="preconnect"` for performance.

13. **GitHub Actions uses deprecated `upload-pages-artifact@v1` and `deploy-pages@v1`** — v1 is deprecated; should use v3+.

14. **`package-lock.json` uses lockfileVersion 3** — consistent with npm 7+, fine.

## Start Here

Open `src/core/core.js` first — it contains the pure game logic (grid creation, neighbor counting, state transitions) and is the most self-contained module. Then move to `src/reducers/cells.js` to see how the game state is managed via Redux actions.

## Key Files for Any Refactoring Effort

| Task                             | Primary Files                                                                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migrate to Redux Toolkit         | `src/index.jsx`, `src/reducers/*.js`, `src/actions/index.js`, `src/components/Controls.jsx`, `src/components/Grid.jsx`, `src/components/Generation.jsx` |
| Convert to functional components | `src/App.jsx`, `src/components/Controls.jsx`, `src/components/Grid.jsx`                                                                                 |
| Fix immutability in reducer      | `src/reducers/cells.js`                                                                                                                                 |
| Clean up dead config             | `.buildpacks`, `Procfile`, `package.json` (unused deps, homepage field)                                                                                 |
| Update CI                        | `.github/workflows/gh-pages.yml` (action versions)                                                                                                      |
