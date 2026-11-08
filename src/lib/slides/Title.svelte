<script>
  import { py } from '../pyodide.svelte.js';
  import Term from '../explain/Term.svelte';
</script>

<div class="hero">
  <div class="left">
    <span class="kicker">Advanced Statistics · <b>Regression</b></span>
    <h1>Does income<br />rise with age<br /><span class="mark">forever?</span></h1>
    <p class="lead">Linear vs. quadratic <Term id="ols">OLS</Term> on 350 respondents from the German General Social Survey, <Term id="allbus">ALLBUS 2016</Term>.</p>
    <p class="sub">Every number is computed live in this browser by <Term id="pyodide">Python (Pyodide)</Term>. <span class="hl">Click any pink-underlined term</span> for an explanation.</p>
  </div>
  <div class="right">
    <div class="shape s1"></div>
    <div class="shape s2"></div>
    <div class="shape s3">€</div>
    <div class="card status {py.status}">
      <b>{py.status === 'ready' ? '✓ Python ready' : py.status === 'error' ? '✕ Python error' : '◌ Loading Python…'}</b>
      <span>{py.message || 'Starting…'}</span>
    </div>
    <div class="keys card">
      <span><kbd>←</kbd><kbd>→</kbd> navigate</span>
      <span><kbd>F</kbd> fullscreen</span>
      <span><kbd>Esc</kbd> close thread</span>
    </div>
  </div>
</div>

<style>
  .hero { display: grid; grid-template-columns: 1.35fr 1fr; gap: 60px; height: 100%; align-items: center; }
  .left { display: flex; flex-direction: column; gap: 32px; align-items: flex-start; }
  .mark { background: var(--pink); padding: 0 18px; border: 4px solid var(--ink); border-radius: 22px; box-shadow: 10px 10px 0 var(--ink); display: inline-block; margin-top: 18px; }
  .lead { font-size: 36px; line-height: 1.35; margin: 18px 0 0; max-width: 1000px; }
  .sub { font-size: 26px; color: var(--muted); margin: 0; max-width: 1000px; }
  .right { position: relative; height: 100%; }
  .shape { position: absolute; border: 4px solid var(--ink); }
  .s1 { width: 380px; height: 380px; border-radius: 50%; background: var(--yellow); top: 40px; right: 40px; }
  .s2 { width: 260px; height: 260px; background: var(--sky); top: 300px; right: 300px; transform: rotate(12deg); border-radius: 24px; box-shadow: 10px 10px 0 var(--ink); }
  .s3 { width: 190px; height: 190px; background: var(--teal); border-radius: 50%; top: 110px; right: 360px; display: grid; place-items: center; font-family: var(--display); font-size: 110px; font-weight: 700; color: #fff; }
  .status { position: absolute; left: 0; right: 40px; bottom: 150px; display: flex; flex-direction: column; gap: 6px; font-size: 22px; }
  .status b { font-size: 30px; font-family: var(--display); }
  .status.ready { background: var(--teal); color: #fff; }
  .status.loading { background: var(--yellow); }
  .keys { position: absolute; left: 0; right: 40px; bottom: 20px; display: flex; gap: 26px; font-size: 20px; padding: 18px 24px; }
  kbd { display: inline-block; min-width: 34px; text-align: center; border: 2px solid var(--ink); border-radius: 6px; padding: 0 6px; margin-right: 4px; background: var(--paper); font-family: inherit; font-weight: 700; }
</style>
