"""Build the 350-row ALLBUS 2016 (German ISSP 2015 sample, ZA6770) subsample.

Usage: python scripts/preprocess.py data/raw/ZA6770_v2-1-0.dta public/data
"""
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import statsmodels.api as sm

SRC, OUT = Path(sys.argv[1]), Path(sys.argv[2])
N, SEED = 350, 2016

df = pd.read_stata(SRC, convert_categoricals=False, columns=["c_alphan", "AGE", "SEX", "DE_RINC"])
df = df[df.c_alphan == "DE"].rename(columns={"AGE": "age", "SEX": "sex", "DE_RINC": "income"})
df = df[(df.income > 0) & (df.income < 999990)]          # drop missing / refusal codes
df = df[df.age.between(18, 85) & df.sex.isin([1, 2])]
df["income"] = df.income.clip(100, 12000)
df = df.sample(n=N, random_state=SEED).sort_values("age").reset_index(drop=True)
df = df.astype({"income": int, "age": int, "sex": int})
df["age_sq"] = df.age ** 2
df = df[["income", "age", "age_sq", "sex"]]

OUT.mkdir(parents=True, exist_ok=True)
df.to_csv(OUT / "allbus2016_subsample.csv", index=False, encoding="utf-8")
(OUT / "allbus2016_subsample.json").write_text(json.dumps({c: df[c].tolist() for c in df.columns}, separators=(",", ":")))

# Reference benchmarks (statsmodels) for numerical-parity checks
y = df.income
m1 = sm.OLS(y, sm.add_constant(df[["age"]])).fit()
m2 = sm.OLS(y, sm.add_constant(df[["age", "age_sq"]])).fit()
f = (m1.ssr - m2.ssr) / (m2.ssr / m2.df_resid)
bench = {
    "n": N,
    "linear": {"b": m1.params.tolist(), "se": m1.bse.tolist(), "p": m1.pvalues.tolist(), "r2": m1.rsquared},
    "quadratic": {"b": m2.params.tolist(), "se": m2.bse.tolist(), "p": m2.pvalues.tolist(), "r2": m2.rsquared},
    "F_change": f, "peak_age": -m2.params.age / (2 * m2.params.age_sq),
}
(OUT / "benchmarks.json").write_text(json.dumps(bench, indent=2))
print(json.dumps(bench, indent=2))
