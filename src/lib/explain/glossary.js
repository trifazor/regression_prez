// Explanation-thread entries. Body mini-syntax:
//   $...$ inline TeX · $$...$$ display TeX · [[id]] or [[id|label]] nested term · **bold** · blank line = paragraph
// Keep each entry short: one idea, one example, links to the next idea.
const r = String.raw;

export const glossary = {
  cef: {
    title: 'Conditional Expectation Function (CEF)',
    tag: 'Core idea',
    body: r`The CEF is the **average of $Y$ for each fixed value of $X$**. Take every 40-year-old in Germany, average their income: that number is $\mu(40) = \mathbb E[Y\mid X=40]$. Do it for every age and you get a curve.

It is the best possible predictor of $Y$ from $X$ in the sense of [[mse|mean squared error]]: no other function of $X$ makes smaller squared mistakes on average.

Regression is the art of **approximating this unknown curve** from a sample. A straight line is one guess at its shape; a [[quadratic-term|parabola]] is another.`,
  },
  mse: {
    title: 'Mean Squared Error',
    tag: 'Loss function',
    body: r`The average of squared prediction mistakes:
$$\text{MSE}(m) = \mathbb E\big[(Y - m(X))^2\big]$$
Squaring does two things: positive and negative errors cannot cancel out, and **big misses are punished much harder** than small ones (an error of 2 costs 4, an error of 10 costs 100).

That second property is why [[ols|OLS]] is sensitive to extreme incomes, see [[leverage]].`,
  },
  ols: {
    title: 'Ordinary Least Squares (OLS)',
    tag: 'Estimator',
    body: r`OLS picks the coefficients that make the sum of squared [[residual|residuals]] as small as possible:
$$\hat{\boldsymbol\beta} = \arg\min_{\mathbf b}\sum_i (y_i - \mathbf x_i^\top \mathbf b)^2 = (\mathbf X^\top\mathbf X)^{-1}\mathbf X^\top\mathbf y$$
Think of it as the sample version of finding the [[cef|CEF]] under [[mse|squared error]] when you restrict yourself to a given functional form.

Geometrically it is an [[projection|orthogonal projection]]. Algebraically it solves the [[normal-eq|normal equations]].`,
  },
  residual: {
    title: 'Residual',
    tag: 'Building block',
    body: r`The vertical distance between a data point and the fitted line:
$$e_i = y_i - \hat y_i$$
Positive: the person earns **more** than the model predicts for their age. Negative: **less**.

Residuals are the observable stand-ins for the unobservable errors $\varepsilon_i$. Squaring and summing them gives the [[rss|RSS]]; plotting them is the basis of all [[diagnostics]].`,
  },
  rss: {
    title: 'Residual Sum of Squares (RSS)',
    tag: 'Fit measure',
    body: r`$$\text{RSS} = \sum_i e_i^2$$
The total squared mistake left over after fitting. [[ols|OLS]] minimizes exactly this number.

Adding a regressor can **never increase** RSS: in the worst case OLS sets its coefficient to zero. That is why we need the [[ftest|F-test]] to ask whether a drop in RSS is bigger than chance.`,
  },
  tss: {
    title: 'Total Sum of Squares (TSS)',
    tag: 'Fit measure',
    body: r`$$\text{TSS} = \sum_i (y_i - \bar y)^2$$
The RSS of the dumbest possible model: predicting everyone earns the mean. Thanks to [[projection|orthogonality]],
$$\text{TSS} = \text{ESS} + \text{RSS}$$
total variation splits cleanly into an explained and an unexplained part. The ratio gives [[r2|R²]].`,
  },
  r2: {
    title: 'R² (coefficient of determination)',
    tag: 'Fit measure',
    body: r`$$R^2 = 1 - \frac{\text{RSS}}{\text{TSS}}$$
The share of income variation "explained" by the model. $R^2 = 0.05$ means 5%.

Low $R^2$ is **normal for individual income**: education, occupation, hours and luck matter far more than age. A low $R^2$ does **not** mean the age effect is unreal; that is a question for [[se|standard errors]] and [[pvalue|p-values]].

[[adjr2|Adjusted R²]] penalizes extra regressors.`,
  },
  adjr2: {
    title: 'Adjusted R²',
    tag: 'Fit measure',
    body: r`$$\bar R^2 = 1 - (1-R^2)\frac{n-1}{n-k}$$
Plain [[r2|R²]] always rises when you add a regressor. The adjusted version only rises if the new variable improves fit by more than you would expect by chance. With $n=350$ and $k \le 3$ the correction is tiny.`,
  },
  se: {
    title: 'Standard Error',
    tag: 'Inference',
    body: r`How much $\hat\beta_j$ would wobble if we drew a **new sample of 350 people** and re-estimated. Formally the estimated standard deviation of the sampling distribution:
$$\widehat{\text{SE}}(\hat\beta_j) = \sqrt{\hat\sigma^2\,[(\mathbf X^\top\mathbf X)^{-1}]_{jj}}$$
It shrinks with more data and with more spread in $X$. It relies on [[homoskedasticity]]; if that fails, use [[robust-se|robust SEs]].`,
  },
  tstat: {
    title: 't-statistic',
    tag: 'Inference',
    body: r`$$t_j = \frac{\hat\beta_j}{\widehat{\text{SE}}(\hat\beta_j)}$$
"How many standard errors away from zero is my estimate?" Under $H_0\!:\beta_j=0$ it follows a $t$-distribution with $n-k$ [[dof|degrees of freedom]]. Rule of thumb: $|t| > 2$ is significant at about 5%. Converted into a [[pvalue|p-value]].`,
  },
  pvalue: {
    title: 'p-value',
    tag: 'Inference',
    body: r`**If the true coefficient were zero**, how often would random sampling alone produce an estimate at least this far from zero?

$p = 0.16$ for the linear age slope: 16% of the time. Not unusual, so we do not reject $H_0$.

$p = 0.00002$ for $\beta_2$: practically never. We reject $H_0$.

It is **not** the probability that $H_0$ is true, and it says nothing about effect size.`,
  },
  ci: {
    title: '95% Confidence Band',
    tag: 'Inference',
    body: r`The shaded area around the fitted curve. At each age $x_0$ it is
$$\hat\mu(x_0) \pm t_{0.975}\,\hat\sigma\sqrt{\mathbf x_0^\top(\mathbf X^\top\mathbf X)^{-1}\mathbf x_0}$$
It covers uncertainty about the **average** income at that age, not individual incomes (that would be a much wider prediction interval).

Notice it **flares at the edges**: few respondents are 18 or 85, so the [[leverage]] there is high and the curve is less pinned down.`,
  },
  projection: {
    title: 'Orthogonal Projection',
    tag: 'Geometry',
    body: r`Treat the 350 incomes as **one point in 350-dimensional space**, $\mathbf y \in \mathbb R^{350}$. Every possible prediction $\mathbf X\mathbf b$ lives in a flat subspace: the [[colspace|column space]] of $\mathbf X$.

OLS drops a perpendicular from $\mathbf y$ onto that subspace. The foot of the perpendicular is $\hat{\mathbf y}$; the perpendicular itself is the [[residual]] vector $\mathbf e$.

Perpendicular = shortest distance = smallest [[rss|RSS]]. Same idea as the shadow of a stick at noon.`,
  },
  colspace: {
    title: 'Column Space Col(X)',
    tag: 'Geometry',
    body: r`All linear combinations of the columns of $\mathbf X$. For the linear model the columns are a vector of ones and the age vector, so Col(X) is a **2-dimensional plane** inside $\mathbb R^{350}$.

Adding $\text{age}^2$ makes it a 3-dimensional subspace. A bigger subspace can only get closer to $\mathbf y$, which is why [[rss|RSS]] can only fall.`,
  },
  'normal-eq': {
    title: 'Normal Equations',
    tag: 'Algebra',
    body: r`Setting the derivative of [[rss|RSS]] to zero gives
$$\mathbf X^\top\mathbf X\,\hat{\boldsymbol\beta} = \mathbf X^\top\mathbf y \iff \mathbf X^\top\mathbf e = \mathbf 0$$
"Normal" as in **perpendicular**: the residual is orthogonal to every regressor. Row by row:

**Constant column**: residuals sum to zero.
**Age column**: residuals are uncorrelated with age.

The deck checks this live on the projection slide.`,
  },
  hatmatrix: {
    title: 'Hat Matrix H',
    tag: 'Algebra',
    body: r`$$\mathbf H = \mathbf X(\mathbf X^\top\mathbf X)^{-1}\mathbf X^\top,\qquad \hat{\mathbf y} = \mathbf H\mathbf y$$
It "puts the hat on $y$". It is the [[projection]] matrix onto Col(X). Its diagonal entries $h_{ii}$ are the [[leverage]] values: how much observation $i$'s own $y_i$ influences its own fitted value.`,
  },
  leverage: {
    title: 'Leverage hᵢᵢ',
    tag: 'Diagnostics',
    body: r`$h_{ii}$ measures how **unusual a respondent's $X$ values** are. It does not depend on income at all. Bounds: $1/n \le h_{ii} \le 1$, average $k/n$.

Rule of thumb: flag $h_{ii} > 2k/n$. Here that means the very young and very old. With $\text{age}^2$ in the model, extreme ages are even more extreme.

High leverage + large residual = **influential point**: it can bend the curve on its own. Try dropping them in the Lab.`,
  },
  'quadratic-term': {
    title: 'Quadratic Term (Age²)',
    tag: 'Specification',
    body: r`Adding $\text{Age}^2$ lets the slope **change with age**:
$$\frac{\partial\,\mathbb E[Y\mid\text{Age}]}{\partial\,\text{Age}} = \beta_1 + 2\beta_2\,\text{Age}$$
With $\beta_1 > 0$ and $\beta_2 < 0$: steep growth when young, flattening, then decline. An inverted U.

It is still [[linear-in-params|linear regression]], because the model is linear in the $\beta$s. And it is the textbook Mincer earnings profile from [[human-capital|human capital theory]].`,
  },
  'linear-in-params': {
    title: 'Linear in Parameters',
    tag: 'Specification',
    body: r`"Linear regression" means linear in the **coefficients**, not in $X$. These are all linear regressions:
$$y = \beta_0 + \beta_1 x + \beta_2 x^2,\quad y = \beta_0 + \beta_1 \log x,\quad \log y = \beta_0 + \beta_1 x$$
OLS just sees extra columns in $\mathbf X$. This is NOT: $y = \beta_0 + x^{\beta_1}$.`,
  },
  vertex: {
    title: 'Peak Earning Age (Vertex)',
    tag: 'Interpretation',
    body: r`Where the slope of the parabola is zero:
$$\beta_1 + 2\beta_2\,\text{Age}^* = 0 \;\Rightarrow\; \text{Age}^* = -\frac{\beta_1}{2\beta_2}$$
Only a **maximum** if $\beta_2 < 0$. It is a ratio of two estimates, so it inherits their uncertainty (a delta-method SE or bootstrap would quantify it).

Careful: the quadratic is **symmetric by force**. If the true profile rises slowly and drops sharply at retirement, the parabola shifts the peak.`,
  },
  'human-capital': {
    title: 'Human Capital Theory',
    tag: 'Economics',
    body: r`Becker and Mincer: people invest in skills (school, training, experience) that raise productivity and pay. Investment is front-loaded, returns diminish, skills depreciate, and work hours fall near retirement.

Prediction: income rises steeply early, flattens, and falls late: a **concave** age-income profile. That is exactly what the [[quadratic-term|quadratic term]] can capture and a straight line cannot.`,
  },
  nested: {
    title: 'Nested Models',
    tag: 'Testing',
    body: r`Model A is nested in Model B if A is a special case of B obtained by **restricting parameters**. Setting $\beta_2 = 0$ in the quadratic gives the linear model, so linear ⊂ quadratic.

Nested models can be compared with the [[ftest|partial F-test]]. Non-nested models (e.g. log vs. quadratic) need other tools, such as AIC.`,
  },
  ftest: {
    title: 'Partial F-test',
    tag: 'Testing',
    body: r`Asks whether the bigger model's drop in [[rss|RSS]] is **too large to be chance**:
$$F = \frac{(\text{RSS}_R - \text{RSS}_U)/q}{\text{RSS}_U/(n-k_U)}$$
Numerator: improvement per added parameter ($q = 1$ here). Denominator: noise level per [[dof|degree of freedom]] in the full model.

Under $H_0$ it follows an [[fdist|F-distribution]]. With a single restriction $F = t^2$ of the added coefficient. In JASP it is called **F change**.`,
  },
  fdist: {
    title: 'F-distribution',
    tag: 'Distribution',
    body: r`The ratio of two independent chi-squared variables, each divided by its [[dof|degrees of freedom]]. With $(1, 347)$ df most of its mass is below 4: the 5% critical value is about 3.87.

An observed $F$ of 18 sits far in the right tail. Under $H_0$ such a value would occur only about 2 times in 100,000 samples.`,
  },
  dof: {
    title: 'Degrees of Freedom',
    tag: 'Inference',
    body: r`$n - k$: the number of observations minus the number of estimated coefficients. Every coefficient "uses up" one dimension to fit the data, leaving $n-k$ dimensions for the [[residual|residuals]].

That is why $\hat\sigma^2 = \text{RSS}/(n-k)$, not $/n$: dividing by $n$ would underestimate the error variance.`,
  },
  homoskedasticity: {
    title: 'Homoskedasticity',
    tag: 'Assumption',
    body: r`$$\operatorname{Var}(\varepsilon_i \mid X_i) = \sigma^2 \text{ for all } i$$
The spread of incomes around the curve is the **same at every age**. Needed for the classic [[se|standard error]] formula (not for unbiasedness).

Its violation is [[heteroskedasticity]].`,
  },
  heteroskedasticity: {
    title: 'Heteroskedasticity',
    tag: 'Diagnostics',
    body: r`The error variance changes with $X$. In a residual plot it shows up as a **funnel / fan**: narrow on one side, wide on the other.

For income it is almost guaranteed: 20-year-olds and pensioners have similar low incomes, while 50-year-olds range from part-time cleaners to managers.

Consequence: $\hat\beta$ is still unbiased, but classical [[se|SEs]] and p-values are wrong. Fix: [[robust-se|robust SEs]] or model $\log(\text{income})$.`,
  },
  'robust-se': {
    title: 'Robust (HC) Standard Errors',
    tag: 'Remedy',
    body: r`White / Huber "sandwich" standard errors that stay valid under [[heteroskedasticity]]:
$$\widehat{\operatorname{Var}}(\hat{\boldsymbol\beta}) = (\mathbf X^\top\mathbf X)^{-1}\Big(\sum_i e_i^2\,\mathbf x_i\mathbf x_i^\top\Big)(\mathbf X^\top\mathbf X)^{-1}$$
Same coefficients, different SEs. Standard practice in applied econometrics (HC1/HC3).`,
  },
  exogeneity: {
    title: 'Exogeneity: E[ε | X] = 0',
    tag: 'Assumption',
    body: r`On average the unobserved factors are zero **at every age**. This is what makes $\hat\beta$ unbiased, and it is what lets the regression line estimate the [[cef|CEF]].

It fails with omitted variables correlated with age, such as education: younger cohorts are more educated. See [[cohort|cohort effects]].`,
  },
  qq: {
    title: 'Q-Q Plot',
    tag: 'Diagnostics',
    body: r`Sorts the standardized residuals and plots them against the values a perfect normal sample of the same size would have. **Normal residuals lie on the 45° line.**

An upward bend at the right end means the top residuals are larger than a normal distribution allows: a heavy right tail, i.e. [[skew|right-skewed income]].`,
  },
  skew: {
    title: 'Right Skew',
    tag: 'Data',
    body: r`Most people earn moderate amounts; a few earn a lot. The distribution has a long right tail and **mean > median** (here about €1,700 vs. €1,500).

Logging income often makes it roughly symmetric. Then coefficients read as approximate **percentage** changes.`,
  },
  cohort: {
    title: 'Age vs. Cohort Effects',
    tag: 'Caveat',
    body: r`A **cross-section** (one survey, one year) compares different people at different ages. A 70-year-old in 2016 was born in 1946 and lived through a different labor market than a 30-year-old.

So the hump mixes three things: true aging (experience), cohort differences (education, women's participation), and retirement. Separating them needs **panel data** that follow the same people over time.`,
  },
  diagnostics: {
    title: 'Regression Diagnostics',
    tag: 'Practice',
    body: r`Checks whether the assumptions behind the numbers are plausible:

**Residuals vs. fitted**: shape (missed curvature) and spread ([[heteroskedasticity]]).
**[[qq|Q-Q plot]]**: normality.
**[[leverage|Leverage]] and influence**: points that drive the result.

Estimates are only as trustworthy as these plots allow.`,
  },
  sigma: {
    title: 'Residual Standard Error σ̂',
    tag: 'Fit measure',
    body: r`$$\hat\sigma = \sqrt{\text{RSS}/(n-k)}$$
The typical size of a prediction mistake, in euros. $\hat\sigma \approx 1{,}030$ means individual incomes typically miss the curve by about a thousand euros. That is large relative to a median of €1,500, matching the low [[r2|R²]].`,
  },
  allbus: {
    title: 'ALLBUS',
    tag: 'Data source',
    body: r`Allgemeine Bevölkerungsumfrage der Sozialwissenschaften: the German General Social Survey, run by GESIS since 1980. A random sample of adults in Germany is interviewed face-to-face every two years.

The 2016 wave also fielded the [[issp|ISSP]] 2015 "Work Orientations" module. That module is the file used here (GESIS ZA6770).`,
  },
  issp: {
    title: 'ISSP',
    tag: 'Data source',
    body: r`International Social Survey Programme: the same questionnaire module in 40+ countries. ZA6770 is "Work Orientations IV" (2015). In Germany it was collected alongside [[allbus|ALLBUS 2016]].

Personal net income is in the country-specific variable **DE_RINC** (euros per month).`,
  },
  pyodide: {
    title: 'Pyodide',
    tag: 'Tech',
    body: r`The real CPython interpreter compiled to **WebAssembly**, so it runs inside the browser. This deck loads NumPy and SciPy into it and runs every regression on your machine. No server is involved.

A refit (both models, all diagnostics) takes a few milliseconds.`,
  },
  jasp: {
    title: 'JASP',
    tag: 'Software',
    body: r`Free, open-source statistics program from the University of Amsterdam with an SPSS-like point-and-click interface. Its *Linear Regression* module supports hierarchical blocks, **R² change / F change**, and residual plots. That covers everything needed to replicate this deck.`,
  },
  'three-jobs': {
    title: 'Describe, Predict, Explain',
    tag: 'Purpose',
    body: r`The same regression output can serve three different jobs, and each job demands a different standard of evidence:

**Describe**: "In 2016, 50-year-olds earned more on average than 25-year-olds." Needs only a good sample.

**Predict**: "This 40-year-old will probably earn about €1,800." Needs a model that fits well out of sample, judged by [[sigma|σ̂]], not p-values.

**Explain**: "Getting older *causes* higher pay." Needs [[exogeneity]], the hardest bar of all. See [[causation]].`,
  },
  intercept: {
    title: 'Intercept β₀',
    tag: 'Interpretation',
    body: r`The predicted $Y$ when **every** regressor equals zero.

Sometimes meaningful: score with 0 study hours. Often not: income at age 0 is nonsense, it is just where the line crosses the axis far outside the data. See [[extrapolation]].

In the quadratic income model $\hat\beta_0$ is even negative, which is fine: nobody is aged 0.`,
  },
  slope: {
    title: 'Slope β₁',
    tag: 'Interpretation',
    body: r`The change in **predicted** $Y$ for a one-unit increase in $X$, holding other regressors fixed:
$$\hat\beta_1 = \frac{\widehat{\operatorname{Cov}}(X,Y)}{\widehat{\operatorname{Var}}(X)}\quad\text{(simple regression)}$$
Units matter: points per hour, euros per year. It describes an average pattern across people, not what happens to one person over time; for that see [[cohort]].

With a [[quadratic-term|quadratic term]] there is no single slope: it changes with $X$.`,
  },
  'gauss-markov': {
    title: 'OLS Assumptions (Gauss-Markov)',
    tag: 'Theory',
    body: r`1. **Linear in parameters** ([[linear-in-params]]).
2. **Random sample** of independent observations.
3. **No perfect collinearity**: no regressor is an exact combination of others.
4. **[[exogeneity|Exogeneity]]** $\mathbb E[\varepsilon\mid X]=0$: buys **unbiasedness**.
5. **[[homoskedasticity|Homoskedasticity]]**: buys the classical SE formula and makes OLS the **B**est **L**inear **U**nbiased **E**stimator (BLUE).
6. (Optional) **Normal errors**: exact t and F tests in small samples. Large samples get away without it.`,
  },
  dummy: {
    title: 'Dummy Variable',
    tag: 'Specification',
    body: r`A 0/1 variable for a category, e.g. $\text{female}_i = 1$ for women, 0 for men.
$$Y = \beta_0 + \beta_1 X + \beta_2\,\text{female}$$
$\beta_2$ **shifts the whole line up or down** for women. Same slope, different intercept. With $k$ categories use $k-1$ dummies; the left-out one is the reference group.

To let the slope differ too, add an [[interaction]].`,
  },
  interaction: {
    title: 'Interaction Term',
    tag: 'Specification',
    body: r`The product of two regressors, e.g. $\text{female}\times\text{age}$:
$$Y = \beta_0 + \beta_1\,\text{age} + \beta_2\,\text{female} + \beta_3\,(\text{female}\times\text{age})$$
Now the age slope is $\beta_1$ for men and $\beta_1 + \beta_3$ for women. **The effect of one variable depends on the other.**

Testing $\beta_3 = 0$ asks: do men and women have the same age profile? With several interaction terms use a joint [[ftest|F-test]].`,
  },
  'log-model': {
    title: 'Log Transformations',
    tag: 'Specification',
    body: r`Taking $\log Y$ turns absolute effects into **percentage** effects:
$$\log Y = \beta_0 + \beta_1 X \;\Rightarrow\; \text{one more unit of } X \approx 100\beta_1\,\%\text{ change in } Y$$
Useful for [[skew|right-skewed]] variables like income, and it often tames [[heteroskedasticity]]. Still [[linear-in-params|linear in parameters]].`,
  },
  ovb: {
    title: 'Omitted Variable Bias',
    tag: 'Hazard',
    body: r`If a variable $Z$ that affects $Y$ is left out **and** is correlated with $X$, the coefficient on $X$ absorbs part of $Z$'s effect:
$$\hat\beta_1 \to \beta_1 + \beta_Z \cdot \frac{\operatorname{Cov}(X,Z)}{\operatorname{Var}(X)}$$
The bias can be large enough to **flip the sign**: see [[simpson]]. It violates [[exogeneity]] and no sample size fixes it.

Remedy: measure and include $Z$, or use designs that break the link (experiments, panels, instruments).`,
  },
  simpson: {
    title: "Simpson's Paradox",
    tag: 'Hazard',
    body: r`A trend that appears in every group **reverses** when the groups are pooled.

Tutoring example: within strong students and within weak students, more tutoring means better grades. But weak students get far more tutoring, so pooled data show "tutoring lowers grades". The group is an [[ovb|omitted variable]].`,
  },
  confounder: {
    title: 'Confounder',
    tag: 'Causality',
    body: r`A third variable that drives **both** $X$ and $Y$. Temperature drives ice-cream sales and sunburns; the two correlate without one causing the other.

Leaving a confounder out produces [[ovb|omitted variable bias]]. Controlling for it (adding it as a regressor) can make the spurious coefficient collapse toward zero.`,
  },
  causation: {
    title: 'Correlation vs. Causation',
    tag: 'Causality',
    body: r`Regression measures **association**: how the average of $Y$ differs across values of $X$. It becomes causal only if [[exogeneity]] holds, meaning nothing else that moves $Y$ is tangled up with $X$.

Threats: [[confounder|confounders]], reverse causality, selection. Strong designs (randomized experiments, natural experiments, panel data) make the causal reading credible. A good fit and a tiny p-value do **not**.`,
  },
  extrapolation: {
    title: 'Extrapolation',
    tag: 'Hazard',
    body: r`Using the model outside the range of the data. The fit is only disciplined where there are observations.

Our parabola, fit on ages 18–85, predicts **negative** income around age 107, and the straight line predicts income at age 0. Polynomials are especially dangerous at the edges: they shoot off to $\pm\infty$.`,
  },
  influence: {
    title: 'Influential Point',
    tag: 'Hazard',
    body: r`A point whose removal noticeably changes the estimates. Influence needs **both**:

**High [[leverage]]**: an unusual $X$ value, far from $\bar x$.
**Large [[residual]]**: it disagrees with the pattern of the rest.

An outlier in $Y$ at an average $X$ barely moves the slope; the same outlier at the edge can tilt it entirely. Cook's distance combines both into one number.`,
  },
  vote: {
    title: 'Why predict first?',
    tag: 'Method',
    body: r`Committing to a guess **before** seeing the analysis protects against hindsight ("I knew it all along"). It is the classroom version of **pre-registration** in science: write the hypothesis down, then test it.`,
  },
};
