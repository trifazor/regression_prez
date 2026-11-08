import json
import numpy as np
from scipy import stats

DATA = {}


def load(payload):
    d = json.loads(payload)
    for k, v in d.items():
        DATA[k] = np.asarray(v, dtype=float)


def _ols(X, y):
    """OLS via QR (numerically identical to (X'X)^-1 X'y, but stable for age^2)."""
    Q, R = np.linalg.qr(X)
    b = np.linalg.solve(R, Q.T @ y)
    Rinv = np.linalg.inv(R)
    xtx_inv = Rinv @ Rinv.T
    fitted = X @ b
    e = y - fitted
    n, k = X.shape
    rss = float(e @ e)
    df = n - k
    s2 = rss / df
    se = np.sqrt(np.diag(xtx_inv) * s2)
    t = b / se
    p = 2 * stats.t.sf(np.abs(t), df)
    tss = float(((y - y.mean()) ** 2).sum())
    hat = (Q ** 2).sum(axis=1)
    return dict(b=b, se=se, t=t, p=p, xtx_inv=xtx_inv, fitted=fitted, e=e, rss=rss, tss=tss,
                df=df, s2=s2, hat=hat, n=n, k=k, X=X)


def _design(age, degree):
    return np.column_stack([age ** j for j in range(degree + 1)])


def fit(mask_json):
    """Fit linear and quadratic models on the masked rows; return everything the UI needs."""
    mask = np.asarray(json.loads(mask_json), dtype=bool)
    age, y = DATA["age"][mask], DATA["income"][mask]
    n = int(mask.sum())
    grid = np.linspace(age.min(), age.max(), 80) if n else np.array([])
    tcrit = stats.t.ppf(0.975, n - 3) if n > 3 else np.nan
    out = {"n": n, "idx": np.flatnonzero(mask).tolist(), "grid": grid.tolist()}
    models = {}
    for name, deg in (("linear", 1), ("quadratic", 2)):
        m = _ols(_design(age, deg), y)
        G = _design(grid, deg)
        yhat = G @ m["b"]
        tc = stats.t.ppf(0.975, m["df"])
        half = tc * np.sqrt(np.einsum("ij,jk,ik->i", G, m["xtx_inv"], G) * m["s2"])
        r2 = 1 - m["rss"] / m["tss"]
        lev = m["hat"]
        std_res = m["e"] / np.sqrt(m["s2"] * (1 - lev))
        models[name] = {
            "b": m["b"].tolist(), "se": m["se"].tolist(), "t": m["t"].tolist(), "p": m["p"].tolist(),
            "r2": r2, "adj_r2": 1 - (1 - r2) * (n - 1) / m["df"], "rss": m["rss"], "df": m["df"],
            "sigma": float(np.sqrt(m["s2"])),
            "fitted": m["fitted"].tolist(), "resid": m["e"].tolist(), "hat": lev.tolist(),
            "std_resid": std_res.tolist(),
            "curve": yhat.tolist(), "lo": (yhat - half).tolist(), "hi": (yhat + half).tolist(),
            "orth": (m["X"].T @ m["e"]).tolist(),   # X'e, should be ~0
        }
    lin, quad = models["linear"], models["quadratic"]
    F = (lin["rss"] - quad["rss"]) / (quad["rss"] / quad["df"])
    b1, b2 = quad["b"][1], quad["b"][2]
    out.update(models)
    out["ftest"] = {"F": F, "df1": 1, "df2": quad["df"], "p": float(stats.f.sf(F, 1, quad["df"])),
                    "dR2": quad["r2"] - lin["r2"], "fcrit": float(stats.f.ppf(0.95, 1, quad["df"]))}
    out["peak"] = (-b1 / (2 * b2)) if b2 < 0 else None
    # Q-Q theoretical quantiles for standardized residuals (Blom positions)
    out["qq"] = stats.norm.ppf((np.arange(1, n + 1) - 0.375) / (n + 0.25)).tolist()
    return json.dumps(out, allow_nan=False, default=float)


def _report(m, names, Xgrid=None):
    """Common output for a fitted model: classical + HC1 robust inference, optional prediction band."""
    n, k = m["n"], m["k"]
    X, e = m["X"], m["e"]
    meat = (X * (e ** 2)[:, None]).T @ X
    v_hc1 = m["xtx_inv"] @ meat @ m["xtx_inv"] * n / (n - k)
    se_r = np.sqrt(np.diag(v_hc1))
    t_r = m["b"] / se_r
    out = {
        "names": names, "b": m["b"].tolist(), "se": m["se"].tolist(), "t": m["t"].tolist(), "p": m["p"].tolist(),
        "se_robust": se_r.tolist(), "p_robust": (2 * stats.t.sf(np.abs(t_r), m["df"])).tolist(),
        "r2": 1 - m["rss"] / m["tss"], "rss": m["rss"], "df": m["df"], "n": n, "sigma": float(np.sqrt(m["s2"])),
        "fitted": m["fitted"].tolist(), "resid": m["e"].tolist(), "hat": m["hat"].tolist(),
    }
    if Xgrid is not None:
        yhat = Xgrid @ m["b"]
        half = stats.t.ppf(0.975, m["df"]) * np.sqrt(np.einsum("ij,jk,ik->i", Xgrid, m["xtx_inv"], Xgrid) * m["s2"])
        out.update(curve=yhat.tolist(), lo=(yhat - half).tolist(), hi=(yhat + half).tolist())
    return out


def fit_design(payload):
    """Generic OLS for the toy datasets.
    payload = {"y": [...], "columns": {name: [...]}, "grid": {name: [...]} (optional, same column names)}
    A constant is always added first."""
    d = json.loads(payload)
    y = np.asarray(d["y"], dtype=float)
    names = ["const"] + list(d["columns"])
    X = np.column_stack([np.ones_like(y)] + [np.asarray(d["columns"][c], dtype=float) for c in d["columns"]])
    G = None
    if d.get("grid"):
        g = d["grid"]
        glen = len(next(iter(g.values())))
        G = np.column_stack([np.ones(glen)] + [np.asarray(g[c], dtype=float) for c in d["columns"]])
    return json.dumps(_report(_ols(X, y), names, G), allow_nan=False, default=float)


def fit_sex(mask_json):
    """Quadratic age profile with a female dummy and female x age interactions.
    income = b0 + b1 age + b2 age^2 + b3 F + b4 F*age + b5 F*age^2"""
    mask = np.asarray(json.loads(mask_json), dtype=bool)
    age, y = DATA["age"][mask], DATA["income"][mask]
    fem = (DATA["sex"][mask] == 2).astype(float)
    a2 = age ** 2
    full = _ols(np.column_stack([np.ones_like(age), age, a2, fem, fem * age, fem * a2]), y)
    dummy = _ols(np.column_stack([np.ones_like(age), age, a2, fem]), y)
    pooled = _ols(np.column_stack([np.ones_like(age), age, a2]), y)

    def ftest(r, u, q):
        F = ((r["rss"] - u["rss"]) / q) / (u["rss"] / u["df"])
        return {"F": F, "df1": q, "df2": u["df"], "p": float(stats.f.sf(F, q, u["df"]))}

    grid = np.linspace(18, 85, 80)
    b = full["b"]
    curves, peaks = {}, {}
    for label, f in (("men", 0.0), ("women", 1.0)):
        G = np.column_stack([np.ones_like(grid), grid, grid ** 2, f + 0 * grid, f * grid, f * grid ** 2])
        curves[label] = (G @ b).tolist()
        c1, c2 = b[1] + f * b[4], b[2] + f * b[5]
        peaks[label] = float(-c1 / (2 * c2)) if c2 < 0 else None
    names = ["const", "age", "age²", "female", "female×age", "female×age²"]
    out = _report(full, names)
    out.update(grid=grid.tolist(), curves=curves, peaks=peaks,
               dummy={"b": dummy["b"].tolist(), "p": dummy["p"].tolist()},
               test_interaction=ftest(dummy, full, 2), test_any_sex=ftest(pooled, full, 3),
               sex=DATA["sex"][mask].astype(int).tolist(), idx=np.flatnonzero(mask).tolist())
    return json.dumps(out, allow_nan=False, default=float)
