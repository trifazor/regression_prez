# ALLBUS 2016 Interactive Regression Deck

Svelte 5 + Pyodide slide deck: linear vs. quadratic OLS of net income on age, live in the browser.

## Run

```sh
nix shell nixpkgs#nodejs_22   # or any Node >= 18
npm install
npm run dev        # http://localhost:5173
npm run build      # static site in dist/ (deploy anywhere, relative paths)
```

Keys: ← / → / Space to navigate, F for fullscreen. Slide number is in the URL hash (`#6`).

## Data

`public/data/` is generated from the GESIS archive (`data/raw/` is not committed):

```sh
unzip data/ZA6770_v2-1-0.dta.zip -d data/raw
python scripts/preprocess.py data/raw/ZA6770_v2-1-0.dta public/data   # needs pandas + statsmodels
```

ZA6770 is ISSP 2015 "Work Orientations IV". Its German sample was fielded with ALLBUS 2016.
The script keeps German respondents (`c_alphan == "DE"`) and uses `DE_RINC` as personal net income.
It drops missing codes (≥ 999990), clamps income to [100, 12000], restricts age to [18, 85], and draws
350 rows (seed 2016). `benchmarks.json` holds statsmodels reference values for parity checks.

## Layout

- `src/lib/ols.py`: the Python OLS engine (QR-based), run inside Pyodide
- `src/lib/pyodide.svelte.js`: shared runtime store (boots once)
- `src/lib/model.svelte.js`: sample, filters, fitted results
- `src/lib/charts/`: SVG plots
- `src/lib/slides/`: one component per slide
- `public/sw.js`: service worker that caches Pyodide from the CDN for offline use
