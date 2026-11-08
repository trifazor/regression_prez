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

## Workshop flow (alpha_test)

60 minutes, 4 presenters. Set presenter names in `src/lib/sections.js`.

| Slides | Min | Who | Part |
|---|---|---|---|
| 1–2 | 0–5 | Everyone | Title; mystery scatter + class vote |
| 3–6 | 5–17 | Presenter 1 | Purpose, averages that move, fit-by-hand line, model anatomy |
| 7–11 | 17–29 | Presenter 2 | Assumptions, geometry, reading output, interpretation drill, flexible shapes |
| 12–17 | 29–39 | Presenter 3 | Five hazards, each on a toy dataset |
| 18–24 | 39–48 | Presenter 4 | The ALLBUS case, men vs women, hazard-by-hazard verdict |
| 25–27 | 48–60 | Everyone | Group exercise (6 subsamples in JASP), takeaways |
| 28 | – | – | Appendix: live lab for Q&A |

Votes and group answers live in memory: a page reload clears them.

## Layout

- `src/lib/ols.py`: the Python OLS engine (QR-based), run inside Pyodide
- `src/lib/pyodide.svelte.js`: shared runtime store (boots once)
- `src/lib/model.svelte.js`: sample, filters, fitted results
- `src/lib/charts/`: SVG plots
- `src/lib/deck/`: one component per slide (`index.js` lists them)
- `src/lib/toy.js`: seeded toy datasets for Parts 1–3
- `src/lib/explain/glossary.js`: explanation-thread entries
- `public/sw.js`: service worker that caches Pyodide from the CDN for offline use
