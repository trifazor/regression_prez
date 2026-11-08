export const hazards = [
  { n: 1, name: 'Wrong shape', icon: '⌒', term: 'linear-in-params', line: 'A straight line through a curve hides the relationship.' },
  { n: 2, name: 'Missing variable', icon: '?', term: 'ovb', line: 'A left-out factor can bias, even flip, the slope.' },
  { n: 3, name: 'One point rules', icon: '☝', term: 'influence', line: 'A single extreme point can tilt the whole line.' },
  { n: 4, name: 'Uneven noise', icon: '◁', term: 'heteroskedasticity', line: 'Spread that grows makes the SEs and p-values wrong.' },
  { n: 5, name: 'Not causal', icon: '⇄', term: 'causation', line: 'A strong, significant slope still isn’t a cause.' },
];
